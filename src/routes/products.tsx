import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Search,
  Wrench,
  Flame,
  Star,
  Drill,
  Tractor,
  Cpu,
  Plug,
  Sun,
  Scissors,
  Zap,
  Lock,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/hooks/useProducts";
import { listCategories } from "@/functions/categories";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import type { ProductDTO } from "@/types";

type Search = {
  category?: string;
  sub?: string;
  q?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "name";
  stock?: boolean;
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Drill,
  Tractor,
  Cpu,
  Plug,
  Sun,
  Scissors,
  Zap,
  Lock,
  Wrench,
};

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search.category === "string" ? search.category : undefined,
    sub: typeof search.sub === "string" ? search.sub : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    sort: ["price-asc", "price-desc", "name", "featured"].includes(String(search.sort))
      ? (search.sort as Search["sort"])
      : undefined,
    stock: search.stock === true || search.stock === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Products — JnB Power Tools & Digital Electronics" },
      {
        name: "description",
        content:
          "Browse power tools, solar, electrical accessories, agricultural machinery, salon and barber equipment, locks and hardware — all available at JnB in Nairobi.",
      },
      { property: "og:title", content: "Products — JnB Power Tools & Digital Electronics" },
      {
        property: "og:description",
        content:
          "Full catalog: power tools, solar, electronics, hardware and more. Order on WhatsApp.",
      },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category, sub, q = "", sort = "featured", stock } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const [active, setActive] = useState<ProductDTO | null>(null);

  const setSearch = (patch: Partial<Search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  // Notice we added `error: productsError` here
  const { data: products = [], isLoading: loadingProducts, error: productsError } = useProducts();
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(),
  });

  const currentCategory = categories.find((c) => c.slug === category);

  const inCategory = useMemo(() => {
    if (!currentCategory) return [];
    return products.filter((p) => p.categoryId === currentCategory.id);
  }, [products, currentCategory]);

  const subcategories = useMemo(() => {
    return currentCategory?.subcategories ?? [];
  }, [currentCategory]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = inCategory.filter((p) => {
      if (sub && p.subcategoryId !== sub) return false;
      if (stock && !p.inStock) return false;
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.features.join(" ").toLowerCase().includes(query)
      );
    });
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [inCategory, sub, q, sort, stock]);

  const offers = useMemo(() => {
    return products
      .filter((p) => p.featured)
      .slice(0, 4)
      .map((p) => ({
        product: p,
        discount: 15,
        wasPrice: Math.round(p.price / 0.85),
      }));
  }, [products]);

  const bestSellers = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  if (loadingCategories) return <div className="p-20 text-center">Loading catalog...</div>;

  return (
    <>
      {/* Banner */}
      <section className="bg-secondary text-white py-14">
        <div className="container-x">
          <Breadcrumbs
            category={currentCategory?.name}
            sub={sub}
            categorySlug={currentCategory?.slug}
          />
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">
            {currentCategory ? currentCategory.name : "Our Products"}
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            {currentCategory
              ? currentCategory.description
              : `${products.length} genuine products across ${categories.length} categories. Pick a category to get started.`}
          </p>
        </div>
      </section>

      {/* DISPLAY THE ERROR HERE */}
      {productsError && (
        <div className="container-x py-6">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Failed to load products from Database</h2>
            <p className="font-mono text-sm bg-white p-4 rounded border border-red-100 overflow-auto">
              {productsError.message}
            </p>
          </div>
        </div>
      )}

      {!currentCategory ? (
        <CategoryGrid categories={categories} products={products} loading={loadingProducts} />
      ) : (
        <section className="py-12 bg-background">
          <div className="container-x">
            {/* Subcategory Pills */}
            {subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSearch({ sub: undefined })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${!sub ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/10"}`}
                >
                  All {currentCategory.shortName}
                </button>
                {subcategories.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSearch({ sub: s.id })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${sub === s.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/10"}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            {/* Filters */}
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] items-center">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={q}
                  onChange={(e) => setSearch({ q: e.target.value || undefined })}
                  aria-label="Search products"
                  className="w-full h-12 pl-12 pr-4 rounded-full border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category Dropdown */}
              <select
                value={category || "all"}
                onChange={(e) =>
                  setSearch({
                    category: e.target.value === "all" ? undefined : e.target.value,
                    sub: undefined,
                  })
                }
                aria-label="Filter by category"
                className="h-12 px-4 rounded-full border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSearch({ sort: e.target.value as Search["sort"] })}
                aria-label="Sort products"
                className="h-12 px-4 rounded-full border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>

              <label className="inline-flex items-center gap-2 text-sm font-medium px-4 h-12 rounded-full border border-border bg-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(stock)}
                  onChange={(e) => setSearch({ stock: e.target.checked ? true : undefined })}
                  className="h-4 w-4 accent-[hsl(var(--primary))] cursor-pointer"
                />
                In stock only
              </label>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {results.length} product{results.length !== 1 ? "s" : ""}
            </p>

            {loadingProducts ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-slate-200 rounded-2xl h-80" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <p className="mt-10 text-muted-foreground italic">No products match your filters.</p>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} onView={setActive} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Offers (Using Live Data) */}
      {offers.length > 0 && (
        <section className="py-12 bg-muted/40">
          <div className="container-x">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-accent" />
              <h2 className="text-2xl md:text-3xl font-bold">Offers & Promotions</h2>
            </div>
            <p className="mt-2 text-muted-foreground text-sm">
              Limited-time discounts — while stocks last.
            </p>
            <div className="mt-6 flex gap-5 overflow-x-auto pb-4 snap-x md:grid md:overflow-visible md:grid-cols-3 lg:grid-cols-4">
              {offers.map(({ product, discount, wasPrice }) => (
                <div key={product.id} className="relative min-w-[260px] md:min-w-0 snap-start">
                  <span className="absolute -top-2 -right-2 z-10 rounded-full bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 shadow-md">
                    -{discount}%
                  </span>
                  <ProductCard product={product} onView={setActive} />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Was <span className="line-through">{formatPrice(wasPrice)}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best sellers (Using Live Data) */}
      {bestSellers.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container-x">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">Best Selling Products</h2>
            </div>
            <p className="mt-2 text-muted-foreground text-sm">What our customers buy most.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} onView={setActive} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductModal product={active} onClose={() => setActive(null)} onSelect={setActive} />
    </>
  );
}

function Breadcrumbs({
  category,
  sub,
  categorySlug,
}: {
  category?: string;
  sub?: string;
  categorySlug?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-white/70 flex-wrap"
    >
      <Link to="/products" search={{}} className="hover:text-accent">
        Products
      </Link>
      {category && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" search={{ category: categorySlug }} className="hover:text-accent">
            {category}
          </Link>
        </>
      )}
      {sub && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">{sub}</span>
        </>
      )}
    </nav>
  );
}

function CategoryGrid({
  categories,
  products,
  loading,
}: {
  categories: any[];
  products: ProductDTO[];
  loading: boolean;
}) {
  return (
    <section className="py-14 bg-background">
      <div className="container-x">
        <h2 className="text-2xl md:text-3xl font-bold">Shop by category</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const Icon = ICONS[c.icon] ?? Wrench;
            const count = products.filter((p) => p.categoryId === c.id).length;
            return (
              <Link
                key={c.id}
                to="/products"
                search={{ category: c.slug }}
                className="card-surface p-6 group border border-transparent hover:border-primary/20"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{c.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <p className="mt-3 text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  {loading ? (
                    <span className="animate-pulse">Counting...</span>
                  ) : (
                    `${count} product${count !== 1 ? "s" : ""}`
                  )}
                  <ChevronRight className="h-4 w-4" />
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
