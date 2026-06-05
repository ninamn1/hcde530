# Mini Project 2 — Reflection

## 1. What did you build?

**trendar** (a play on *trend* + *radar*) is a web app that helps designers name the style behind an image they love. A visitor uploads a reference image and receives the **top 2–3 matching design trends** from a curated library, each with defining traits and related example images. They can also browse a **gallery of all curated images** and filter by trend without uploading anything. The landing page includes a small extra: its theme **changes based on the day** you visit, and you can pick a preferred day theme if you like.

The app is live at [https://trendar.bolt.host/](https://trendar.bolt.host/). It is aimed at design students and designers — anyone who has scrolled Pinterest, found UI or graphic design inspiration they love, and thought *“I want more like this, but I don’t know what this style is called.”* Instead of guessing search terms and hoping the algorithm cooperates, trendar turns a vague “I like this” into named trends plus examples to explore.

Moodboards and full mobile responsiveness were planned but deferred to stay within scope. The current build focuses on matching and gallery browse, and works best on desktop.

---

## 2. What decisions did you make?

I chose **Bolt** over Lovable because the project’s core is computation in response to user input: matching an uploaded image against a trend library and returning results. Bolt is built for real logic behind a visual experience; Lovable is optimized for shipping interfaces fast.

For matching, I chose **Gemini Vision** on the free tier rather than building a custom embedding or similarity pipeline. A vision model that already understands design language was faster to deploy — I did not need to reinvent the wheel for a short deadline.

For data, I researched common graphic design trends and selected **10–15 styles**. I used Claude and Cursor to draft descriptions and traits, then refined them using the images I had saved. Images were manually curated and uploaded. The public site does not expose this, but I built an **admin view** to manage trends and add images. When traits felt too generic, I fed Claude my saved images and asked for sharper descriptions before updating the database — better inputs for more accurate visitor-facing matches.

On scope, I initially wanted matching plus save/moodboard features. Dr. Brock suggested treating save as a stretch goal, and he was right. I used most of my Bolt tokens (including a paid upgrade) on matching and the gallery. That process showed me how long backend implementation takes even for a designer-led app. I pivoted from my original MP2a declaration — a transcript prep tool in Jupyter — because I felt more passionate about this problem after living it on Pinterest, and I wanted experience with vibe-coding tools like Bolt after spending most of the quarter in Cursor.

---

## 3. What would you do differently?

I would **test responsiveness early**. I designed on my desktop and the layout looked strong there, but when I checked on my laptop — after I had already run out of tokens — it did not match my intent. Responsive layout should have been a checkpoint in the first build pass, not an afterthought.

I would also **invest more upfront in trait definitions**. At first I largely accepted whatever AI suggested, which was sometimes generic. Later I realized I should have compiled multiple definitions of each trend from online sources and example images, then synthesized those into the database. Richer, source-backed traits would likely improve matching accuracy and reduce the back-and-forth I did mid-build.

---

## 4. What does this work demonstrate?

**C1 — Vibecoding and Rapid Prototyping:** trendar started as a plain page with text and a simple upload box. Through repeated prompting and iteration in Bolt, it became the designed experience it is now. I had to judge what the tool got right (core upload → match flow, gallery structure) versus what needed refinement (visual polish, layout details).

**C4 — APIs and Data Acquisition:** I connected the app to **Gemini Vision** via a Gemini API key stored in Bolt edge function secrets. The integration is not a Python web-scraping workflow, but it is still a live API connection that powers the core matching behavior.

**C7 — Critical Evaluation and Professional Judgment:** trendar is built around **discoverability** — encouraging visitors to keep scrolling and finding new images. When Bolt suggested showing a **total image count**, I pushed back; that pattern fits e-commerce more than open-ended inspiration browsing. I also made scope calls (matching + gallery first, moodboards later) and improved trend metadata when generic AI traits were not good enough.

**C8 — Building and Deploying a Complete Tool:** MP2 is a deployed Bolt app where users upload reference images and receive trend matches that support further exploration in their design process. The biggest friction was fighting Bolt over title text positioning — I eventually stopped because it was burning tokens. My next step is to open the exported code and fix layout issues directly rather than relying only on prompts.
