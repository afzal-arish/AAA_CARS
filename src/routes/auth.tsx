import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Login | AAA Cars" },
      { name: "description", content: "Secure administrator login for the AAA Cars management portal. Restricted access — staff only." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Login | AAA Cars" },
      { property: "og:description", content: "Secure administrator login for the AAA Cars management portal." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});
type FormData = z.infer<typeof schema>;

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: FormData) => {
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(v);
        if (error) throw error;
        // Try to auto-claim super admin if none exists yet
        await supabase.rpc("claim_first_admin");
        // Verify admin role before granting access
        const { data: userRes } = await supabase.auth.getUser();
        const uid = userRes.user?.id;
        const { data: roleRow } = uid
          ? await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", uid)
              .in("role", ["admin", "super_admin"])
              .maybeSingle()
          : { data: null };
        if (!roleRow) {
          await supabase.auth.signOut();
          throw new Error("Access denied. This portal is restricted to administrators.");
        }
        toast.success("Welcome back, admin.");
        navigate({ to: "/admin" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: v.email,
          password: v.password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        const { data: claimed } = await supabase.rpc("claim_first_admin");
        if (!claimed) {
          await supabase.auth.signOut();
          throw new Error("Admin already exists. New accounts are not permitted.");
        }
        toast.success("Admin account created.");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(v.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("If that email belongs to an admin, a reset link has been sent.");
        setMode("signin");
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      <div className="absolute inset-0 noise-overlay opacity-30" />
      <Link
        to="/"
        className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/80 transition-colors hover:text-accent-gold"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to site
      </Link>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border/40 bg-card/95 p-8 shadow-elegant backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-hero shadow-elegant">
              <Car className="h-5 w-5 text-accent-gold" />
            </div>
            <div>
              <div className="font-serif text-xl font-bold leading-tight">AAA Cars</div>
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-accent-gold">
                <ShieldCheck className="h-3 w-3" /> Admin Portal
              </div>
            </div>
          </div>

          <h1 className="mt-7 font-serif text-3xl font-bold">
            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create admin" : "Reset password"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in with your authorised admin email."
              : mode === "signup"
              ? "Only allowed when no administrator exists yet."
              : "We'll email a secure link to set a new password."}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div>
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="h-11 pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {mode !== "reset" && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider">Password</Label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-[11px] font-medium text-accent-gold hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    placeholder="••••••••"
                    className="h-11 pl-10 pr-11"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>
            )}

            <Button type="submit" variant="premium" size="lg" disabled={loading} className="w-full">
              {loading
                ? "Please wait…"
                : mode === "signin"
                ? "Sign in securely"
                : mode === "signup"
                ? "Create admin account"
                : "Send reset link"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-2 text-xs text-muted-foreground">
            {mode === "signin" && (
              <button onClick={() => setMode("signup")} className="hover:text-accent-gold">
                No admin yet? Create the first one
              </button>
            )}
            {mode !== "signin" && (
              <button onClick={() => setMode("signin")} className="hover:text-accent-gold">
                ← Back to sign in
              </button>
            )}
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 p-3 text-[11px] text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-gold" />
            <p>This area is restricted. Unauthorised access attempts are logged and blocked.</p>
          </div>
        </div>
      </div>
    </div>
  );
}