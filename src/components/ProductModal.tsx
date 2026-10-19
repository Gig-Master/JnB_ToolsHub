import { X, CheckCircle2, MessageCircle, ShieldCheck, Truck, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { whatsappHref, whatsappProductMessage, phoneHref } from "@/data/business";
import type { ProductDTO } from "@/types";
import { useEffect } from "react";

export function ProductModal({ 
  product, 
  onClose 
}: { 
  product: ProductDTO | null; 
  onClose: () => void; 
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const primaryImage = product.images.find(i => i.isPrimary) || product.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-secondary/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-foreground backdrop-blur hover:bg-white shadow-sm transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left: Images */}
        <div className="w-full bg-muted md:w-1/2 relative min-h-[300px]">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image Available
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex w-full flex-col overflow-y-auto p-6 md:w-1/2 md:p-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {product.brand}
            </span>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3 w-3" /> In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Out of Stock
              </span>
            )}
          </div>

          <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">{product.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>
          
          <p className="mt-4 text-3xl font-extrabold text-primary">{formatPrice(product.price)}</p>

          <div className="mt-6 flex gap-3">
            <a
              href={whatsappHref(whatsappProductMessage(product.name, product.price))}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:brightness-95 transition cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" /> Order via WhatsApp
            </a>
            <a
              href={phoneHref}
              className="flex items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              <Phone className="h-5 w-5" />
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex gap-4 border-y border-border py-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Genuine Product</div>
            <div className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-blue-600" /> Fast Delivery</div>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-foreground">Description</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{product.fullDescription}</p>
            </div>

            {Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground">Specifications</h3>
                <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col border-b border-border pb-1">
                      <dt className="text-xs text-muted-foreground">{key}</dt>
                      <dd className="font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground">Key Features</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}