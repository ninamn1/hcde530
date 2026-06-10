
/*
  # Seed 5 Design Trends with Example Images

  ## Overview
  Inserts the initial 5 design trends and 5 Pexels example images per trend
  into the trends and trend_images tables.

  ## Trends Seeded
  1. Neo-brutalism — bold borders, flat bright colors, raw typography
  2. Swiss / International Typographic Style — grid, clean type, white space
  3. Memphis Design — geometric shapes, bright colors, 80s patterns
  4. Y2K — chrome, digital glitch, early internet aesthetic
  5. Glassmorphism — frosted glass, blur, transparency layers

  ## Notes
  - Uses ON CONFLICT DO NOTHING for idempotent re-runs
  - Pexels image URLs with ?auto=compress&cs=tinysrgb&w=800
  - Attributions are placeholders; swap in real credits with actual curated images
*/

INSERT INTO trends (id, name, traits, description) VALUES
  (
    'neo-brutalism',
    'Neo-brutalism',
    '["bold black borders", "flat bright colors", "raw sans-serif typography", "hard drop shadows", "asymmetric layouts"]'::jsonb,
    'A web and UI movement that embraces raw, unpolished aesthetics with heavy borders, flat bright fills, and deliberately "ugly" but bold compositions.'
  ),
  (
    'swiss-international',
    'Swiss / International Typographic Style',
    '["strict grid systems", "abundant white space", "sans-serif type (Helvetica/Akzidenz)", "flush-left ragged-right text", "objective photographic imagery"]'::jsonb,
    'Born in 1950s Switzerland, this style prioritises mathematical grids, neutral typefaces, and clarity over ornamentation.'
  ),
  (
    'memphis-design',
    'Memphis Design',
    '["geometric squiggles and shapes", "clashing bright colors", "bold pattern mixing", "primary + pastel palette", "postmodern playfulness"]'::jsonb,
    'An Italian postmodern design movement from the 1980s defined by playful geometry, clashing colours, and a deliberate rejection of good taste.'
  ),
  (
    'y2k',
    'Y2K',
    '["chrome and metallic textures", "pixel art and digital glitch", "cyber blue and lime green palette", "bubbly 3D text", "early-internet iconography"]'::jsonb,
    'Nostalgia for the turn-of-the-millennium internet era — holographic surfaces, low-poly 3D, bubble fonts, and an optimistic tech-utopia palette.'
  ),
  (
    'glassmorphism',
    'Glassmorphism',
    '["frosted glass panels", "background blur (backdrop-filter)", "semi-transparent fills", "subtle white border highlights", "layered depth"]'::jsonb,
    'A UI trend popularised by Apple and Microsoft that uses blurred, translucent glass-like surfaces to create depth and hierarchy.'
  )
ON CONFLICT (id) DO NOTHING;

-- Neo-brutalism images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('neo-brutalism', 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Anni Roenkae on Pexels', 0),
  ('neo-brutalism', 'https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Anni Roenkae on Pexels', 1),
  ('neo-brutalism', 'https://images.pexels.com/photos/1568607/pexels-photo-1568607.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Ylanite Koppens on Pexels', 2),
  ('neo-brutalism', 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Anni Roenkae on Pexels', 3),
  ('neo-brutalism', 'https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Steve Johnson on Pexels', 4);

-- Swiss / International images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('swiss-international', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 0),
  ('swiss-international', 'https://images.pexels.com/photos/374085/pexels-photo-374085.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 1),
  ('swiss-international', 'https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 2),
  ('swiss-international', 'https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Designecologist on Pexels', 3),
  ('swiss-international', 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Dom J on Pexels', 4);

-- Memphis Design images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('memphis-design', 'https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Rawpixel on Pexels', 0),
  ('memphis-design', 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Daria Shevtsova on Pexels', 1),
  ('memphis-design', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Steve Johnson on Pexels', 2),
  ('memphis-design', 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Anthony Beck on Pexels', 3),
  ('memphis-design', 'https://images.pexels.com/photos/3284702/pexels-photo-3284702.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Karolina Grabowska on Pexels', 4);

-- Y2K images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('y2k', 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 0),
  ('y2k', 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Rakicevic Nenad on Pexels', 1),
  ('y2k', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Christina Morillo on Pexels', 2),
  ('y2k', 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Josh Sorenson on Pexels', 3),
  ('y2k', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Christina Morillo on Pexels', 4);

-- Glassmorphism images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('glassmorphism', 'https://images.pexels.com/photos/3137075/pexels-photo-3137075.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 0),
  ('glassmorphism', 'https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 1),
  ('glassmorphism', 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 2),
  ('glassmorphism', 'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Anni Roenkae on Pexels', 3),
  ('glassmorphism', 'https://images.pexels.com/photos/2179474/pexels-photo-2179474.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Anni Roenkae on Pexels', 4);
