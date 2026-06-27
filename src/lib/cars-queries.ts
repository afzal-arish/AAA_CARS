import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CarRow = {
  id: string;
  title: string;
  brand: string;
  model: string;
  variant: string | null;
  registration_number: string | null;
  manufacturing_year: number;
  price: number;
  fuel_type: string;
  transmission: string;
  kilometers_driven: number;
  number_of_owners: string;
  car_condition: string;
  insurance_validity: string | null;
  location: string;
  description: string | null;
  features: string[];
  contact_number: string | null;
  whatsapp_number: string | null;
  featured: boolean;
  verified: boolean;
  premium: boolean;
  new_arrival: boolean;
  recently_added: boolean;
  image_urls: string[];
  status: string;
  created_at: string;
  updated_at: string;
};

// Public-safe columns (excludes registration_number, contact_number, whatsapp_number)
const PUBLIC_COLUMNS =
  "id,title,brand,model,variant,manufacturing_year,price,fuel_type,transmission,kilometers_driven,number_of_owners,car_condition,insurance_validity,location,description,features,featured,verified,premium,new_arrival,recently_added,image_urls,status,created_at,updated_at";

function isAuthed() {
  if (typeof window === "undefined") return false;
  try {
    // Fast sync check: any sb-*-auth-token key in localStorage means a session is hydrated
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) return true;
    }
  } catch {}
  return false;
}

export const carsQueryOptions = (opts?: { includeAll?: boolean }) =>
  queryOptions({
    queryKey: ["cars", opts?.includeAll ? "all" : "active"],
    queryFn: async (): Promise<CarRow[]> => {
      const cols = isAuthed() ? "*" : PUBLIC_COLUMNS;
      let q = supabase.from("cars").select(cols).order("created_at", { ascending: false });
      if (!opts?.includeAll) q = q.eq("status", "active");
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as CarRow[];
    },
  });

export const carQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["car", id],
    queryFn: async (): Promise<CarRow | null> => {
      const cols = isAuthed() ? "*" : PUBLIC_COLUMNS;
      const { data, error } = await supabase.from("cars").select(cols).eq("id", id).maybeSingle();
      if (error) throw error;
      return (data as unknown as CarRow) ?? null;
    },
  });

export const inquiriesQueryOptions = queryOptions({
  queryKey: ["inquiries"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("customer_inquiries")
      .select("*, cars(title, brand, model)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});