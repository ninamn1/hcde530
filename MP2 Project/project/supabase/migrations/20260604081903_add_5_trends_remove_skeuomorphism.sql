/*
  # Add 5 new trends and remove Skeuomorphism

  1. Deleted trends
    - `skeuomorphism` — removed per request

  2. New trends
    - `maximalism`, `minimalism`, `bauhaus`, `psychedelic`, `flat-design`
*/

DELETE FROM trend_images WHERE trend_id = 'skeuomorphism';
DELETE FROM trends WHERE id = 'skeuomorphism';

INSERT INTO trends (id, name, description, traits) VALUES
(
  'maximalism',
  'Maximalism',
  '"More is more" — a deliberately excessive, layered aesthetic that fills space with color, pattern, and detail for a bold, abundant feel.',
  '["Dense, busy layouts with little empty space", "Clashing or saturated color combinations", "Layered patterns and textures", "Mixed typefaces", "Eclectic decorative elements", "Intentional visual overload"]'::jsonb
),
(
  'minimalism',
  'Minimalism',
  '"Less is more" — stripped to essentials, relying on generous empty space, restraint, and a few deliberate elements.',
  '["Abundant white/negative space", "Limited palette (often monochrome or 1–2 accents)", "Clean sans-serif type", "Few elements", "Strong alignment and simplicity", "Calm, uncluttered feel"]'::jsonb
),
(
  'bauhaus',
  'Bauhaus',
  'Early-20th-century German school style uniting art and function through primary colors and pure geometric form.',
  '["Primary colors (red, blue, yellow) plus black/white", "Basic geometric shapes (circle, square, triangle)", "Asymmetric but balanced grids", "Sans-serif geometric type", "Function-driven, no ornamentation", "Bold simple compositions"]'::jsonb
),
(
  'psychedelic',
  'Psychedelic',
  '1960s counterculture style evoking a hallucinatory experience through warping type, intense color, and swirling motion.',
  '["Vibrant, contrasting, almost vibrating colors", "Melting/warping/liquefied typography", "Swirling paisley and kaleidoscopic patterns", "Optical-illusion effects", "Dense flowing composition", "Trippy, hand-drawn energy"]'::jsonb
),
(
  'flat-design',
  'Flat Design',
  'Clean two-dimensional style that removes all depth cues — no shadows or gradients — for crisp, simple, screen-friendly graphics.',
  '["No shadows, gradients, or texture", "Solid blocks of bright color", "Simple 2D icons and illustrations", "Clean sans-serif type", "Clear and functional", "Deliberate opposite of skeuomorphism"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
