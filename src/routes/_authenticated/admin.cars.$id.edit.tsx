import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { CarForm } from "@/components/car-form";
import { carQueryOptions } from "@/lib/cars-queries";

export const Route = createFileRoute("/_authenticated/admin/cars/$id/edit")({
  loader: async ({ context, params }) => {
    const car = await context.queryClient.ensureQueryData(carQueryOptions(params.id));
    if (!car) throw notFound();
    return car;
  },
  component: EditCarPage,
});

function EditCarPage() {
  const { id } = Route.useParams();
  const { data: car } = useSuspenseQuery(carQueryOptions(id));
  if (!car) return null;
  return (
    <div className="max-w-5xl">
      <Link to="/admin/cars" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-bold">Edit Car</h1>
      <p className="mt-1 text-sm text-muted-foreground">{car.title}</p>
      <div className="mt-8"><CarForm initial={car} /></div>
    </div>
  );
}