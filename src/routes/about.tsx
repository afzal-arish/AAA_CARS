import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Award, Heart, Shield } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AAA Cars | Premium Used Car Marketplace, Chennai" },
      { name: "description", content: "AAA Cars is Chennai's trusted destination for premium pre-owned vehicles. Founded by Afzal Arish A." },
      { property: "og:title", content: "About AAA Cars" },
      { property: "og:description", content: "Learn the story behind AAA Cars — Chennai's trusted premium pre-owned car marketplace, founded by Afzal Arish A. with a 200-point inspection promise." },
      { property: "og:url", content: "https://aaa-car-finder.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://aaa-car-finder.lovable.app/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="container mx-auto flex-1 px-4 py-16">
        <p className="text-xs uppercase tracking-widest text-accent-gold">About us</p>
        <h1 className="mt-2 font-serif text-4xl font-bold md:text-6xl">Built on trust. Driven by quality.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          AAA Cars was founded in Chennai with a simple promise — to make buying a pre-owned car as transparent and joyful as buying new.
          Every vehicle in our inventory is hand-picked, professionally inspected, and priced fairly.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Shield, title: "Inspected & Verified", body: "200-point check, RC verification, insurance history — all upfront." },
            { icon: Award, title: "Premium Curation", body: "Only well-maintained, low-owner vehicles make it to our showroom." },
            { icon: Heart, title: "Customer First", body: "Test drives, doorstep delivery, post-sale support — we stay with you." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                <Icon className="h-6 w-6 text-accent-gold" />
              </div>
              <h2 className="mt-4 font-serif text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 rounded-3xl bg-gradient-hero p-10 shadow-elegant text-primary-foreground">
          <p className="text-xs uppercase tracking-widest text-accent-gold">Leadership</p>
          <h2 className="mt-2 font-serif text-3xl font-bold">Afzal Arish A — CEO</h2>
          <p className="mt-3 max-w-2xl text-primary-foreground/80">
            With a deep love for automobiles and a sharp eye for value, Afzal founded AAA Cars to bring honesty and craftsmanship back to the used-car business in Tamil Nadu.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}