import { MessageCircle, Eye, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ProductDTO } from "@/types";
import { whatsappHref, whatsappProductMessage } from "@/data/business";

interface Props {
  product: ProductDTO;
  onView: (p: ProductDTO) => void;
}

export function ProductCard({ product, onView }: Props) {
  // Find the primary image from the new DB images array
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
        {/* Note: We removed the hardcoded product.subcategory string check here 
            because in the new DB, subcategory is an ID. We can add it back later 
            if we do a join in the query. */}

        <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {product.shortDescription}
        </p>
        <p className="mt-3 text-lg font-bold text-primary">{formatPrice(product.price)}</p>

        <div className="mt-4 flex gap-2 pt-3 border-t border-border">
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
    </article>
  );
}
