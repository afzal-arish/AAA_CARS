
-- Revoke SELECT on sensitive columns from anon (public visitors)
REVOKE SELECT (contact_number, whatsapp_number, registration_number) ON public.cars FROM anon;
REVOKE ALL ON public.cars FROM PUBLIC;

-- Ensure anon can still read safe columns
GRANT SELECT (
  id, title, brand, model, variant, price, fuel_type, transmission,
  kilometers_driven, number_of_owners, car_condition, manufacturing_year,
  insurance_validity, location, description, features, featured, verified,
  premium, new_arrival, recently_added, image_urls, status, created_at, updated_at
) ON public.cars TO anon;

-- Authenticated users (admins via RLS) keep full access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
GRANT ALL ON public.cars TO service_role;

-- Revoke EXECUTE on internal SECURITY DEFINER helpers from authenticated/public.
-- RLS still evaluates them as the function owner via SECURITY DEFINER.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon, authenticated;
