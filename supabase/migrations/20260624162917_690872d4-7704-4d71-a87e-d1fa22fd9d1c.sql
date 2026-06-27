
-- Restore anon SELECT on safe (non-sensitive) columns of cars so the public homepage can list inventory.
-- Sensitive columns (registration_number, contact_number, whatsapp_number) remain hidden from anon.
GRANT SELECT (
  id, title, brand, model, variant, manufacturing_year, price,
  fuel_type, transmission, kilometers_driven, number_of_owners,
  car_condition, insurance_validity, location, description, features,
  featured, verified, premium, new_arrival, recently_added,
  image_urls, status, created_at, updated_at
) ON public.cars TO anon;

-- Allow anyone to read objects in the car-images bucket so listing thumbnails load
-- (bucket is private but a permissive storage.objects SELECT policy enables /object/public/ reads via signed flow; we add a public read policy).
DROP POLICY IF EXISTS "Public read car images" ON storage.objects;
CREATE POLICY "Public read car images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'car-images');

-- Allow admins to upload/update/delete car images
DROP POLICY IF EXISTS "Admins manage car images" ON storage.objects;
CREATE POLICY "Admins manage car images"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'car-images' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'car-images' AND public.is_admin(auth.uid()));
