import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { carsQueryOptions } from "@/lib/cars-queries";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { StorageImage } from "@/components/storage-image";

export const Route = createFileRoute("/_authenticated/admin/cars/")({
  loader: ({ context }) => { context.queryClient.ensureQueryData(carsQueryOptions({ includeAll: true })); },
  component: AdminCarsList,
});

function AdminCarsList() {
  const { data: cars } = useSuspenseQuery(carsQueryOptions({ includeAll: true }));
  const qc = useQueryClient();

  const remove = async (id: string) => {
    if (!confirm("Delete this car? This cannot be undone.")) return;
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Car deleted");
    qc.invalidateQueries({ queryKey: ["cars"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">{cars.length} total vehicles</p>
        </div>
        <Button asChild variant="premium"><Link to="/admin/cars/new"><Plus className="h-4 w-4" /> Add Car</Link></Button>
      </div>

      {cars.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="font-serif text-xl">No cars yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first listing to get started.</p>
          <Button asChild variant="hero" className="mt-4"><Link to="/admin/cars/new">Add a Car</Link></Button>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Car</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Year</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id} className="border-t border-border/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        {c.image_urls[0] && <StorageImage src={c.image_urls[0]} alt={c.title} className="h-full w-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.brand} · {c.fuel_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{c.manufacturing_year}</td>
                  <td className="px-4 py-3 font-semibold">{formatINR(c.price)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${c.status === "active" ? "bg-emerald-500/15 text-emerald-700" : c.status === "sold" ? "bg-sky-500/15 text-sky-700" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button asChild size="sm" variant="ghost"><Link to="/admin/cars/$id/edit" params={{ id: c.id }}><Edit className="h-4 w-4" /></Link></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}