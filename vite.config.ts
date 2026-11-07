import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

/**
 * Content-Security-Policy. Report-only for now: violations show in the browser
 * console but nothing is blocked. Switch it to enforcing once the console is clean.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // the framework adds small inline scripts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.supabase.co", // product photos
  "connect-src 'self' https://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY", // nobody can put your site inside a frame (clickjacking)
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy-report-only": csp,
};

// Pages and data that belong to one person must never be cached or shared.
// These rules also repeat the security headers, because a matching earlier rule
// can stop Vercel from reading the catch-all rule below it.
const privateHeaders = { ...securityHeaders, "cache-control": "private, no-store" };

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const isProd = mode === "production";

  return {
    define: envDefine,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
        server: { entry: "server" },
      }),
      nitro({
        defaultPreset: "vercel",
        externals: {
          inline: ["tslib"],
        },
                routeRules: isProd
          ? {
              "/**": { headers: securityHeaders },
              "/account": { headers: privateHeaders },
              "/account/**": { headers: privateHeaders },
              "/login": { headers: privateHeaders },
              "/signup": { headers: privateHeaders },
              "/forgot-password": { headers: privateHeaders },
              "/reset-password": { headers: privateHeaders },
              "/cart": { headers: privateHeaders },
              "/admin": { headers: privateHeaders },
              "/admin/**": { headers: privateHeaders },
              "/_serverFn/**": { headers: privateHeaders },
              "/checkout": { headers: privateHeaders },
              "/order/**": { headers: privateHeaders },
            }
          : {},
      }),
      viteReact(),
    ],
  };
});