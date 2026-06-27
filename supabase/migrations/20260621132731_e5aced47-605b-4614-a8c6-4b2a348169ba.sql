
-- Roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','super_admin'))
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Super admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Cars
CREATE TABLE public.cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  variant text,
  registration_number text,
  manufacturing_year int NOT NULL,
  price numeric(12,2) NOT NULL,
  fuel_type text NOT NULL,
  transmission text NOT NULL,
  kilometers_driven int NOT NULL DEFAULT 0,
  number_of_owners text NOT NULL DEFAULT 'First Owner',
  car_condition text NOT NULL DEFAULT 'Good',
  insurance_validity date,
  location text NOT NULL DEFAULT 'Chennai',
  description text,
  features text[] NOT NULL DEFAULT '{}',
  contact_number text,
  whatsapp_number text,
  featured boolean NOT NULL DEFAULT false,
  verified boolean NOT NULL DEFAULT false,
  premium boolean NOT NULL DEFAULT false,
  new_arrival boolean NOT NULL DEFAULT false,
  recently_added boolean NOT NULL DEFAULT true,
  image_urls text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active', -- active | sold | archived
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cars TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cars TO authenticated;
GRANT ALL ON public.cars TO service_role;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active cars" ON public.cars
  FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "Authenticated can view active cars" ON public.cars
  FOR SELECT TO authenticated USING (status = 'active' OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage cars" ON public.cars
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER cars_touch BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE INDEX cars_status_idx ON public.cars(status);
CREATE INDEX cars_brand_idx ON public.cars(brand);
CREATE INDEX cars_price_idx ON public.cars(price);

-- Customer inquiries
CREATE TABLE public.customer_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES public.cars(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text,
  message text,
  inquiry_status text NOT NULL DEFAULT 'New', -- New | Contacted | Scheduled Test Drive | Converted | Closed
  scheduled_test_drive timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.customer_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.customer_inquiries TO authenticated;
GRANT ALL ON public.customer_inquiries TO service_role;
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiry" ON public.customer_inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins manage inquiries" ON public.customer_inquiries
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins update inquiries" ON public.customer_inquiries
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete inquiries" ON public.customer_inquiries
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE TRIGGER inquiries_touch BEFORE UPDATE ON public.customer_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Claim first super admin (callable when no admin exists)
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role IN ('super_admin','admin')) THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'super_admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
