import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Drill, D as Flame, P as ChevronRight, c as Sun, g as Plug, j as Cpu, l as Star, m as Scissors, p as Search, r as Wrench, s as Tractor, t as Zap, w as Lock } from "../_libs/lucide-react.mjs";
import { a as listCategories, n as Route$3 } from "./router-C6IrYpw5.mjs";
import { i as useProducts, n as ProductModal, r as formatPrice, t as ProductCard } from "./ProductModal-CaWDChD-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-D98AA0o5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function ProductsPage() {
	const { category, sub, q = "", sort = "featured", stock } = Route$3.useSearch();
	const navigate = useNavigate({ from: "/products" });
	const [active, setActive] = (0, import_react.useState)(null);
	const setSearch = (patch) => navigate({ search: (prev) => ({
		...prev,
		...patch
	}) });
	const { data: products = [], isLoading: loadingProducts } = useProducts();
	const { data: categories = [], isLoading: loadingCategories } = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const currentCategory = categories.find((c) => c.slug === category);
	const inCategory = (0, import_react.useMemo)(() => {
		if (!currentCategory) return [];
		return products.filter((p) => p.categoryId === currentCategory.id);
	}, [products, currentCategory]);
	const subcategories = (0, import_react.useMemo)(() => {
		return currentCategory?.subcategories ?? [];
	}, [currentCategory]);
	const results = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		let list = inCategory.filter((p) => {
			if (sub && p.subcategoryId !== sub) return false;
			if (stock && !p.inStock) return false;
			if (!query) return true;
			return p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.shortDescription.toLowerCase().includes(query) || p.features.join(" ").toLowerCase().includes(query);
		});
		list = [...list];
		if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
		else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
		else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
		else list.sort((a, b) => Number(b.featured) - Number(a.featured));
		return list;
	}, [
		inCategory,
		sub,
		q,
		sort,
		stock
	]);
	const offers = (0, import_react.useMemo)(() => {
		return products.filter((p) => p.featured).slice(0, 4).map((p) => ({
			product: p,
			discount: 15,
			wasPrice: Math.round(p.price / .85)
		}));
	}, [products]);
	const bestSellers = (0, import_react.useMemo)(() => {
		return products.slice(0, 4);
	}, [products]);
	if (loadingCategories) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-20 text-center",
		children: "Loading catalog..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary text-white py-14",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-x",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, {
						category: currentCategory?.name,
						sub,
						categorySlug: currentCategory?.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-4xl md:text-5xl font-bold",
						children: currentCategory ? currentCategory.name : "Our Products"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-white/70 max-w-2xl",
						children: currentCategory ? currentCategory.description : `${products.length} genuine products across ${categories.length} categories. Pick a category to get started.`
					})
				]
			})
		}),
		!currentCategory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryGrid, {
			categories,
			products
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-12 bg-background",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-x",
				children: [
					subcategories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setSearch({ sub: void 0 }),
							className: `px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${!sub ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/10"}`,
							children: ["All ", currentCategory.shortName]
						}), subcategories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearch({ sub: s.id }),
							className: `px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${sub === s.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/10"}`,
							children: s.name
						}, s.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "search",
									placeholder: "Search products...",
									value: q,
									onChange: (e) => setSearch({ q: e.target.value || void 0 }),
									"aria-label": "Search products",
									className: "w-full h-12 pl-12 pr-4 rounded-full border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: category || "all",
								onChange: (e) => setSearch({
									category: e.target.value === "all" ? void 0 : e.target.value,
									sub: void 0
								}),
								"aria-label": "Filter by category",
								className: "h-12 px-4 rounded-full border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All Categories"
								}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.slug,
									children: c.name
								}, c.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: sort,
								onChange: (e) => setSearch({ sort: e.target.value }),
								"aria-label": "Sort products",
								className: "h-12 px-4 rounded-full border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "featured",
										children: "Sort: Featured"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "price-asc",
										children: "Price: Low to High"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "price-desc",
										children: "Price: High to Low"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "name",
										children: "Name: A–Z"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-2 text-sm font-medium px-4 h-12 rounded-full border border-border bg-white cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: Boolean(stock),
									onChange: (e) => setSearch({ stock: e.target.checked ? true : void 0 }),
									className: "h-4 w-4 accent-[hsl(var(--primary))] cursor-pointer"
								}), "In stock only"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: [
							results.length,
							" product",
							results.length !== 1 ? "s" : ""
						]
					}),
					loadingProducts ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
						children: [
							1,
							2,
							3,
							4
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse bg-slate-200 rounded-2xl h-80" }, i))
					}) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10 text-muted-foreground italic",
						children: "No products match your filters."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
						children: results.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product: p,
							onView: setActive
						}, p.id))
					})
				]
			})
		}),
		offers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-12 bg-muted/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-x",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-6 w-6 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl md:text-3xl font-bold",
							children: "Offers & Promotions"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground text-sm",
						children: "Limited-time discounts — while stocks last."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex gap-5 overflow-x-auto pb-4 snap-x md:grid md:overflow-visible md:grid-cols-3 lg:grid-cols-4",
						children: offers.map(({ product, discount, wasPrice }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[260px] md:min-w-0 snap-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute -top-2 -right-2 z-10 rounded-full bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 shadow-md",
									children: [
										"-",
										discount,
										"%"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
									product,
									onView: setActive
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1.5 text-xs text-muted-foreground",
									children: ["Was ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "line-through",
										children: formatPrice(wasPrice)
									})]
								})
							]
						}, product.id))
					})
				]
			})
		}),
		bestSellers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-12 bg-background",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-x",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-6 w-6 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl md:text-3xl font-bold",
							children: "Best Selling Products"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-muted-foreground text-sm",
						children: "What our customers buy most."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
						children: bestSellers.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product: p,
							onView: setActive
						}, p.id))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductModal, {
			product: active,
			onClose: () => setActive(null),
			onSelect: setActive
		})
	] });
}
function Breadcrumbs({ category, sub, categorySlug }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		"aria-label": "Breadcrumb",
		className: "flex items-center gap-1.5 text-sm text-white/70 flex-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/products",
				search: {},
				className: "hover:text-accent",
				children: "Products"
			}),
			category && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/products",
				search: { category: categorySlug },
				className: "hover:text-accent",
				children: category
			})] }),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-white",
				children: sub
			})] })
		]
	});
}
function CategoryGrid({ categories, products }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-14 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-x",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl md:text-3xl font-bold",
				children: "Shop by category"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: categories.map((c) => {
					const Icon = ICONS[c.icon] ?? Wrench;
					const count = products.filter((p) => p.categoryId === c.id).length;
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all",
								children: [
									count,
									" products ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
								]
							})
						]
					}, c.id);
				})
			})]
		})
	});
}
//#endregion
export { ProductsPage as component };
