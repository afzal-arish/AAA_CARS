import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Car } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-gradient-card">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero shadow-elegant">
              <Car className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <div className="font-serif text-xl font-bold">AAA Cars</div>
              <div className="text-xs text-muted-foreground">Trusted Used Cars at the Best Price</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Chidambaram&apos;s premium destination for hand-picked, verified pre-owned cars. Every vehicle inspected, every deal transparent.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            CEO:{" "}
            <Link
              to="/auth"
              className="font-semibold text-foreground underline-offset-4 hover:text-accent-gold hover:underline"
              aria-label="Admin login"
              title="Admin login"
            >
              Afzal Arish A
            </Link>
          </p>
        </div>
        <div>
          <h4 className="font-serif text-base font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/cars" className="hover:text-primary">Browse Cars</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-base font-semibold">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-accent-gold" /> Chidambaram, Tamil Nadu, India</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent-gold" /> <a href="tel:+919443240376" className="hover:text-primary">+91 94432 40376</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent-gold" /> <a href="mailto:ageesafzal@gmail.com" className="hover:text-primary">ageesafzal@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 AAA Cars. All Rights Reserved.</p>
          <p>Crafted in Chidambaram · Trusted across Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}