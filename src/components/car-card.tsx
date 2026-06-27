import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Fuel, Gauge, MapPin, Settings2, ShieldCheck, Sparkles, Star } from "lucide-react";
import type { CarRow } from "@/lib/cars-queries";
import { formatINR, formatKm } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { StorageImage } from "@/components/storage-image";

export function CarCard({ car, index = 0 }: { car: CarRow; index?: number }) {
  const img = car.image_urls?.[0];
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-soft hover:shadow-elegant transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {img ? (
          <StorageImage
            src={img}
            alt={car.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {car.premium && <Badge gold>Premium</Badge>}
          {car.featured && <Badge>Featured</Badge>}
          {car.verified && <Badge tone="emerald"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
          {car.new_arrival && <Badge tone="sky">New Arrival</Badge>}
        </div>
        <div className="absolute right-3 top-3 rounded-full glass px-3 py-1 text-xs font-medium">{car.manufacturing_year}</div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{car.brand}</p>
            <h3 className="mt-0.5 font-serif text-lg font-semibold leading-tight line-clamp-1">{car.title}</h3>
            {car.variant && <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{car.variant}</p>}
          </div>
          <div className="text-right">
            <div className="font-serif text-xl font-bold text-primary">{formatINR(car.price)}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" /> {formatKm(car.kilometers_driven)}</span>
          <span className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" /> {car.fuel_type}</span>
          <span className="flex items-center gap-1.5"><Settings2 className="h-3.5 w-3.5" /> {car.transmission}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {car.location}</span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-accent-gold text-accent-gold" /> {car.car_condition}
          </span>
          <Button asChild size="sm" variant="premium">
            <Link to="/cars/$id" params={{ id: car.id }}>View Details</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function Badge({
  children,
  gold,
  tone,
}: {
  children: React.ReactNode;
  gold?: boolean;
  tone?: "emerald" | "sky";
}) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm";
  if (gold) return <span className={`${base} bg-gradient-gold text-accent-gold-foreground`}><Sparkles className="h-3 w-3" /> {children}</span>;
  if (tone === "emerald") return <span className={`${base} bg-emerald-500 text-white`}>{children}</span>;
  if (tone === "sky") return <span className={`${base} bg-sky-500 text-white`}>{children}</span>;
  return <span className={`${base} bg-primary text-primary-foreground`}>{children}</span>;
}