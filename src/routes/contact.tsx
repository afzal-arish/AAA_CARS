import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AAA Cars | Chidambaram Used Cars" },
      { name: "description", content: "Call, WhatsApp or email AAA Cars — Chidambaram's premium used-car marketplace." },
      { property: "og:title", content: "Contact AAA Cars" },
      { property: "og:description", content: "Reach the AAA Cars team in Chidambaram by phone, WhatsApp, or email. We're here to help you find, inspect, and own your next pre-owned car." },
      { property: "og:url", content: "https://aaa-car-finder.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://aaa-car-finder.lovable.app/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="container mx-auto flex-1 px-4 py-16">
        <p className="text-xs uppercase tracking-widest text-accent-gold">Get in touch</p>
        <h1 className="mt-2 font-serif text-4xl font-bold md:text-6xl">Let&apos;s find your next car.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Our team is available 7 days a week. Reach out for inventory questions, test drives, or sourcing a specific model.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card icon={<Phone />} title="Call us" body="+91 94432 40376" href="tel:+919443240376" cta="Call now" />
          <Card icon={<MessageCircle />} title="WhatsApp" body="+91 94432 40376" href="https://wa.me/919443240376" cta="Chat on WhatsApp" />
          <Card icon={<Mail />} title="Email" body="ageesafzal@gmail.com" href="mailto:ageesafzal@gmail.com" cta="Send email" />
          <Card icon={<MapPin />} title="Visit us" body="Chidambaram, Tamil Nadu, India" href="https://maps.google.com/?q=Chidambaram,Tamil+Nadu" cta="View on map" />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Card({ icon, title, body, href, cta }: { icon: React.ReactNode; title: string; body: string; href: string; cta: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-accent-gold [&>svg]:h-6 [&>svg]:w-6">{icon}</div>
      <h3 className="mt-4 font-serif text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-muted-foreground">{body}</p>
      <Button asChild variant="premium" className="mt-4"><a href={href} target="_blank" rel="noreferrer">{cta}</a></Button>
    </div>
  );
}