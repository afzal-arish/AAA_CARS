
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Storage policies for car-images (private bucket, public read, admin write)
CREATE POLICY "Public read car-images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'car-images');
CREATE POLICY "Admins upload car-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'car-images' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins update car-images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'car-images' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins delete car-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'car-images' AND public.is_admin(auth.uid()));
