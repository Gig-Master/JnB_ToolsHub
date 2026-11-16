import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { SITE_URL } from "@/data/business";
import { listProducts } from "@/functions/products";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/products", changefreq: "weekly", priority: "0.9" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
        ];

        // Every product gets its own page, so list them all.
        try {
          const products = await listProducts({ data: {} });
          for (const p of products) {
            entries.push({
              path: `/product/${encodeURIComponent(p.slug)}`,
              changefreq: "weekly",
              priority: "0.8",
              lastmod: p.updatedAt.slice(0, 10),
            });
          }
        } catch (error) {
          // If the database is briefly unreachable, still serve the main pages.
          console.error("Sitemap: could not load products", error);
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${xmlEscape(SITE_URL + e.path)}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
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
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});