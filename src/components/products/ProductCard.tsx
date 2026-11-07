import { useEffect, useState } from "react";
import { MessageCircle, Eye, CheckCircle2, ShoppingCart, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductDTO } from "@/types";
import { whatsappHref, whatsappProductMessage } from "@/data/business";
import { useCart } from "@/lib/cart";

interface Props {
  product: ProductDTO;
  onView: (p: ProductDTO) => void;
}

export function ProductCard({ product, onView }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1500);
    return () => window.clearTimeout(t);
  }, [added]);

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  return (
    <article className="card-surface flex flex-col overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-slate-100">
            No Image
          </div>
        )}

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
        <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {product.shortDescription}
        </p>
        <p className="mt-3 text-lg font-bold text-primary">{formatPrice(product.price)}</p>

        <div className="mt-4 pt-3 border-t border-border space-y-2">
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => {
              addItem(product);
              setAdded(true);
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold px-3 py-2.5 hover:brightness-95 transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {!product.inStock ? (
              "Out of stock"
            ) : added ? (
              <>
                <Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" /> Add to cart
              </>
            )}
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onView(product)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-primary text-primary text-sm font-semibold px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
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
      </div>
    </article>
  );
}