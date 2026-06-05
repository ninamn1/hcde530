/*
  # Create storage bucket for trend reference images

  ## Summary
  Sets up a public Supabase Storage bucket called `trend-images` so that
  authenticated users can upload, view, and delete their own reference images
  for each design trend.

  ## Changes
  1. New Storage Bucket
     - `trend-images` (public) — stores uploaded trend reference images
     - Max file size: 10 MB
     - Allowed types: JPEG, PNG, WebP, GIF

  2. Storage Policies
     - Public SELECT: anyone can view trend images (needed for <img> tags)
     - Authenticated INSERT: signed-in users can upload
     - Authenticated DELETE: signed-in users can delete their uploads
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trend-images',
  'trend-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view trend images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'trend-images');

CREATE POLICY "Authenticated users can upload trend images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'trend-images');

CREATE POLICY "Authenticated users can delete trend images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'trend-images');
