import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { G as redirect, _ as createFileRoute, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRouteWithContext, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, l as __exportAll, r as createServerFn } from "./server-0p_jwNzp.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { S as Mail, _ as Phone, b as Menu, n as X, x as MapPin, y as MessageCircle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-m04FgIgm.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-C6IrYpw5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BDYCfOqZ.css";
var BUSINESS = {
	name: "JnB Power Tools & Digital Electronics",
	shortName: "JnB Power Tools",
	tagline: "Quality Power Tools & Digital Electronics You Can Trust",
	description: "Trusted Nairobi supplier of genuine power tools, agricultural machinery, electronics, electrical accessories, solar systems, salon and barber equipment, locks, padlocks and general hardware — for contractors, technicians, electricians, farmers and homeowners.",
	address: {
		line1: "Shop AG11, Magic Business Centre (Royal Palm Mall)",
		line2: "Mfangano Street",
		city: "Nairobi",
		country: "Kenya"
	},
	phone: "254740151986",
	whatsapp: "254740151986",
	email: "jnbtools@gmail.com",
	hours: [{
		day: "Monday – Saturday",
		time: "5:50 AM – 9:30 PM"
	}, {
		day: "Sunday",
		time: "Closed"
	}],
	socials: {
		facebook: "#",
		instagram: "#",
		twitter: "#"
	}
};
var MAP = {
	lat: -1.2853274,
	lng: 36.8278345,
	/** Public Google Maps place link (also used for "Get Directions"). */
	placeUrl: "https://www.google.com/maps/place/JnB+Power+Tools+%26+Digital+Electronics/@-1.2853274,36.8252596,17z/data=!3m1!4b1!4m6!3m5!1s0x182f118e1220c3ff:0xa1ff475e2f5adc10!8m2!3d-1.2853274!4d36.8278345!16s%2Fg%2F11zgw2dw8d",
	directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=-1.2853274,36.8278345&destination_place_id=ChIJ_8MgEo4RLxgRENxaL15H_6E",
	embedUrl: "https://www.google.com/maps?q=-1.2853274,36.8278345&z=17&hl=en&output=embed"
};
var phoneHref = `tel:+${BUSINESS.phone}`;
var emailHref = `mailto:${BUSINESS.email}`;
var whatsappHref = (message) => `https://wa.me/${BUSINESS.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
var whatsappProductMessage = (productName, price) => `Hello JnB, I'm interested in ${productName}${price ? ` (listed at KSh ${price.toLocaleString()})` : ""}. Please confirm availability and delivery options.`;
var NAV = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/products",
		label: "Products"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function Nav() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 backdrop-blur bg-[color:var(--color-secondary)]/95 text-white shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x flex h-16 items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground text-sm",
						children: "JnB"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden sm:block text-sm leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: "JnB Power Tools"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-white/70 font-normal",
							children: "& Digital Electronics"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden md:flex items-center gap-8",
					children: NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						className: "text-sm font-medium text-white/85 hover:text-white transition-colors",
						activeProps: { className: "text-accent" },
						activeOptions: { exact: true },
						children: n.label
					}, n.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden md:flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: phoneHref,
						className: "btn-outline !border-white !text-white hover:!bg-white hover:!text-secondary text-sm !py-2 !px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), " Call"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappHref(),
						target: "_blank",
						rel: "noreferrer",
						className: "btn-accent text-sm !py-2 !px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " WhatsApp"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-6 w-6" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden border-t border-white/10 animate-in slide-in-from-top-2 duration-200",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-x flex flex-col gap-1 py-3",
				children: [NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: n.to,
					onClick: () => setOpen(false),
					className: "px-3 py-2 rounded-md text-white/90 hover:bg-white/10",
					activeProps: { className: "bg-white/10 text-accent" },
					children: n.label
				}, n.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: phoneHref,
						className: "btn-outline !border-white !text-white flex-1 text-sm !py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), " Call"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappHref(),
						target: "_blank",
						rel: "noreferrer",
						className: "btn-accent flex-1 text-sm !py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " WhatsApp"]
					})]
				})]
			})
		})]
	});
}
var listCategories = createServerFn({ method: "GET" }).handler(createSsrRpc("0bf3a33a81d4829e7b266836c6612b89a8625168ac7404401956e47af771509a"));
function Footer() {
	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "bg-secondary text-white/80 py-12 mt-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x grid gap-8 md:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-white text-lg font-bold mb-4",
					children: BUSINESS.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed mb-4",
					children: "Nairobi's trusted supplier of power tools, solar systems, electrical accessories, electronics, agricultural machinery and hardware."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-white font-semibold mb-4",
					children: "Shop Categories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2 text-sm",
					children: [categories.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						search: { category: c.slug },
						className: "hover:text-accent transition-colors",
						children: c.name
					}) }, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products",
						search: {},
						className: "text-accent hover:text-white transition-colors font-medium",
						children: "View all products →"
					}) })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-white font-semibold mb-4",
					children: "Contact Us"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								BUSINESS.address.line1,
								", ",
								BUSINESS.address.line2,
								", ",
								BUSINESS.address.city
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-5 w-5 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: phoneHref,
								className: "hover:text-white",
								children: BUSINESS.phone
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-5 w-5 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `mailto:${BUSINESS.email}`,
								className: "hover:text-white",
								children: BUSINESS.email
							})]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-white font-semibold mb-4",
						children: "Need Help?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm mb-4",
						children: "Chat with our team for expert advice and fast orders."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappHref(),
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold px-5 py-2.5 hover:brightness-95 transition cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " WhatsApp Us"]
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-x mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/50",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" ",
				BUSINESS.name,
				". All rights reserved."
			] })
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[70vh] items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "btn-primary",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[70vh] items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "btn-primary",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "btn-outline",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var LOCAL_BUSINESS_JSONLD = {
	"@context": "https://schema.org",
	"@type": "Store",
	name: BUSINESS.name,
	description: BUSINESS.description,
	telephone: `+${BUSINESS.phone}`,
	email: BUSINESS.email,
	address: {
		"@type": "PostalAddress",
		streetAddress: `${BUSINESS.address.line1}, ${BUSINESS.address.line2}`,
		addressLocality: BUSINESS.address.city,
		addressCountry: BUSINESS.address.country
	},
	openingHours: ["Mo-Fr 06:00-21:00", "Sa 06:00-21:00"],
	areaServed: "Nairobi, Kenya"
};
var Route$7 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "JnB Power Tools & Digital Electronics — Nairobi" },
			{
				name: "description",
				content: BUSINESS.description
			},
			{
				name: "author",
				content: BUSINESS.name
			},
			{
				property: "og:site_name",
				content: BUSINESS.name
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:title",
				content: "JnB Power Tools & Digital Electronics — Nairobi"
			},
			{
				property: "og:description",
				content: BUSINESS.description
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify(LOCAL_BUSINESS_JSONLD)
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$7.useRouteContext();
	const isAdmin = useRouterState({ select: (s) => s.location.pathname }).startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-BYeX4ZH3.mjs");
var Route$6 = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "JnB Power Tools & Digital Electronics — Nairobi Hardware & Solar" },
			{
				name: "description",
				content: "Nairobi's trusted supplier of power tools, solar systems, electrical accessories, electronics, agricultural machinery and hardware. Visit us at Royal Palm Mall, Mfangano Street."
			},
			{
				property: "og:title",
				content: "JnB Power Tools & Digital Electronics — Nairobi"
			},
			{
				property: "og:description",
				content: "Genuine tools, solar and electricals at fair prices. Order via WhatsApp today."
			},
			{
				property: "og:url",
				content: "/"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var loginAdmin = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("82bc87f3c8ea7f7206115deac652e8a309955880255df402d4287d65393bd104"));
