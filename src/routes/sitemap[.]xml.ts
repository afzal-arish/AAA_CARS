import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://aaa-car-finder.lovable.app";

type Entry = { path: string; priority: string; changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"; lastmod?: string };

const staticEntries: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" as const },
  { path: "/cars", priority: "0.9", changefreq: "daily" as const },
  { path: "/about", priority: "0.6", changefreq: "monthly" as const },
  { path: "/contact", priority: "0.6", changefreq: "monthly" as const },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [...staticEntries];
        try {
          const supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
          );
          const { data } = await supabase
            .from("cars")
            .select("id, updated_at")
            .eq("status", "active");
          for (const c of data ?? []) {
            entries.push({
              path: `/cars/${c.id}`,
              priority: "0.7",
              changefreq: "weekly",
              lastmod: c.updated_at ? new Date(c.updated_at).toISOString().slice(0, 10) : undefined,
            });
          }
        } catch {
          // best effort — static entries still ship if DB is unreachable during prerender
        }
        const urls = entries.map((e) => {
          const lines = [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            `    <changefreq>${e.changefreq}</changefreq>`,
            `    <priority>${e.priority}</priority>`,
            `  </url>`,
          ].filter(Boolean);
          return lines.join("\n");
        });
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});