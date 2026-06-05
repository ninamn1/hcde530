# Mini Project 2 — Competency Claims

## C1 — Vibecoding and Rapid Prototyping

I used **Bolt** to build and deploy **trendar**, a web app that matches uploaded reference images to named design trends. The live app is at [https://trendar.bolt.host/](https://trendar.bolt.host/). I did not stop at a single prompt — I started from a detailed plain-language spec (`bolt-prompt.md`), then iterated through multiple follow-up prompts to refine the UI, wire Gemini matching, build the gallery, and add features like day-themed landing pages.

The first draft was functional but plain: text, a simple upload box, and little visual personality. I pushed Bolt repeatedly until the app matched the design-tool aesthetic I wanted — masonry gallery, styled results page, and a landing experience that changes by day of the week.

**What the tool did well:** Bolt quickly scaffolded the core upload → match → results flow, the Supabase-backed trend library, and the gallery with trend filtering. That gave me a working backend and page structure without writing everything from scratch.

**What I had to correct or redirect:** Bolt’s default layout choices did not always match my intent. I pushed back when it suggested showing a total image count on the gallery — that felt like e-commerce, not inspiration browsing. I also spent many prompts trying to fix title text positioning and responsive layout; the desktop view looked right, but laptop breakpoints did not, and I eventually stopped on the title issue when token use got too high. My next step is to edit the exported code directly for layout fixes rather than prompting alone.

## C4 — APIs and Data Acquisition

For trendar’s core matching feature, I integrated the **Google Gemini Vision API** — an external web API I chose after comparing options for free-tier image analysis. I read Google’s API documentation to understand how to send an image input, what parameters the vision endpoint accepts, and what the JSON response looks like when asking for structured trend matches.

The app calls Gemini from a **Bolt Database Edge Function** (server-side), not from the browser. When a user uploads a reference image, the edge function sends that image plus my curated list of trend names and traits to Gemini. The API returns a JSON response with the **top 2–3 trend matches**, each with a trend name, defining traits, and a short rationale. I parse that response and use it to populate the results page; example images for each matched trend are then pulled from my Supabase trend library.

I handled the API key safely by storing **`GEMINI_API_KEY` in Bolt Edge Function secrets**, not in the React frontend or in my GitHub repository. Bolt prompted me to add the key this way before live matching would work — the same principle as using an environment variable to keep credentials out of version control.

**Note on format:** This integration runs in Bolt’s edge function (TypeScript), not in a standalone Python script like my Week 4 PokeAPI work. The workflow is the same in practice: an HTTP request to an external API, a structured JSON response, and a deliberate choice about which fields to use in the app.

## C7 — Critical Evaluation and Professional Judgment

I did not treat AI output as final — I evaluated what Bolt, Claude, and Gemini produced before shipping it in trendar.

**Example 1 — Bolt got the UX pattern wrong:** When building the gallery, Bolt suggested displaying a **total image count**. I pushed back because trendar is built around **discoverability** — visitors should keep scrolling and finding new inspiration, not treat the gallery like a catalog with a fixed inventory. A total count fits online shopping more than open-ended design browsing. I asked Bolt to remove it and kept the gallery focused on exploration and trend filtering instead.

**Example 2 — AI-generated trend traits were too generic:** Early on, I accepted trait descriptions from Claude and Cursor without much verification. When I tested matching, some definitions felt interchangeable — good enough for a draft, but not something I would trust blindly in front of a designer looking for a specific style. I overrode that output: I manually curated example images for each trend, compared definitions against online sources, and fed Claude the actual images I saved to generate sharper, image-grounded traits. I then updated the database through my admin view. I would not show a visitor-facing match result backed by generic AI-written traits without that check.

**Example 3 — Scope override on AI-driven feature creep:** My initial spec included moodboard saving, and Bolt could have kept expanding scope. Following Dr. Brock’s advice, I treated save/moodboards as a stretch goal and prioritized matching plus gallery browse — the features that directly solve the core problem. I can explain that tradeoff to a stakeholder: the deployed app does one job well (name the trend and show examples) rather than shipping a half-finished save flow under token and time limits.

**Confidence level:** I have moderate confidence in Gemini’s top 2–3 trend matches for clear, strong reference images, but I would verify ambiguous uploads against the curated examples myself before using results in a client readout. The trend library metadata is the part I trust most because I checked and revised it by hand.

## C8 — Building and Deploying a Complete Tool

My MP2 is **trendar**, a Bolt web app for a real HCD use case: helping designers who find inspiration they love but cannot name the style. A user uploads a reference image and receives the **top 2–3 matching design trends** with traits and curated example images; they can also **browse and filter a gallery** by trend. It is deployed and usable at [https://trendar.bolt.host/](https://trendar.bolt.host/) — not just a local prototype.

**Who it is for:** Design students and designers building moodboards or UI references — people who would otherwise guess search terms on Pinterest or Google (e.g., hunting for “neo-brutalism” without knowing the name).

**What I learned:** Building and deploying a complete tool took longer than designing the screens. Most of my time went to backend work — seeding the trend library, wiring Gemini matching, and iterating in Bolt — which showed me that “vibe coding” still requires scoping and judgment, not just prompts. I document what the tool does in `README.md` and what I would change in `reflection.md`.

**Something that went wrong:** I designed on my desktop and the layout looked correct there, but on my laptop — after I had run out of Bolt tokens — the responsive layout broke. I also spent many prompts trying to fix title text positioning without success. I handled it by shipping a working desktop-first MVP, documenting the limitation honestly, and planning to fix layout issues directly in the exported code rather than burning more tokens on prompts.

**What I would scope differently:** I would test responsiveness in the first build pass and invest more upfront in source-backed trend definitions, rather than accepting generic AI-written traits and revising late. I also agree with deferring moodboards: matching plus gallery was the right “complete” core for the deadline.

