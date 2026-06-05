/*
  # Seed 5 additional design trends

  ## New Trends
  1. Skeuomorphism — realistic textures, physical depth, material simulation
  2. Claymorphism — soft inflated 3D pastel shapes, molded-clay look
  3. Art Deco — 1920s–30s geometry, symmetry, gold/black luxury
  4. Vaporwave — '80s–'90s surreal digital nostalgia, pastel gradients, retro tech
  5. 70s Retro / Funk — earthy warm palette, groovy typography, organic shapes

  ## Notes
  - Uses ON CONFLICT DO NOTHING for idempotent re-runs
  - 5 Pexels images per trend
*/

INSERT INTO trends (id, name, traits, description) VALUES
  (
    'skeuomorphism',
    'Skeuomorphism',
    '["realistic textures (leather, paper, metal, wood)", "drop shadows and highlights simulating real light", "3D depth and bevels", "buttons that look physically pressable", "gradients mimicking material surfaces", "high detail and realism"]'::jsonb,
    'Design that mimics real-world materials and objects, using realistic texture, depth, and lighting so digital elements look physical — think early iPhone icons with leather stitching, felt, and brushed metal.'
  ),
  (
    'claymorphism',
    'Claymorphism',
    '["rounded, inflated 3D forms", "soft pastel palette", "double inner and outer shadows for a puffy look", "thick rounded corners", "matte non-glossy surfaces", "playful and approachable feel"]'::jsonb,
    'Soft, puffy, inflated 3D shapes in pastel colors that look like molded clay or marshmallow — friendly and tactile.'
  ),
  (
    'art-deco',
    'Art Deco',
    '["strong symmetry", "geometric patterns (chevrons, zigzags, sunbursts, fans)", "gold and black and deep jewel tones", "elegant high-contrast serif or geometric type", "vertical stepped skyscraper lines", "ornate but orderly"]'::jsonb,
    '1920s–30s luxury aesthetic built on geometry, symmetry, and elegance — gold, black, and bold linear ornamentation.'
  ),
  (
    'vaporwave',
    'Vaporwave',
    '["pink/purple/teal pastel gradients", "grids and wireframe horizons", "classical statue busts", "retro tech (old computers, VHS glitch)", "Japanese katakana text", "chrome 3D text", "melancholic/dreamy tone"]'::jsonb,
    'Surreal, nostalgic ''80s–''90s digital aesthetic — pastel sunsets, retro tech, and Greco-Roman statues, with a dreamy, ironic mood.'
  ),
  (
    '70s-retro-funk',
    '70s Retro / Funk',
    '["earth-tone palette (burnt orange, mustard, brown, avocado green)", "bubbly rounded groovy typography", "wavy/swirling organic shapes", "sunburst and rainbow arc motifs", "tight repeating patterns", "warm, optimistic feel"]'::jsonb,
    'Warm, groovy 1970s graphic style — earthy colors, rounded funky lettering, and organic flowing shapes.'
  )
ON CONFLICT (id) DO NOTHING;

-- Skeuomorphism images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('skeuomorphism', 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 0),
  ('skeuomorphism', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 1),
  ('skeuomorphism', 'https://images.pexels.com/photos/247929/pexels-photo-247929.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 2),
  ('skeuomorphism', 'https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 3),
  ('skeuomorphism', 'https://images.pexels.com/photos/133619/pexels-photo-133619.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 4);

-- Claymorphism images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('claymorphism', 'https://images.pexels.com/photos/3800517/pexels-photo-3800517.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 0),
  ('claymorphism', 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 1),
  ('claymorphism', 'https://images.pexels.com/photos/3756168/pexels-photo-3756168.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 2),
  ('claymorphism', 'https://images.pexels.com/photos/4050302/pexels-photo-4050302.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 3),
  ('claymorphism', 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Daria Shevtsova on Pexels', 4);

-- Art Deco images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('art-deco', 'https://images.pexels.com/photos/1010519/pexels-photo-1010519.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pixabay on Pexels', 0),
  ('art-deco', 'https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 1),
  ('art-deco', 'https://images.pexels.com/photos/2246771/pexels-photo-2246771.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 2),
  ('art-deco', 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 3),
  ('art-deco', 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 4);

-- Vaporwave images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('vaporwave', 'https://images.pexels.com/photos/1910236/pexels-photo-1910236.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 0),
  ('vaporwave', 'https://images.pexels.com/photos/1637439/pexels-photo-1637439.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 1),
  ('vaporwave', 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 2),
  ('vaporwave', 'https://images.pexels.com/photos/2694434/pexels-photo-2694434.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 3),
  ('vaporwave', 'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 4);

-- 70s Retro / Funk images
INSERT INTO trend_images (trend_id, url, source, attribution, sort_order) VALUES
  ('70s-retro-funk', 'https://images.pexels.com/photos/1187079/pexels-photo-1187079.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 0),
  ('70s-retro-funk', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 1),
  ('70s-retro-funk', 'https://images.pexels.com/photos/3094218/pexels-photo-3094218.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 2),
  ('70s-retro-funk', 'https://images.pexels.com/photos/1545654/pexels-photo-1545654.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 3),
  ('70s-retro-funk', 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=800', 'pexels', 'Photo by Pexels', 4);
