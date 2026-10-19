import { MessageCircle, Eye, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/data/products";
import type { Product } from "@/data/products";
import { whatsappHref, whatsappProductMessage } from "@/data/business";

interface Props {
  product: Product;
  onView: (p: Product) => void;
}

export function ProductCard({ product, onView }: Props) {
  return (
    <article className="card-surface flex flex-col overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* PLACEHOLDER_PRODUCT_IMAGE — replace with a real photo */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-primary/95 text-primary-foreground text-xs font-semibold px-2.5 py-1">
          {product.brand}
        </span>
        {product.inStock && (
          <span className="absolute top-3 right-3 rounded-full bg-emerald-500/95 text-white text-xs font-semibold px-2.5 py-1 inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> In stock
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        {product.subcategory && (
          <span className="mb-1.5 self-start rounded-full bg-muted text-muted-foreground text-[11px] font-semibold px-2 py-0.5">
            {product.subcategory}
          </span>
        )}
        <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2">{product.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
        <p className="mt-3 text-lg font-bold text-primary">{formatPrice(product.price)}</p>
        <div className="mt-4 flex gap-2 pt-3 border-t border-border">
          <button
            onClick={() => onView(product)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-primary text-primary text-sm font-semibold px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Eye className="h-4 w-4" /> Details
          </button>
          <a
            href={whatsappHref(whatsappProductMessage(product.name, product.price))}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold px-3 py-2 hover:brightness-95 transition"
          >
            <MessageCircle className="h-4 w-4" /> Order
          </a>
        </div>
      </div>
    </article>
  );
}
