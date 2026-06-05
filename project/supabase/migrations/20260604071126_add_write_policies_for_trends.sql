/*
  # Add write policies for trends and trend_images tables

  ## Problem
  The trends and trend_images tables only had SELECT policies, making them
  read-only for all users. Authenticated users could not insert, update,
  or delete rows via the app or Supabase dashboard (when using the anon/auth key).

  ## Changes
  - trends: add INSERT, UPDATE, DELETE policies for authenticated users
  - trend_images: add INSERT, UPDATE, DELETE policies for authenticated users

  ## Security
  Write access is restricted to authenticated users only.
*/

-- trends write policies
CREATE POLICY "Authenticated users can insert trends"
  ON trends FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update trends"
  ON trends FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete trends"
  ON trends FOR DELETE
  TO authenticated
  USING (true);

-- trend_images write policies
CREATE POLICY "Authenticated users can insert trend images"
  ON trend_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update trend images"
  ON trend_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete trend images"
  ON trend_images FOR DELETE
  TO authenticated
  USING (true);
