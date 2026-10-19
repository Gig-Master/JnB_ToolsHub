import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Drill, E as HeartHandshake, F as BadgeDollarSign, I as Award, L as ArrowRight, M as Clock, _ as Phone, a as Truck, c as Sun, d as ShieldCheck, g as Plug, j as Cpu, l as Star, m as Scissors, r as Wrench, s as Tractor, t as Zap, u as Sparkles, w as Lock, x as MapPin, y as MessageCircle } from "../_libs/lucide-react.mjs";
import { a as listCategories, l as phoneHref, o as BUSINESS, s as MAP, u as whatsappHref } from "./router-C6IrYpw5.mjs";
import { i as useProducts, n as ProductModal, t as ProductCard } from "./ProductModal-CaWDChD-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BYeX4ZH3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var heroImage = "/images/site/jnb-shop-interior.jpg";
var ICONS = {
	Drill,
	Tractor,
	Cpu,
	Plug,
	Sun,
	Scissors,
	Zap,
	Lock,
	Wrench
};
function Home() {
	const [active, setActive] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Categories, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyUs, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Featured, { onView: setActive }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutPreview, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationPreview, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCTA, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductModal, {
			product: active,
			onClose: () => setActive(null),
			onSelect: setActive
		})
	] });
}
function Hero() {
	const perks = [
		{
			icon: ShieldCheck,
			label: "Genuine Products"
		},
		{
			icon: BadgeDollarSign,
			label: "Competitive Prices"
		},
		{
			icon: HeartHandshake,
			label: "Expert Support"
		},
		{
			icon: Truck,
			label: "Fast Response"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-secondary text-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: heroImage,
					alt: "JnB Power Tools & Digital Electronics shop interior in Nairobi",
					className: "h-full w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-primary/60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-x relative py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-accent" }), " Nairobi's trusted hardware & electronics store"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-5 text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight",
						children: [
							"Quality ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-accent",
								children: "Power Tools"
							}),
							" & Digital Electronics You Can Trust"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-lg text-white/80 max-w-xl",
						children: "Supplying genuine power tools, solar systems, electrical accessories, electronics, agricultural machinery and hardware products across Nairobi."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/products",
							className: "btn-accent",
							children: ["View Products ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: whatsappHref("Hello JnB, I'd like to place an order."),
							target: "_blank",
							rel: "noreferrer",
							className: "btn-outline !border-white !text-white hover:!bg-white hover:!text-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " Order on WhatsApp"]
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4",
					children: perks.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-5 hover:bg-white/15 transition animate-float",
						style: { animationDelay: `${i * .4}s` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "h-8 w-8 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-semibold",
							children: p.label
						})]
					}, p.label))
				})]
			})
		]
	});
}
function Categories() {
	const { data: categories = [], isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "What we stock",
				title: "Shop by category",
				subtitle: "Everything a contractor, technician, farmer or homeowner might need — under one roof."
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center mt-10 text-muted-foreground",
				children: "Loading categories..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: categories.map((c) => {
					const Icon = ICONS[c.icon] ?? Wrench;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/products",
						search: { category: c.slug },
						className: "card-surface p-6 group border border-transparent hover:border-primary/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-semibold text-lg",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground line-clamp-2",
								children: c.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all",
								children: ["Browse ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						]
					}, c.id);
				})
			})]
		})
	});
}
function WhyUs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden py-20 bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 opacity-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: heroImage,
				alt: "",
				className: "h-full w-full object-cover"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "Why JnB",
				title: "Why customers choose us"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					{
						icon: ShieldCheck,
						title: "Genuine & Quality Products",
						body: "Only authentic stock sourced from trusted suppliers and brands."
					},
					{
						icon: BadgeDollarSign,
						title: "Affordable Prices",
						body: "Competitive pricing for contractors, businesses and individuals."
					},
					{
						icon: Award,
						title: "Trusted Brands",
						body: "Bosch, Makita, DeWalt, Yale, Schneider, Honda and many more."
					},
					{
						icon: HeartHandshake,
						title: "Expert Technical Advice",
						body: "Our team helps you pick the right tool for the job."
					},
					{
						icon: Sparkles,
						title: "Excellent Customer Service",
						body: "Friendly, professional service before and after every sale."
					},
					{
						icon: MapPin,
						title: "Convenient Nairobi Location",
						body: "Royal Palm Mall, Mfangano Street — easy to reach in the CBD."
					}
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-6 border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-accent/10 text-accent grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(i.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 font-semibold",
							children: i.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: i.body
						})
					]
				}, i.title))
			})]
		})]
	});
}
function Featured({ onView }) {
	const { data: featured = [], isLoading } = useProducts({ featured: true });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					eyebrow: "Bestsellers",
					title: "Featured products",
					align: "left"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/products",
					className: "text-primary font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all",
					children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse bg-slate-200 rounded-2xl h-80" }, i))
			}) : featured.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-muted-foreground",
				children: "No featured products at the moment."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: featured.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product: p,
					onView
				}, p.id))
			})]
		})
	});
}
function AboutPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x grid lg:grid-cols-2 gap-12 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl overflow-hidden aspect-[4/3] bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80",
					alt: "Inside a hardware store",
					className: "h-full w-full object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-semibold text-primary",
					children: "About JnB"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-3xl md:text-4xl font-bold",
					children: "Your neighbourhood tool & electronics experts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted-foreground leading-relaxed",
					children: "JnB Power Tools & Digital Electronics is a trusted supplier of quality power tools, agricultural machinery, electronics, electrical accessories, solar systems, salon and barber equipment, locks, padlocks, and general hardware products. We serve contractors, technicians, electricians, farmers, businesses, and homeowners with reliable products at competitive prices, backed by expert advice and excellent customer service."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						className: "btn-primary",
						children: "Learn More"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappHref(),
						target: "_blank",
						rel: "noreferrer",
						className: "btn-outline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " Chat with us"]
					})]
				})
			] })]
		})
	});
}
function Testimonials() {
	const items = [
		{
			name: "Peter Kamau",
			role: "Electrical Contractor",
			text: "JnB has become my go-to for wiring accessories and MCBs. Their prices beat anywhere else in town and the team really knows their stock."
		},
		{
			name: "Grace Wanjiku",
			role: "Salon Owner",
			text: "Bought a dryer, steamer and clippers from JnB. All genuine, all working perfectly one year on. Great customer service."
		},
		{
			name: "John Mwangi",
			role: "Farmer, Kiambu",
			text: "Got a Honda water pump and knapsack sprayer. Delivered same day and the technical advice was spot on."
		}
	];
	const [i, setI] = (0, import_react.useState)(0);
	const t = items[i];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "Customer stories",
				title: "What our customers say"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 max-w-3xl mx-auto card-surface p-8 md:p-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center gap-1 text-accent",
						children: Array.from({ length: 5 }).map((_, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 fill-accent" }, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-lg text-foreground leading-relaxed",
						children: [
							"\"",
							t.text,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 font-semibold",
						children: t.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: t.role
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex justify-center gap-2",
						children: items.map((_, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setI(k),
							"aria-label": `Review ${k + 1}`,
							className: `h-2 rounded-full transition-all cursor-pointer ${k === i ? "w-8 bg-primary" : "w-2 bg-border"}`
						}, k))
					})
				]
			})]
		})
	});
}
function LocationPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-20 bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x grid lg:grid-cols-2 gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					eyebrow: "Visit us",
					title: "Find our shop",
					align: "left"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground text-sm",
							children: [
								BUSINESS.address.line1,
								", ",
								BUSINESS.address.line2,
								", ",
								BUSINESS.address.city
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Business hours"
						}), BUSINESS.hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								h.day,
								": ",
								h.time
							]
						}, h.day))] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: MAP.directionsUrl,
					target: "_blank",
					rel: "noreferrer",
					className: "btn-primary mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }), " Get Directions"]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl overflow-hidden aspect-video bg-muted shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "JnB Power Tools & Digital Electronics location",
					src: MAP.embedUrl,
					className: "h-full w-full border-0",
					loading: "lazy",
					referrerPolicy: "no-referrer-when-downgrade"
				})
			})]
		})
	});
}
function FinalCTA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-x",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl bg-gradient-to-br from-accent to-orange-600 text-white p-10 md:p-14 text-center shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl md:text-4xl font-bold",
						children: "Need Tools or Electrical Supplies?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-white/90 max-w-2xl mx-auto",
						children: "Talk to us — we'll help you find the right product at the right price, and get it to you fast."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3 justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: whatsappHref(),
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-2 rounded-full bg-white text-accent font-semibold px-6 py-3 hover:brightness-95 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5" }), " WhatsApp Now"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: phoneHref,
							className: "inline-flex items-center gap-2 rounded-full border-2 border-white text-white font-semibold px-6 py-3 hover:bg-white hover:text-accent transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-5 w-5" }), " Call Us"]
						})]
					})
				]
			})
		})
	});
}
function SectionHeader({ eyebrow, title, subtitle, align = "center" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl",
		children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold text-primary uppercase tracking-wider",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-3xl md:text-4xl font-bold text-foreground",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: subtitle
			})
		]
	});
}
//#endregion
export { Home as component };
