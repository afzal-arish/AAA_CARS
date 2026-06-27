import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { inquiriesQueryOptions } from "@/lib/cars-queries";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { INQUIRY_STATUSES } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  loader: ({ context }) => { context.queryClient.ensureQueryData(inquiriesQueryOptions); },
  component: CustomersPage,
});

function CustomersPage() {
  const { data } = useSuspenseQuery(inquiriesQueryOptions);
  const qc = useQueryClient();

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("customer_inquiries").update({ inquiry_status: status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["inquiries"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("customer_inquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Inquiry deleted");
    qc.invalidateQueries({ queryKey: ["inquiries"] });
  };

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Customer Inquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">{data.length} total</p>

      {data.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="font-serif text-xl">No inquiries yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Customer messages will appear here.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {data.map((i) => {
            const car = (i as { cars?: { title?: string } }).cars;
            return (
              <div key={i.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-lg font-semibold">{i.customer_name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{i.email} · {i.phone}{i.city ? ` · ${i.city}` : ""}</p>
                    {car?.title && <p className="mt-1 text-xs text-accent-gold">Interested in: {car.title}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={i.inquiry_status} onValueChange={(v) => updateStatus(i.id, v)}>
                      <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {INQUIRY_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" onClick={() => remove(i.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                {i.message && <p className="mt-3 rounded-lg bg-muted/40 p-3 text-sm">{i.message}</p>}
                <p className="mt-3 text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString("en-IN")}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}