import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CarCard } from "@/components/car-card";
import { CarFilters, defaultFilters, type Filters } from "@/components/car-filters";
import { carsQueryOptions, type CarRow } from "@/lib/cars-queries";
import { Frown } from "lucide-react";

export const Route = createFileRoute("/cars/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Browse Premium Used Cars in Chennai | AAA Cars" },
      { name: "description", content: "Explore verified pre-owned cars from AAA Cars. Filter by brand, fuel type, transmission, price and more." },
      { property: "og:title", content: "Browse Used Cars | AAA Cars" },
      { property: "og:description", content: "Browse Chennai's premium pre-owned car inventory at AAA Cars. Filter by brand, fuel, transmission, and price — every car inspected and verified." },
      { property: "og:url", content: "https://aaa-car-finder.lovable.app/cars" },
    ],
    links: [{ rel: "canonical", href: "https://aaa-car-finder.lovable.app/cars" }],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(carsQueryOptions()); },
  component: CarsPage,
});

function sortFn(sort: string) {
  return (a: CarRow, b: CarRow) => {
    switch (sort) {
      case "price_asc": return a.price - b.price;
      case "price_desc": return b.price - a.price;
      case "km_asc": return a.kilometers_driven - b.kilometers_driven;
      case "km_desc": return b.kilometers_driven - a.kilometers_driven;
      case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  };
}

function CarsPage() {
  const { data: cars } = useSuspenseQuery(carsQueryOptions());
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const brands = useMemo(() => Array.from(new Set(cars.map((c) => c.brand))).sort(), [cars]);

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase().trim();
    return cars
      .filter((c) => {
        if (q && !`${c.title} ${c.brand} ${c.model} ${c.variant ?? ""} ${c.location}`.toLowerCase().includes(q)) return false;
        if (filters.brand !== "all" && c.brand !== filters.brand) return false;
        if (filters.fuel !== "all" && c.fuel_type !== filters.fuel) return false;
        if (filters.transmission !== "all" && c.transmission !== filters.transmission) return false;
        if (filters.condition !== "all" && c.car_condition !== filters.condition) return false;
        if (filters.owners !== "all" && c.number_of_owners !== filters.owners) return false;
        if (c.price < filters.minPrice || c.price > filters.maxPrice) return false;
        return true;
      })
      .sort(sortFn(filters.sort));
  }, [cars, filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="container mx-auto flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold">All Cars</h1>
          <p className="mt-1 text-muted-foreground">{filtered.length} of {cars.length} vehicles</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <CarFilters brands={brands} value={filters} onChange={setFilters} />
          {filtered.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 text-center">
              <Frown className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-serif text-xl font-semibold">No cars match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting the price or brand to see more.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c, i) => <CarCard key={c.id} car={c} index={i} />)}
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}