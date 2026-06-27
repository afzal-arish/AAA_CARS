
-- Grant Data API access to cars table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
GRANT ALL ON public.cars TO service_role;

-- Anon may read public-facing columns only (excludes registration_number, contact_number, whatsapp_number)
GRANT SELECT (
  id, title, brand, model, variant, manufacturing_year, price,
  fuel_type, transmission, kilometers_driven, number_of_owners,
  car_condition, insurance_validity, location, description, features,
  featured, verified, premium, new_arrival, recently_added,
  image_urls, status, created_at, updated_at
) ON public.cars TO anon;
