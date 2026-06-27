
-- 1) Restrict sensitive columns on cars from anon
REVOKE SELECT ON public.cars FROM anon;
GRANT SELECT (
  id, title, brand, model, variant, manufacturing_year, price, fuel_type,
  transmission, kilometers_driven, number_of_owners, car_condition,
  insurance_validity, location, description, features, featured, verified,
  premium, new_arrival, recently_added, image_urls, status, created_at, updated_at
) ON public.cars TO anon;

-- Authenticated keeps full access (admins/inquirers may need contact info)
GRANT SELECT ON public.cars TO authenticated;

-- 2) Revoke EXECUTE on SECURITY DEFINER functions from public/anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- Ensure authenticated still has what it needs (policies + claim flow)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- 3) Replace permissive `true` insert on customer_inquiries with field validation
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.customer_inquiries;
CREATE POLICY "Anyone can submit inquiry"
  ON public.customer_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(customer_name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND email LIKE '%_@_%.__%'
    AND length(phone) BETWEEN 5 AND 32
    AND (message IS NULL OR length(message) <= 2000)
    AND inquiry_status = 'New'
  );

-- 4) Restrictive policy on user_roles: only super_admins can insert
CREATE POLICY "Only super admins insert roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
