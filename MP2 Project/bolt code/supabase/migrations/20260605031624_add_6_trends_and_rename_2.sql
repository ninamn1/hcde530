-- Rename existing trends
UPDATE trends SET name = 'Neo-Brutalism' WHERE id = 'neo-brutalism';
UPDATE trends SET name = '70''s Retro' WHERE id = '70s-retro-funk';

-- Add 6 new trends
INSERT INTO trends (id, name, description, traits) VALUES
(
  'frutiger-aero',
  'Frutiger Aero',
  'Glossy 2004–2013 "tech optimism" aesthetic blending nature and technology — Windows Vista wallpapers, clean water, lush greenery.',
  '["Glossy wet-looking surfaces","Water droplets and bubbles","Vivid skies, grass, and tropical fish","Aero glass translucency","Clean rounded sans-serif","Saturated blue/green palette","Optimistic and corporate-clean"]'
),
(
  'hyper-bloom',
  'Hyper Bloom',
  'Vivid, saturated digital-floral aesthetic; lush blooming nature rendered in intense, almost hyperreal color.',
  '["Oversaturated florals and botanicals","Vibrant gradients","Dense organic growth","Glossy hyperreal rendering","Bold pinks and greens"]'
),
(
  'elemental-folk',
  'Elemental Folk',
  'Earthy, handcrafted aesthetic drawing on folk art and natural materials; organic, tactile, and traditional.',
  '["Earth-tone natural palette","Handcrafted/hand-drawn marks","Folk motifs and traditional patterns","Natural textures (clay, wood, linen)","Warm and artisanal"]'
),
(
  'constructivism',
  'Constructivism',
  '1920s Russian avant-garde style built for propaganda and posters; bold, dynamic, geometric, and politically charged.',
  '["Red, black, and cream palette","Strong diagonal compositions","Heavy geometric sans-serif type often angled","Photomontage","Circles, blocks, and dynamic asymmetry","Energetic and forceful"]'
),
(
  'utilitarian',
  'Utilitarian',
  'Function-first, no-frills aesthetic inspired by technical documents, industrial labeling, and workwear; design that looks like a spec sheet.',
  '["Monospace or plain grotesque type","Technical/industrial feel","Muted or safety-orange/black palette","Grid lines, labels, and registration marks","Minimal decoration","Raw and functional"]'
),
(
  'pixel-art',
  'Pixel Art',
  'Retro digital style imitating low-resolution video-game graphics, where individual pixels are visible and celebrated.',
  '["Visible blocky pixels","Low resolution","Limited retro palette","Dithering for shading","Hard stair-stepped edges","8-bit/16-bit game nostalgia"]'
);
