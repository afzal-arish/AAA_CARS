import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Check, Fuel, Gauge, MapPin, Phone, Settings2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { InquiryForm } from "@/components/inquiry-form";
import { StorageImage } from "@/components/storage-image";
import { carQueryOptions } from "@/lib/cars-queries";
import { formatINR, formatKm } from "@/lib/format";

export const Route = createFileRoute("/cars/$id")({
  ssr: false,
  loader: async ({ context, params }) => {
    const car = await context.queryClient.ensureQueryData(carQueryOptions(params.id));
    if (!car) throw notFound();
    return car;
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — ${formatINR(loaderData.price)} | AAA Cars` },
          { name: "description", content: `${loaderData.manufacturing_year} ${loaderData.brand} ${loaderData.model} ${loaderData.variant ?? ""}, ${formatKm(loaderData.kilometers_driven)} • ${loaderData.location} • ${loaderData.fuel_type}, ${loaderData.transmission}.` },
          { property: "og:title", content: `${loaderData.title} — ${formatINR(loaderData.price)}` },
          { property: "og:description", content: `${loaderData.manufacturing_year} ${loaderData.brand} ${loaderData.model} ${loaderData.variant ?? ""} in ${loaderData.location}. ${formatKm(loaderData.kilometers_driven)}, ${loaderData.fuel_type}, ${loaderData.transmission}. Inspected and verified by AAA Cars.` },
          { property: "og:type", content: "product" },
          { property: "og:url", content: `https://aaa-car-finder.lovable.app/cars/${params.id}` },
          { property: "og:image", content: loaderData.image_urls?.[0] ?? "" },
        ]
      : [{ title: "Car Details | AAA Cars" }],
    links: loaderData
      ? [{ rel: "canonical", href: `https://aaa-car-finder.lovable.app/cars/${params.id}` }]
      : [],
  }),
  component: CarDetailPage,
});

function CarDetailPage() {
  const { id } = Route.useParams();
  const { data: car } = useSuspenseQuery(carQueryOptions(id));
  const [active, setActive] = useState(0);
  if (!car) return null;
  const phone = car.contact_number || "9443240376";
  const wa = (car.whatsapp_number || "9443240376").replace(/\D/g, "");

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="container mx-auto flex-1 px-4 py-8">
        <Link to="/cars" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to cars
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <motion.div layoutId={car.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-elegant">
              <div className="aspect-[16/10] bg-muted">
                {car.image_urls[active] ? (
                  <StorageImage src={car.image_urls[active]} alt={car.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">No image</div>
                )}
              </div>
              {car.image_urls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                  {car.image_urls.map((u, i) => (
                    <button key={u + i} onClick={() => setActive(i)} aria-label={`View image ${i + 1} of ${car.title}`}
                      className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === active ? "border-primary shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}>
                      <StorageImage src={u} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-1.5">
                    {car.premium && <Pill gold><Sparkles className="h-3 w-3" /> Premium</Pill>}
                    {car.featured && <Pill>Featured</Pill>}
                    {car.verified && <Pill emerald><ShieldCheck className="h-3 w-3" /> Verified</Pill>}
                    {car.new_arrival && <Pill sky>New Arrival</Pill>}
                  </div>
                  <h1 className="mt-3 font-serif text-3xl font-bold md:text-4xl">{car.title}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{car.brand} · {car.model} {car.variant ? `· ${car.variant}` : ""}</p>
                </div>
                <div className="text-right">
                  <div className="font-serif text-3xl font-bold text-primary md:text-4xl">{formatINR(car.price)}</div>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{car.car_condition} condition</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Stat icon={<Calendar />} label="Year" value={String(car.manufacturing_year)} />
                <Stat icon={<Gauge />} label="Driven" value={formatKm(car.kilometers_driven)} />
                <Stat icon={<Fuel />} label="Fuel" value={car.fuel_type} />
                <Stat icon={<Settings2 />} label="Transmission" value={car.transmission} />
                <Stat icon={<Users />} label="Owners" value={car.number_of_owners} />
                <Stat icon={<MapPin />} label="Location" value={car.location} />
              </div>

              {car.description && (
                <div className="mt-6">
                  <h2 className="font-serif text-xl font-semibold">About this car</h2>
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{car.description}</p>
                </div>
              )}

              {car.features.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-serif text-xl font-semibold">Features</h2>
                  <ul className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
                    {car.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent-gold" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(car.registration_number || car.insurance_validity) && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
                  {car.registration_number && <KV label="Registration" value={car.registration_number} />}
                  {car.insurance_validity && <KV label="Insurance Valid Till" value={new Date(car.insurance_validity).toLocaleDateString("en-IN")} />}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Contact seller</p>
              <div className="mt-3 grid gap-2">
                <Button asChild variant="premium" size="lg"><a href={`tel:${phone}`}><Phone className="h-4 w-4" /> Call {phone}</a></Button>
                <Button asChild variant="hero" size="lg"><a target="_blank" rel="noreferrer" href={`https://wa.me/91${wa}?text=${encodeURIComponent(`Hi, I'm interested in ${car.title}`)}`}>WhatsApp</a></Button>
              </div>
            </div>
            <InquiryForm carId={car.id} carTitle={car.title} />
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-gradient-card p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-accent-gold [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Pill({ children, gold, emerald, sky }: { children: React.ReactNode; gold?: boolean; emerald?: boolean; sky?: boolean }) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider";
  if (gold) return <span className={`${base} bg-gradient-gold text-accent-gold-foreground`}>{children}</span>;
  if (emerald) return <span className={`${base} bg-emerald-500 text-white`}>{children}</span>;
  if (sky) return <span className={`${base} bg-sky-500 text-white`}>{children}</span>;
  return <span className={`${base} bg-primary text-primary-foreground`}>{children}</span>;
}