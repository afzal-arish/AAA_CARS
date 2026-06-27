import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Reset Password | AAA Cars" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated successfully");
    navigate({ to: "/admin" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute inset-0 noise-overlay opacity-30" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-border/40 bg-card/95 p-8 shadow-elegant backdrop-blur">
          <div className="flex items-center gap-2 text-accent-gold">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest">Admin · Reset Password</span>
          </div>
          <h1 className="font-serif text-3xl font-bold">Set a new password</h1>
          <p className="text-sm text-muted-foreground">Use at least 8 characters. Mix letters, numbers and symbols for stronger security.</p>

          <div>
            <Label htmlFor="np" className="text-xs font-semibold uppercase tracking-wider">New password</Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="np" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pl-10 pr-11" placeholder="••••••••" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide" : "Show"} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="cp" className="text-xs font-semibold uppercase tracking-wider">Confirm password</Label>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="cp" type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11 pl-10" placeholder="••••••••" />
            </div>
          </div>

          <Button type="submit" variant="premium" size="lg" disabled={loading} className="w-full">
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}