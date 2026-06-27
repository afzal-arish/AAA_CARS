import { Link } from "@tanstack/react-router";
import { Car, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero shadow-elegant">
            <Car className="h-5 w-5 text-accent-gold" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-xl font-bold tracking-tight">AAA Cars</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Premium Used Cars</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>Home</Link>
          <Link to="/cars" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Browse Cars</Link>
          <Link to="/about" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>About</Link>
          <Link to="/contact" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/60 text-foreground transition-colors hover:border-accent-gold hover:text-accent-gold"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/cars" className="hidden md:inline-flex items-center rounded-full bg-gradient-gold px-5 py-2 text-xs font-semibold uppercase tracking-widest text-accent-gold-foreground shadow-gold hover:opacity-90 transition-opacity">Browse Inventory</Link>
        </div>
      </div>
    </header>
  );
}