import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { CONDITIONS, FEATURES, FUEL_TYPES, OWNERS, TRANSMISSIONS } from "@/lib/format";
import type { CarRow } from "@/lib/cars-queries";
import { Upload, X } from "lucide-react";
import { StorageImage } from "@/components/storage-image";

const schema = z.object({
  title: z.string().trim().min(2).max(140),
  brand: z.string().trim().min(1).max(60),
  model: z.string().trim().min(1).max(80),
  variant: z.string().trim().max(120).optional().or(z.literal("")),
  registration_number: z.string().trim().max(40).optional().or(z.literal("")),
  manufacturing_year: z.number().int().min(1980).max(2030),
  price: z.number().min(1),
  fuel_type: z.string(),
  transmission: z.string(),
  kilometers_driven: z.number().min(0),
  number_of_owners: z.string(),
  car_condition: z.string(),
  insurance_validity: z.string().optional().or(z.literal("")),
  location: z.string().trim().min(1).max(80),
  description: z.string().max(4000).optional().or(z.literal("")),
  contact_number: z.string().trim().max(20).optional().or(z.literal("")),
  whatsapp_number: z.string().trim().max(20).optional().or(z.literal("")),
  status: z.enum(["active","sold","archived"]),
});
type FormData = z.infer<typeof schema>;

const FLAGS = ["featured","verified","premium","new_arrival","recently_added"] as const;
type Flag = typeof FLAGS[number];

