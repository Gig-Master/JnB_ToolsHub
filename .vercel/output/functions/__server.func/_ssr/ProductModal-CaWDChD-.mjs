import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { N as CircleCheck, O as Eye, _ as Phone, a as Truck, d as ShieldCheck, n as X, y as MessageCircle } from "../_libs/lucide-react.mjs";
import { d as whatsappProductMessage, l as phoneHref, u as whatsappHref } from "./router-C6IrYpw5.mjs";
import { n as listProducts } from "./products-Biw2sqGQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductModal-CaWDChD-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useProducts(filters) {
	return useQuery({
		queryKey: ["products", filters],
		queryFn: () => listProducts({ data: filters ?? {} }),
		staleTime: 3e5
	});
}
function formatPrice(price) {
	return `KSh ${price.toLocaleString("en-KE")}`;
}
function ProductCard({ product, onView }) {
	const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "card-surface flex flex-col overflow-hidden group",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[4/3] overflow-hidden bg-muted",
			children: [
				primaryImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: primaryImage.url,
					alt: primaryImage.alt,
					loading: "lazy",
					className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full w-full flex items-center justify-center text-muted-foreground bg-slate-100",
					children: "No Image"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-3 left-3 rounded-full bg-primary/95 text-primary-foreground text-xs font-semibold px-2.5 py-1",
					children: product.brand
				}),
				product.inStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute top-3 right-3 rounded-full bg-emerald-500/95 text-white text-xs font-semibold px-2.5 py-1 inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " In stock"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 flex flex-col flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-foreground text-base leading-snug line-clamp-2",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground line-clamp-2",
					children: product.shortDescription
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-lg font-bold text-primary",
					children: formatPrice(product.price)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2 pt-3 border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onView(product),
						className: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-primary text-primary text-sm font-semibold px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), " Details"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappHref(whatsappProductMessage(product.name, product.price)),
						target: "_blank",
						rel: "noreferrer",
						className: "flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 hover:brightness-95 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " Order"]
					})]
				})
			]
		})]
	});
}
function ProductModal({ product, onClose }) {
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);
	if (!product) return null;
	const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-secondary/60 backdrop-blur-sm transition-opacity",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl md:flex-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-foreground backdrop-blur hover:bg-white shadow-sm transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full bg-muted md:w-1/2 relative min-h-[300px]",
					children: primaryImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: primaryImage.url,
						alt: primaryImage.alt,
						className: "absolute inset-0 h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full items-center justify-center text-muted-foreground",
						children: "No Image Available"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full flex-col overflow-y-auto p-6 md:w-1/2 md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary",
								children: product.brand
							}), product.inStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " In Stock"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700",
								children: "Out of Stock"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-bold text-foreground md:text-3xl",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: product.shortDescription
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-3xl font-extrabold text-primary",
							children: formatPrice(product.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: whatsappHref(whatsappProductMessage(product.name, product.price)),
								target: "_blank",
								rel: "noreferrer",
								className: "flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:brightness-95 transition cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5" }), " Order via WhatsApp"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: phoneHref,
								className: "flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-5 w-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-4 border-y border-border py-4 text-xs font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), " Genuine Product"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-blue-600" }), " Fast Delivery"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-foreground",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap",
									children: product.fullDescription
								})] }),
								Object.keys(product.specifications).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-foreground",
									children: "Specifications"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "mt-2 grid grid-cols-2 gap-2 text-sm",
									children: Object.entries(product.specifications).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col border-b border-border pb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted-foreground",
											children: key
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "font-medium text-foreground",
											children: value
										})]
									}, key))
								})] }),
								product.features.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-foreground",
									children: "Key Features"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground",
									children: product.features.map((feature, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: feature }, i))
								})] })
							]
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { useProducts as i, ProductModal as n, formatPrice as r, ProductCard as t };
