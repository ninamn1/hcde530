# Bolt Prompt — Trend Match

Copy everything below the line into Bolt as your initial build prompt.

---

Build a web app called **Trend Match** — a design trend identifier and moodboard tool for design students and designers.

## What it solves
Users upload a reference image they love but can't name. The app matches it against a curated library of named design trends and returns the top 2–3 candidates with defining traits and example images — so users stop guessing search terms or relying on Pinterest's algorithm. Logged-in users can save images to Pinterest-style moodboards and export them as PNG.

## Core user flows

### Flow 1 — Match (no login required)
1. User lands on home page and uploads a reference image (drag-and-drop or file picker).
2. App sends the image to **Google Gemini API (vision, free tier)** along with the full list of trend names + traits from the curated library.
3. Results page shows **top 2–3 trend matches**, each with:
   - Trend name
   - 2–3 defining traits
   - One-sentence rationale for why it matched
   - Grid of **5–10 curated example images** from that trend's library (not generic stock)
4. User can click "Add to moodboard" on any example image (prompts login if not signed in).

### Flow 2 — Browse gallery (no login required)
1. Dedicated gallery page showing all curated images in a masonry/Pinterest-style grid.
2. Filter by trend name.
3. Click an image to see its trend name + traits.
4. "Add to moodboard" on any image (login required).

### Flow 3 — Moodboard (login required)
1. Sign up / log in via **Supabase Auth** (email or Google — only required for moodboards).
2. Create named moodboards.
3. Add images from match results or browse gallery.
4. Edit moodboards: remove images, reorder (drag or simple controls).
5. View moodboards in-app.
6. Export moodboard as **PNG download**.

**Important:** Upload, match, and browse work **without an account**. Login is **only** for creating and saving moodboards.

## Tech stack
- **Bolt** + React
- **Supabase** for auth and moodboard persistence
- **Google Gemini API** (free tier, vision) for image → trend matching
- Store `GEMINI_API_KEY` in secrets — never expose in client code; call Gemini from a server-side edge function or API route

## Trend matching logic
- Use Gemini vision — **not** custom embedding/ML pipelines.
- Prompt Gemini with the uploaded image + JSON list of all trends (name + traits).
- Ask for **top 2–3 matches only** from the provided list, with a one-sentence rationale each.
- **Never invent trend names** outside the library.
- On API failure, show a friendly error message — do not silently guess.

## Curated trend library (seed data)
Create a **fixed seed dataset** in Supabase (or static JSON loaded at build time) — no admin UI, no runtime scraping.

**15 trends** (start with 5 fully populated if needed, structure for all 15):
1. Neo-brutalism
2. Brutalism (web/UI)
3. Swiss / International Typographic Style
4. Memphis Design
5. Y2K
6. Glassmorphism
7. Art Deco
8. Minimalism
9. Maximalism
10. Bauhaus
11. Flat Design
12. Grunge
13. Vaporwave
14. Retro-futurism
15. Art Nouveau

Each trend:
```json
{
  "id": "neo-brutalism",
  "name": "Neo-brutalism",
  "traits": ["bold borders", "high contrast", "raw typography", "flat bright colors"],
  "images": [
    { "url": "https://...", "source": "unsplash", "attribution": "Photo by ..." }
  ]
}
```

Target **5–10 example images per trend** (~75–150 total). Use Unsplash URLs or placeholder images for the initial build — I will swap in my own curated images later.

## Pages to build
1. **Home** — hero, upload zone, brief explanation, link to gallery
2. **Results** — top 2–3 matches with traits, rationale, example grids, add-to-moodboard buttons
3. **Gallery** — all images, filterable by trend, add-to-moodboard
4. **Moodboards** — list user's boards (auth required)
5. **Moodboard detail** — editable grid, rename, delete images, reorder, export PNG
6. **Auth** — login/signup modal or page (Supabase)

## UI / design direction
- Clean, modern, design-tool aesthetic — think Pinterest meets a design portfolio site
- Pinterest-style masonry grids for gallery and moodboards
- Mobile-friendly
- Clear typography; trend name and traits prominent on results
- Subtle "Add to board" affordance on hover over images
- Loading state while Gemini processes the upload

## Build order (follow this sequence)
1. Seed trend data (5 trends × 5 placeholder images minimum)
2. Home + upload + Results page (static mock results first)
3. Wire Gemini vision matching
4. Browse gallery with trend filter
5. Supabase auth
6. Moodboard CRUD (create, add/remove images, reorder)
7. PNG export
8. Polish UI and responsive layout

## Out of scope — do NOT build
- Admin panel or live library editing
- Image scraping from Pinterest or Google
- Paid APIs or custom ML/embeddings
- Audio, transcripts, or non-image inputs
- Social sharing or public moodboard URLs

## Database schema (suggested)
- `trends` — id, name, traits (jsonb)
- `trend_images` — id, trend_id, url, source, attribution
- `moodboards` — id, user_id, name, created_at
- `moodboard_images` — id, moodboard_id, image_url, trend_name, sort_order

Start with step 1: create the database schema and seed 5 trends with placeholder Unsplash images so we can build the UI immediately.

## Follow-up prompts (use after initial build)
- "Seed all 15 trends and add placeholder Unsplash images for each."
- "Add the Gemini edge function for image → trend matching with top 2–3 results."
- "Wire Supabase auth — login required only for moodboard features."