export function CarForm({ initial }: { initial?: CarRow }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [features, setFeatures] = useState<string[]>(initial?.features ?? []);
  const [flags, setFlags] = useState<Record<Flag, boolean>>({
    featured: initial?.featured ?? false,
    verified: initial?.verified ?? false,
    premium: initial?.premium ?? false,
    new_arrival: initial?.new_arrival ?? false,
    recently_added: initial?.recently_added ?? true,
  });
  const [images, setImages] = useState<string[]>(initial?.image_urls ?? []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initial ? {
      title: initial.title, brand: initial.brand, model: initial.model,
      variant: initial.variant ?? "", registration_number: initial.registration_number ?? "",
      manufacturing_year: initial.manufacturing_year, price: initial.price,
      fuel_type: initial.fuel_type, transmission: initial.transmission,
      kilometers_driven: initial.kilometers_driven, number_of_owners: initial.number_of_owners,
      car_condition: initial.car_condition,
      insurance_validity: initial.insurance_validity ?? "",
      location: initial.location, description: initial.description ?? "",
      contact_number: initial.contact_number ?? "",
      whatsapp_number: initial.whatsapp_number ?? "",
      status: (initial.status as "active") ?? "active",
    } : {
      manufacturing_year: 2022, fuel_type: "Petrol", transmission: "Manual",
      car_condition: "Good", number_of_owners: "First Owner", location: "Chennai", status: "active",
      kilometers_driven: 0, price: 500000,
    },
  });

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error } = await supabase.storage.from("car-images").upload(path, file, { upsert: false });
      if (error) { toast.error(`Upload failed: ${error.message}`); continue; }
      const { data } = supabase.storage.from("car-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    setImages((p) => [...p, ...uploaded]);
    setUploading(false);
    if (uploaded.length) toast.success(`${uploaded.length} image(s) uploaded`);
  };

  const onSubmit = async (v: FormData) => {
    setSubmitting(true);
    const payload = {
      ...v,
      variant: v.variant || null,
      registration_number: v.registration_number || null,
      insurance_validity: v.insurance_validity || null,
      description: v.description || null,
      contact_number: v.contact_number || null,
      whatsapp_number: v.whatsapp_number || null,
      features,
      image_urls: images,
      ...flags,
    };
    const op = initial
      ? supabase.from("cars").update(payload).eq("id", initial.id)
      : supabase.from("cars").insert(payload);
    const { error } = await op;
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Car updated" : "Car added");
    qc.invalidateQueries({ queryKey: ["cars"] });
    navigate({ to: "/admin/cars" });
  };

  const sel = (name: keyof FormData) => watch(name) as string;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Section title="Basic Details">
        <Grid>
          <Field label="Car Title" error={errors.title?.message}><Input {...register("title")} placeholder="2020 Honda City ZX CVT" /></Field>
          <Field label="Brand" error={errors.brand?.message}><Input {...register("brand")} placeholder="Honda" /></Field>
          <Field label="Model" error={errors.model?.message}><Input {...register("model")} placeholder="City" /></Field>
          <Field label="Variant"><Input {...register("variant")} placeholder="ZX CVT" /></Field>
          <Field label="Registration Number"><Input {...register("registration_number")} placeholder="TN 01 AB 1234" /></Field>
          <Field label="Manufacturing Year" error={errors.manufacturing_year?.message}><Input type="number" {...register("manufacturing_year", { valueAsNumber: true })} /></Field>
        </Grid>
      </Section>

      <Section title="Pricing & Ownership">
        <Grid>
          <Field label="Price (₹)" error={errors.price?.message}><Input type="number" step="1000" {...register("price", { valueAsNumber: true })} /></Field>
          <Field label="Kilometers Driven" error={errors.kilometers_driven?.message}><Input type="number" {...register("kilometers_driven", { valueAsNumber: true })} /></Field>
          <Field label="Number of Owners">
            <Select value={sel("number_of_owners")} onValueChange={(v) => setValue("number_of_owners", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{OWNERS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Condition">
            <Select value={sel("car_condition")} onValueChange={(v) => setValue("car_condition", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CONDITIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Fuel Type">
            <Select value={sel("fuel_type")} onValueChange={(v) => setValue("fuel_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FUEL_TYPES.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Transmission">
            <Select value={sel("transmission")} onValueChange={(v) => setValue("transmission", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TRANSMISSIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Insurance Validity"><Input type="date" {...register("insurance_validity")} /></Field>
          <Field label="Location" error={errors.location?.message}><Input {...register("location")} /></Field>
          <Field label="Status">
            <Select value={sel("status")} onValueChange={(v) => setValue("status", v as "active")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Grid>
      </Section>

      <Section title="Description & Contact">
        <Field label="Description"><Textarea rows={5} {...register("description")} placeholder="Single owner, full service history…" /></Field>
        <Grid>
          <Field label="Contact Number"><Input {...register("contact_number")} placeholder="9443240376" /></Field>
          <Field label="WhatsApp Number"><Input {...register("whatsapp_number")} placeholder="9443240376" /></Field>
        </Grid>
      </Section>

      <Section title="Features">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {FEATURES.map((f) => (
            <label key={f} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm cursor-pointer hover:bg-muted/50">
              <Checkbox checked={features.includes(f)} onCheckedChange={(c) => setFeatures(c ? [...features, f] : features.filter(x => x !== f))} />
              {f}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          {FLAGS.map((f) => (
            <label key={f} className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm cursor-pointer hover:bg-muted/50 capitalize">
              <Checkbox checked={flags[f]} onCheckedChange={(c) => setFlags({ ...flags, [f]: !!c })} />
              {f.replace("_", " ")}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Images">
        <div className="rounded-2xl border-2 border-dashed border-border/80 bg-muted/30 p-6">
          <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="font-medium">{uploading ? "Uploading…" : "Click or drop images here"}</span>
            <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files)} />
          </label>
        </div>
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((u, i) => (
              <div key={u+i} className="group relative aspect-square overflow-hidden rounded-lg border border-border/60">
                <StorageImage src={u} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute right-1 top-1 rounded-full bg-destructive/90 p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="flex justify-end gap-3 border-t border-border/60 pt-6">
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/cars" })}>Cancel</Button>
        <Button type="submit" variant="premium" size="lg" disabled={submitting}>{submitting ? "Saving…" : initial ? "Save Changes" : "Add Car"}</Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card p-6">
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}