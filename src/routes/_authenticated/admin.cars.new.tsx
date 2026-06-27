import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CarForm } from "@/components/car-form";

export const Route = createFileRoute("/_authenticated/admin/cars/new")({
  component: NewCarPage,
});

function NewCarPage() {
  return (
    <div className="max-w-5xl">
      <Link to="/admin/cars" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-bold">Add New Car</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fill the details below. You can edit anything later.</p>
      <div className="mt-8"><CarForm /></div>
    </div>
  );
}