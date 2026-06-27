import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Award, BadgeCheck, Handshake, Phone, Search, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import heroCar from "@/assets/hero-car.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CarCard } from "@/components/car-card";
import { CarCardSkeleton } from "@/components/car-card-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { carsQueryOptions } from "@/lib/cars-queries";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "AAA Cars — Trusted Used Cars at the Best Price | Chennai" },
      { name: "description", content: "Chennai's premium destination for hand-picked, verified second-hand cars. Transparent prices, inspected vehicles, easy ownership transfer." },
      { property: "og:title", content: "AAA Cars — Trusted Used Cars at the Best Price in Chennai" },
      { property: "og:description", content: "Chennai's premium destination for hand-picked, verified second-hand cars. Transparent prices, inspected vehicles, easy ownership transfer." },
      { property: "og:url", content: "https://aaa-car-finder.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://aaa-car-finder.lovable.app/" }],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(carsQueryOptions()); },
  component: HomePage,
});

function HomePage() {
  const { data: cars = [], isLoading } = useQuery(carsQueryOptions());
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const featured = cars.filter((c) => c.featured || c.premium).slice(0, 6);
  const newest = cars.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      {/* ─── HERO ───────────────────────────────── */}
      <section className="dark relative w-full overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 bg-gradient-hero" />
        <img src={heroCar} alt="Premium car" className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-luminosity" width={1920} height={1080} />
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="container relative mx-auto px-4 py-28 md:py-40">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent-gold" /> Chidambaram · Tamil Nadu
            </span>
            <h1 className="mt-7 font-serif text-balance text-5xl leading-[1.02] text-foreground md:text-7xl lg:text-[5.5rem]">
              Trusted used cars,
              <br />
              <span className="bg-gradient-gold bg-clip-text text-transparent italic">at the best price.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              AAA Cars curates premium pre-owned vehicles. Every car inspected, verified, and ready to drive home — backed by a transparent ownership promise.
            </p>
            <motion.form
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              onSubmit={(e) => { e.preventDefault(); navigate({ to: "/cars", search: { q } as never }); }}
              className="mt-10 flex max-w-2xl items-center gap-2 rounded-2xl glass p-2 shadow-elegant"
            >
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brand, model, variant…" className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0" />
              <Button type="submit" variant="hero" size="lg">Search</Button>
            </motion.form>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="premium" size="xl"><Link to="/cars">Browse All Cars <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="glass" size="xl"><Link to="/contact">Talk to an Expert</Link></Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm text-muted-foreground">
              {[
                ["500+", "Cars delivered"],
                ["200-pt", "Inspection"],
                ["4.9★", "Customer rating"],
              ].map(([k, v]) => (
                <div key={v}>
                  <div className="font-serif text-2xl text-foreground">{k}</div>
                  <div className="text-xs uppercase tracking-widest">{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── BRAND MARQUEE ──────────────────────── */}
      <section className="w-full border-y border-border/60 bg-card/40 py-6 overflow-hidden">
        <div className="flex w-max animate-marquee gap-16 px-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {[...Array(2)].flatMap((_, r) =>
            ["Mercedes-Benz", "BMW", "Audi", "Toyota", "Honda", "Hyundai", "Mahindra", "Tata", "Kia", "Volkswagen", "Skoda", "Ford"].map((b, i) => (
              <span key={`${r}-${i}`} className="whitespace-nowrap">◆ {b}</span>
            ))
          )}
        </div>
      </section>

      {/* ─── TRUST / VALUE PROPS ────────────────── */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-accent-gold">Why AAA Cars</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl text-balance">A standard of trust built into every key handover.</h2>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "200-Point Certified", body: "Every engine, gearbox, body panel and electronic control is bench-tested by our master technicians — only flawless cars make the lot." },
              { icon: BadgeCheck, title: "100% Ownership Verified", body: "Original RC, clean insurance, full service history and a signed transfer guarantee — paperwork done in 48 hours, zero stress." },
              { icon: Handshake, title: "Lowest-Price Guarantee", body: "Find the same car cheaper anywhere in Tamil Nadu and we'll beat it. Honest pricing with on-road totals up front." },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative bg-card p-10 transition-colors hover:bg-gradient-card"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero shadow-elegant transition-transform group-hover:scale-105">
                  <Icon className="h-7 w-7 text-accent-gold" />
                </div>
                <h3 className="mt-6 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED ───────────────────────────── */}
      <section className="w-full bg-card/30 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-accent-gold">Hand-picked</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">Featured vehicles</h2>
              <p className="mt-3 text-muted-foreground">Premium pre-owned cars our team personally vouches for.</p>
            </div>
            <Button asChild variant="ghost"><Link to="/cars">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <CarCardSkeleton key={i} />)
              : featured.length > 0
              ? featured.map((c, i) => <CarCard key={c.id} car={c} index={i} />)
              : (
                <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                  <Award className="mx-auto h-10 w-10 text-accent-gold" />
                  <p className="mt-3 font-serif text-xl">No featured cars yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">Check back soon — our team is curating the first batch.</p>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* ─── NEWEST ─────────────────────────────── */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-accent-gold">Just listed</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">New arrivals</h2>
              <p className="mt-3 text-muted-foreground">The freshest additions to our Chidambaram showroom.</p>
            </div>
            <Button asChild variant="ghost"><Link to="/cars">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <CarCardSkeleton key={i} />)
              : newest.length === 0
              ? (
                <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                  <Award className="mx-auto h-10 w-10 text-accent-gold" />
                  <p className="mt-3 font-serif text-xl">Inventory loading soon</p>
                  <p className="mt-1 text-sm text-muted-foreground">Our admin team is curating the first batch of premium vehicles.</p>
                </div>
              )
              : newest.map((c, i) => <CarCard key={c.id} car={c} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ────────────────────────── */}
      <section className="w-full bg-card/30 py-20 md:py-28">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="flex justify-center gap-1 text-accent-gold">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
          </div>
          <blockquote className="mt-8 font-serif text-3xl md:text-4xl text-balance leading-tight">
            "I drove home a verified, fairly-priced car the same week — no paperwork drama, no hidden costs. AAA Cars made it feel effortless."
          </blockquote>
          <div className="mt-8 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            Abdul Agees K · Chidambaram, Tamil Nadu
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────── */}
      <section className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="dark relative overflow-hidden rounded-3xl bg-gradient-hero p-10 shadow-elegant md:p-16 text-foreground"
          >
            <div className="absolute inset-0 noise-overlay" />
            <div className="relative z-10 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-accent-gold">Bespoke sourcing</p>
                <h2 className="mt-3 font-serif text-4xl text-foreground md:text-5xl text-balance">Looking for a specific car?</h2>
                <p className="mt-4 text-muted-foreground max-w-lg">Tell us what you need. We'll source it, inspect it, and deliver it to you in Chidambaram.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild variant="hero" size="xl"><Link to="/contact">Request a Car</Link></Button>
                  <Button asChild variant="glass" size="xl"><Link to="/cars">Browse Inventory</Link></Button>
                </div>
              </div>
              <div className="rounded-2xl border border-accent-gold/30 bg-background/10 p-6 backdrop-blur-md">
                <div className="flex items-center gap-3 text-accent-gold">
                  <Phone className="h-5 w-5" />
                  <span className="text-xs uppercase tracking-[0.25em]">Speak to us</span>
                </div>
                <a href="tel:+919443240376" className="mt-3 block font-serif text-3xl text-foreground">
                  +91 94432 40376
                </a>
                <p className="mt-2 text-sm text-muted-foreground">Mon – Sat · 9 AM – 8 PM</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
