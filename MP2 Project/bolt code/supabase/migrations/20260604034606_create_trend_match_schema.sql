
/*
  # Trend Match — Initial Schema

  ## Overview
  Creates the full schema for the Trend Match app: design trend library,
  user moodboards, and all supporting tables.

  ## New Tables

  ### `trends`
  - `id` (text, PK) — slug identifier e.g. "neo-brutalism"
  - `name` (text) — display name e.g. "Neo-brutalism"
  - `traits` (jsonb) — array of defining trait strings
  - `description` (text) — one-sentence description

  ### `trend_images`
  - `id` (uuid, PK)
  - `trend_id` (text, FK → trends.id)
  - `url` (text) — image URL
  - `source` (text) — e.g. "pexels"
  - `attribution` (text) — photographer credit
  - `sort_order` (int) — display ordering

  ### `moodboards`
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → auth.users)
  - `name` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `moodboard_images`
  - `id` (uuid, PK)
  - `moodboard_id` (uuid, FK → moodboards)
  - `image_url` (text)
  - `trend_name` (text)
  - `attribution` (text)
  - `sort_order` (int)
  - `added_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Trends and trend_images: public read, no write
  - Moodboards and moodboard_images: owner-only access
*/

-- ─── TRENDS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trends (
  id          text PRIMARY KEY,
  name        text NOT NULL,
  traits      jsonb NOT NULL DEFAULT '[]',
  description text NOT NULL DEFAULT ''
);

ALTER TABLE trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trends"
  ON trends FOR SELECT
  TO anon, authenticated
  USING (true);

-- ─── TREND IMAGES ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trend_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_id    text NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  url         text NOT NULL,
  source      text NOT NULL DEFAULT 'pexels',
  attribution text NOT NULL DEFAULT '',
  sort_order  int  NOT NULL DEFAULT 0
);

ALTER TABLE trend_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read trend images"
  ON trend_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS trend_images_trend_id_idx ON trend_images(trend_id);

-- ─── MOODBOARDS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS moodboards (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT 'My Moodboard',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE moodboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own moodboards"
  ON moodboards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own moodboards"
  ON moodboards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own moodboards"
  ON moodboards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own moodboards"
  ON moodboards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS moodboards_user_id_idx ON moodboards(user_id);

-- ─── MOODBOARD IMAGES ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS moodboard_images (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moodboard_id uuid NOT NULL REFERENCES moodboards(id) ON DELETE CASCADE,
  image_url    text NOT NULL,
  trend_name   text NOT NULL DEFAULT '',
  attribution  text NOT NULL DEFAULT '',
  sort_order   int  NOT NULL DEFAULT 0,
  added_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE moodboard_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own moodboard images"
  ON moodboard_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM moodboards
      WHERE moodboards.id = moodboard_images.moodboard_id
        AND moodboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own moodboard images"
  ON moodboard_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM moodboards
      WHERE moodboards.id = moodboard_images.moodboard_id
        AND moodboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own moodboard images"
  ON moodboard_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM moodboards
      WHERE moodboards.id = moodboard_images.moodboard_id
        AND moodboards.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM moodboards
      WHERE moodboards.id = moodboard_images.moodboard_id
        AND moodboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own moodboard images"
  ON moodboard_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM moodboards
      WHERE moodboards.id = moodboard_images.moodboard_id
        AND moodboards.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS moodboard_images_moodboard_id_idx ON moodboard_images(moodboard_id);