var logoutAdmin = createServerFn({ method: "POST" }).handler(createSsrRpc("5d777995768fee2a05f63a1d54a281bfa366dbc981cc2926e86e67db60df389d"));
var checkAdmin = createServerFn({ method: "GET" }).handler(createSsrRpc("68cde2a3b6ddfaf50bcf6a844a69632354466d889d9f58f30d4adb4197e70e17"));
var $$splitComponentImporter$4 = () => import("./admin-D6IsvJ_x.mjs");
var Route$5 = createFileRoute("/admin")({
	beforeLoad: async ({ location }) => {
		if (location.pathname === "/admin/login") return;
		const { authed } = await checkAdmin();
		if (!authed) throw redirect({ to: "/admin/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./contact-BT5V_4Qy.mjs");
var Route$4 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: "Contact JnB Power Tools & Digital Electronics — Nairobi" },
			{
				name: "description",
				content: "Get in touch with JnB Power Tools in Nairobi. Call, WhatsApp, email or visit our shop at Royal Palm Mall, Mfangano Street."
			},
			{
				property: "og:title",
				content: "Contact JnB Power Tools"
			},
			{
				property: "og:description",
				content: "Reach us via phone, WhatsApp, email or visit our shop in Nairobi CBD."
			},
			{
				property: "og:url",
				content: "/contact"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./products-D98AA0o5.mjs");
var Route$3 = createFileRoute("/products")({
	validateSearch: (search) => ({
		category: typeof search.category === "string" ? search.category : void 0,
		sub: typeof search.sub === "string" ? search.sub : void 0,
		q: typeof search.q === "string" ? search.q : void 0,
		sort: [
			"price-asc",
			"price-desc",
			"name",
			"featured"
		].includes(String(search.sort)) ? search.sort : void 0,
		stock: search.stock === true || search.stock === "true" ? true : void 0
	}),
	head: () => ({
		meta: [
			{ title: "Products — JnB Power Tools & Digital Electronics" },
			{
				name: "description",
				content: "Browse power tools, solar, electrical accessories, agricultural machinery, salon and barber equipment, locks and hardware — all available at JnB in Nairobi."
			},
			{
				property: "og:title",
				content: "Products — JnB Power Tools & Digital Electronics"
			},
			{
				property: "og:description",
				content: "Full catalog: power tools, solar, electronics, hardware and more. Order on WhatsApp."
			},
			{
				property: "og:url",
				content: "/products"
			}
		],
		links: [{
			rel: "canonical",
			href: "/products"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var BASE_URL = "";
var Route$2 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/products",
				changefreq: "weekly",
				priority: "0.9"
			},
			{
				path: "/contact",
				changefreq: "monthly",
				priority: "0.7"
			}
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$1 = () => import("./admin-D6Vl2g-J.mjs");
var Route$1 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./login-CGJ-Q9gQ.mjs");
var Route = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var AdminRoute = Route$5.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$7
});
var ContactRoute = Route$4.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$7
});
var ProductsRoute = Route$3.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => Route$7
});
var SitemapDotxmlRoute = Route$2.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$7
});
var AdminIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminRouteChildren = {
	AdminLoginRoute: Route.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => AdminRoute
	}),
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	ContactRoute,
	ProductsRoute,
	SitemapDotxmlRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { listCategories as a, emailHref as c, whatsappProductMessage as d, createSsrRpc as f, logoutAdmin as i, phoneHref as l, Route$3 as n, BUSINESS as o, loginAdmin as r, MAP as s, router_exports as t, whatsappHref as u };
