import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured. Please add GEMINI_API_KEY to your edge function secrets." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: trends, error: trendsError } = await supabase
      .from("trends")
      .select("id, name, description, traits")
      .order("name");

    if (trendsError || !trends?.length) {
      console.error("Failed to load trends:", trendsError);
      return new Response(
        JSON.stringify({ error: "Failed to load trend library from database." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { imageBase64, mimeType = "image/jpeg" } = body;

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "Missing imageBase64 in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trendListJson = JSON.stringify(
      trends.map((t) => ({ id: t.id, name: t.name, description: t.description, traits: t.traits })),
      null,
      2
    );

    const prompt = `You are a design trend expert. Analyze the provided image and identify the top 2-3 design trends it most closely matches from the following curated list ONLY. Do not invent trend names outside this list.

Trend library:
${trendListJson}

Return a JSON array of 2-3 objects. Each object must have:
- "trend_id": the id field from the list above (exact string)
- "trend_name": the name field from the list above (exact string)
- "rationale": one sentence explaining why this image matches this trend
- "confidence": "high" | "medium" | "low"

Respond with ONLY valid JSON. No markdown fences, no explanation.

Example response:
[
  {
    "trend_id": "neo-brutalism",
    "trend_name": "Neo-brutalism",
    "rationale": "The image features heavy black borders, flat primary-color fills, and an asymmetric grid layout characteristic of neo-brutalist design.",
    "confidence": "high"
  }
]`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageBase64,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      let detail = "Gemini API request failed.";
      try {
        const parsed = JSON.parse(errText);
        detail = parsed?.error?.message ?? detail;
      } catch { /* ignore */ }
      return new Response(
        JSON.stringify({ error: detail }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiRes.json();
    const parts: { thought?: boolean; text?: string }[] = geminiData?.candidates?.[0]?.content?.parts ?? [];
    const rawText = (parts.find((p) => !p.thought && typeof p.text === "string") ?? parts[0])?.text ?? "";

    let matches;
    try {
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      matches = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse Gemini response:", rawText);
      return new Response(
        JSON.stringify({ error: `Gemini returned unexpected output: ${rawText.slice(0, 300)}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const enriched = matches.map((m: { trend_id: string; trend_name: string; rationale: string; confidence: string }) => {
      const lib = trends.find((t) => t.id === m.trend_id);
      return {
        trend_id: m.trend_id,
        trend_name: m.trend_name,
        rationale: m.rationale,
        confidence: m.confidence,
        traits: lib?.traits ?? [],
      };
    });

    return new Response(JSON.stringify({ matches: enriched }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
