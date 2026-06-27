import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Car, KeyRound, LayoutDashboard, LogOut, MessageSquare, Plus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/cars", label: "Cars", icon: Car, exact: false },
  { to: "/admin/customers", label: "Customers", icon: MessageSquare, exact: false },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) return toast.error("Password must be at least 8 characters");
    if (pw !== pw2) return toast.error("Passwords do not match");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated successfully");
    setPw(""); setPw2(""); setPwOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border/60 bg-card lg:flex">
        <Link to="/" className="flex items-center gap-2 border-b border-border/60 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <Car className="h-4 w-4 text-accent-gold" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold leading-none">AAA Cars</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin</div>
          </div>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((it) => {
            const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground shadow-elegant" : "text-foreground hover:bg-muted"}`}>
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-3 space-y-2">
          <Button asChild variant="hero" className="w-full"><Link to="/admin/cars/new"><Plus className="h-4 w-4" /> Add Car</Link></Button>
          <Dialog open={pwOpen} onOpenChange={setPwOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start"><KeyRound className="h-4 w-4" /> Change password</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change admin password</DialogTitle>
                <DialogDescription>This updates the password for your admin account only.</DialogDescription>
              </DialogHeader>
              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <Label htmlFor="newpw">New password</Label>
                  <div className="relative mt-1.5">
                    <Input id="newpw" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} className="pr-10" />
                    <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={show ? "Hide" : "Show"}>
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confpw">Confirm new password</Label>
                  <Input id="confpw" type={show ? "text" : "password"} value={pw2} onChange={(e) => setPw2(e.target.value)} className="mt-1.5" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setPwOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="premium" disabled={saving}>{saving ? "Updating…" : "Update password"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="px-4 py-8 md:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}