import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Car, MessageSquare, Sparkles, Star, TrendingUp } from "lucide-react";
import { carsQueryOptions, inquiriesQueryOptions } from "@/lib/cars-queries";
import { Button } from "@/components/ui/button";
import { StorageImage } from "@/components/storage-image";

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(carsQueryOptions({ includeAll: true }));
    context.queryClient.ensureQueryData(inquiriesQueryOptions);
  },
  component: Dashboard,
});

function Dashboard() {
  const { data: cars } = useSuspenseQuery(carsQueryOptions({ includeAll: true }));
  const { data: inquiries } = useSuspenseQuery(inquiriesQueryOptions);
  const active = cars.filter((c) => c.status === "active").length;
  const featured = cars.filter((c) => c.featured).length;
  const premium = cars.filter((c) => c.premium).length;
  const testDrives = inquiries.filter((i) => i.scheduled_test_drive).length;
  const newInquiries = inquiries.filter((i) => i.inquiry_status === "New").length;

  const stats = [
    { label: "Total Cars", value: cars.length, icon: Car, tone: "primary" },
    { label: "Active Listings", value: active, icon: TrendingUp, tone: "emerald" },
    { label: "Featured", value: featured, icon: Star, tone: "amber" },
    { label: "Premium", value: premium, icon: Sparkles, tone: "gold" },
    { label: "Inquiries", value: inquiries.length, icon: MessageSquare, tone: "sky" },
    { label: "Test Drives", value: testDrives, icon: TrendingUp, tone: "violet" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent-gold">Overview</p>
          <h1 className="mt-1 font-serif text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="premium"><Link to="/admin/cars/new">Add New Car</Link></Button>
          <Button asChild variant="outline"><Link to="/admin/cars">Manage Inventory</Link></Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
                <s.icon className="h-4 w-4 text-accent-gold" />
              </div>
            </div>
            <p className="mt-4 font-serif text-4xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold">Recent Inquiries</h2>
            <Button asChild size="sm" variant="ghost"><Link to="/admin/customers">View all</Link></Button>
          </div>
          {inquiries.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No customer inquiries yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {inquiries.slice(0, 5).map((i) => (
                <li key={i.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{i.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{i.phone} · {newDate(i.created_at)}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">{i.inquiry_status}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-muted-foreground">{newInquiries} new this week</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6">
          <h2 className="font-serif text-xl font-semibold">Recent Cars</h2>
          {cars.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No cars yet. <Link className="text-primary underline" to="/admin/cars/new">Add your first listing.</Link></p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {cars.slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {c.image_urls[0] && <StorageImage src={c.image_urls[0]} alt={c.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.brand} · {c.manufacturing_year}</p>
                  </div>
                  <span className="text-sm font-semibold">₹{(c.price/100000).toFixed(1)}L</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function newDate(s: string) { return new Date(s).toLocaleDateString("en-IN"); }