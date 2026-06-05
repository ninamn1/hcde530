/*
  # Fix trend_images foreign key to allow trend id updates

  ## Problem
  trend_images.trend_id references trends.id with ON UPDATE NO ACTION.
  Renaming a trend's id (slug) fails because child rows in trend_images
  still point to the old id value.

  ## Change
  Drop and recreate the foreign key with ON UPDATE CASCADE so that
  updating a trend id automatically updates all referencing trend_images rows.
*/

ALTER TABLE trend_images
  DROP CONSTRAINT trend_images_trend_id_fkey;

ALTER TABLE trend_images
  ADD CONSTRAINT trend_images_trend_id_fkey
  FOREIGN KEY (trend_id)
  REFERENCES trends (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE;
