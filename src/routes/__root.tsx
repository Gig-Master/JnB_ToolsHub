import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/lib/cart";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { BUSINESS, MAP, OPENING, SITE_URL } from "@/data/business";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a href="/" className="btn-primary">Go home</a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  // Log details for us, but never show them to visitors
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">Try again</button>
          <a href="/" className="btn-outline">Go home</a>
        </div>
      </div>
    </div>
  );
}

const SHARE_IMAGE = `${SITE_URL}/images/site/jnb-shop-interior.jpg`;
const PAGE_TITLE = "JnB Power Tools & Digital Electronics - Nairobi";

/**
 * Structured data (schema.org) that tells search and AI answer engines,
 * in plain machine-readable form, who we are, where we are and when we open.
 */
const SITE_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Store", "HardwareStore"],
      "@id": `${SITE_URL}/#business`,
      name: BUSINESS.name,
      alternateName: BUSINESS.shortName,
      url: SITE_URL,
      description: BUSINESS.description,
      slogan: BUSINESS.tagline,
      image: SHARE_IMAGE,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      telephone: `+${BUSINESS.phone}`,
      email: BUSINESS.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${BUSINESS.address.line1}, ${BUSINESS.address.line2}`,
        addressLocality: BUSINESS.address.city,
        addressCountry: "KE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: MAP.lat,
        longitude: MAP.lng,
      },
      hasMap: MAP.placeUrl,
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: OPENING.days,
          opens: OPENING.opens,
          closes: OPENING.closes,
        },
      ],
      areaServed: [
        { "@type": "City", name: "Nairobi" },
        { "@type": "Country", name: "Kenya" },
      ],
      currenciesAccepted: "KES",
      knowsAbout: [
        "Power tools",
        "Solar systems",
        "Electrical accessories",
        "Electronics",
        "Agricultural machinery",
        "Salon and barber equipment",
        "Locks and padlocks",
        "Hardware",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BUSINESS.name,
      inLanguage: "en-KE",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // Tell phones this site is designed light, so browser "auto dark" modes leave it alone
      { name: "color-scheme", content: "light" },
      { name: "theme-color", content: "#102a43" },
      { title: PAGE_TITLE },
      { name: "description", content: BUSINESS.description },
      { name: "author", content: BUSINESS.name },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:site_name", content: BUSINESS.name },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_KE" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: BUSINESS.description },
      { property: "og:image", content: SHARE_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: SHARE_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon-192x192.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(SITE_JSONLD) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {!isAdmin && <Nav />}
        <main id="main">
          <Outlet />
        </main>
        {!isAdmin && <Footer />}
      </CartProvider>
    </QueryClientProvider>
  );
}