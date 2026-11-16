import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2, MessageCircle, ShieldCheck, Truck, Phone, ShoppingCart, Check, Minus, Plus, ChevronRight,
} from "@/components/icons";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import {
  BUSINESS, DELIVERY, SITE_URL, phoneHref, whatsappHref, whatsappProductMessage,
} from "@/data/business";
import { getProductPage } from "@/functions/product-page";
import { ProductCard } from "@/components/products/ProductCard";

const absoluteUrl = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

function shorten(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}...`;
}

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const data = await getProductPage({ data: { slug: params.slug } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found - JnB Power Tools" }] };
    const { product: p, category } = loaderData;
    const url = `${SITE_URL}/product/${p.slug}`;
    const images = p.images.map((i) => absoluteUrl(i.url));
    const description = shorten(
      p.shortDescription || p.fullDescription ||
        `${p.name} available at ${BUSINESS.name}, Nairobi.`,
      300,
    );
    const title = `${p.name}${p.brand ? ` - ${p.brand}` : ""} | Price in Kenya - JnB Power Tools`;

    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${url}#product`,
      name: p.name,
      description: shorten(p.fullDescription || p.shortDescription || p.name, 5000),
      sku: p.id,
      url,
      image: images.length ? images : undefined,
      brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
      category: category.name,
      additionalProperty: Object.entries(p.specifications).map(([name, value]) => ({
        "@type": "PropertyValue",
        name,
        value,
      })),
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "KES",
        price: p.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: { "@id": `${SITE_URL}/#business` },
      },
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
        { "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/products?category=${category.slug}` },
        { "@type": "ListItem", position: 4, name: p.name, item: url },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        ...(images[0] ? [{ property: "og:image", content: images[0] }, { name: "twitter:image", content: images[0] }] : []),
        { property: "product:price:amount", content: String(p.price) },
        { property: "product:price:currency", content: "KES" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(productJsonLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd) },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, category, subcategoryName, related } = Route.useLoaderData();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setQty(1);
    setAdded(false);
    setImgIndex(0);
  }, [product.id]);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(t);
  }, [added]);

  const image = product.images[imgIndex] ?? product.images[0];
  const specs = Object.entries(product.specifications);

  return (
    <>
      <section className="bg-secondary text-white py-8">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/products" search={{}} className="hover:text-accent">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/products" search={{ category: category.slug }} className="hover:text-accent">{category.name}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              {image ? (
                <img src={image.url} alt={image.alt} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No image available</div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 cursor-pointer ${i === imgIndex ? "border-primary" : "border-border"}`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.brand && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{product.brand}</span>
              )}
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> In stock
                </span>
              ) : (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">Out of stock</span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>
            {product.shortDescription && (
              <p className="mt-3 text-muted-foreground">{product.shortDescription}</p>
            )}
            <p className="mt-5 text-4xl font-extrabold text-primary">{formatPrice(product.price)}</p>

            {product.inStock && (
              <div className="mt-6 flex items-center gap-3">
                <div className="inline-flex items-center rounded-full border border-border">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 cursor-pointer">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))} className="p-3 cursor-pointer">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { addItem(product, qty); setAdded(true); }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-95 transition cursor-pointer"
                >
                  {added ? (<><Check className="h-5 w-5" /> Added to cart</>) : (<><ShoppingCart className="h-5 w-5" /> Add to cart</>)}
                </button>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <a
                href={whatsappHref(whatsappProductMessage(product.name, product.price))}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:brightness-95 transition"
              >
                <MessageCircle className="h-5 w-5" /> Order via WhatsApp
              </a>
              <a href={phoneHref} aria-label="Call us" className="flex items-center justify-center rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>

            {/* Plain facts: easy for people and AI assistants to read */}
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl border border-border bg-white p-5 text-sm">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="font-medium">{category.name}{subcategoryName ? ` - ${subcategoryName}` : ""}</dd>
              {product.brand && (<><dt className="text-muted-foreground">Brand</dt><dd className="font-medium">{product.brand}</dd></>)}
              <dt className="text-muted-foreground">Price</dt>
              <dd className="font-medium">{formatPrice(product.price)}</dd>
              <dt className="text-muted-foreground">Availability</dt>
              <dd className="font-medium">{product.inStock ? "In stock" : "Out of stock"}</dd>
              <dt className="text-muted-foreground">Sold by</dt>
              <dd className="font-medium">{BUSINESS.name}, {BUSINESS.address.line2}, {BUSINESS.address.city}</dd>
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="font-medium">KSh {DELIVERY.nairobiFee} flat in Nairobi, or collect from our shop</dd>
            </dl>

            <div className="mt-5 flex gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Genuine product</div>
              <div className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-blue-600" /> Fast delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Description, features, specs */}
      <section className="pb-12 bg-background">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          {product.fullDescription && (
            <div>
              <h2 className="text-xl font-bold">About this product</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{product.fullDescription}</p>
            </div>
          )}
          {product.features.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Key features</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {product.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
          {product.applications.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Best used for</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {product.applications.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          )}
          {specs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold">Specifications</h2>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex flex-col border-b border-border pb-1">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-x">
            <h2 className="text-2xl font-bold">More in {category.name}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} onView={(p) => navigate({ to: "/product/$slug", params: { slug: p.slug } })} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}