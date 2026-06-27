import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    // Hard gate: only users with admin / super_admin role may enter.
    const { data: userRes } = await supabase.auth.getUser();
    const uid = userRes.user?.id;
    if (!uid) throw redirect({ to: "/auth" });
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();
    if (error || !data) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <AdminShell><Outlet /></AdminShell>,
});