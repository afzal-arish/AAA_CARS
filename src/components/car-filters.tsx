import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FUEL_TYPES, TRANSMISSIONS, CONDITIONS, OWNERS } from "@/lib/format";
import { X } from "lucide-react";

export type Filters = {
  q: string;
  brand: string;
  fuel: string;
  transmission: string;
  condition: string;
  owners: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
};

export const defaultFilters: Filters = {
  q: "", brand: "all", fuel: "all", transmission: "all", condition: "all", owners: "all",
  minPrice: 0, maxPrice: 5000000, sort: "newest",
};

export function CarFilters({
  brands,
  value,
  onChange,
}: {
  brands: string[];
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => onChange({ ...value, [k]: v });
  return (
    <aside className="rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold">Filters</h3>
        <Button size="sm" variant="ghost" onClick={() => onChange(defaultFilters)}>
          <X className="h-4 w-4" /> Reset
        </Button>
      </div>
      <div className="mt-4 space-y-5">
        <Field label="Search">
          <Input value={value.q} onChange={(e) => set("q", e.target.value)} placeholder="Brand, model, variant…" />
        </Field>
        <Field label="Sort By">
          <Select value={value.sort} onValueChange={(v) => set("sort", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="km_asc">Least Driven</SelectItem>
              <SelectItem value="km_desc">Most Driven</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Brand">
          <Select value={value.brand} onValueChange={(v) => set("brand", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label={`Price: ₹${(value.minPrice/100000).toFixed(1)}L – ₹${(value.maxPrice/100000).toFixed(1)}L`}>
          <Slider
            min={0} max={5000000} step={50000}
            value={[value.minPrice, value.maxPrice]}
            onValueChange={([min, max]) => onChange({ ...value, minPrice: min, maxPrice: max })}
          />
        </Field>
        <Field label="Fuel Type">
          <Select value={value.fuel} onValueChange={(v) => set("fuel", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {FUEL_TYPES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Transmission">
          <Select value={value.transmission} onValueChange={(v) => set("transmission", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {TRANSMISSIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Condition">
          <Select value={value.condition} onValueChange={(v) => set("condition", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Owners">
          <Select value={value.owners} onValueChange={(v) => set("owners", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              {OWNERS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}