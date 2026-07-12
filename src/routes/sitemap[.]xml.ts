import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { QUOTES } from "@/data/quotes";
import { PHILOSOPHERS } from "@/data/philosophers";
import { THEMES } from "@/data/themes";

const BASE_URL = "https://askthestoics.org";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0" },
          { path: "/what-is-stoicism", changefreq: "monthly", priority: "0.9" },
          { path: "/stoic-quotes", changefreq: "weekly", priority: "0.9" },
          { path: "/philosophers", changefreq: "monthly", priority: "0.8" },
          { path: "/themes", changefreq: "monthly", priority: "0.8" },
          { path: "/ask", changefreq: "monthly", priority: "0.7" },
          { path: "/wordsearch", changefreq: "daily", priority: "0.6" },
          { path: "/about", changefreq: "yearly", priority: "0.5" },
        ];

        const dynamicEntries: SitemapEntry[] = [
          ...PHILOSOPHERS.map((p) => ({
            path: `/philosophers/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...THEMES.map((t) => ({
            path: `/themes/${t.slug}`,
            changefreq: "monthly" as const,
            priority: "0.7",
          })),
          ...QUOTES.map((q) => ({
            path: `/q/${q.id}`,
            changefreq: "yearly" as const,
            priority: "0.6",
          })),
        ];

        const entries = [...staticEntries, ...dynamicEntries];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
