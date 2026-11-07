import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { whatsappHref } from "@/data/business";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — JnB Power Tools & Digital Electronics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, hydrated, count, subtotal, setQty, removeItem, clear } = useCart();

  const whatsappMessage = [
    "Hello JnB, I'd like to order:",
    ...items.map(
      (i) => `- ${i.qty} x ${i.name} (${formatPrice(i.price)}) = ${formatPrice(i.price * i.qty)}`,
    ),
    `Total: ${formatPrice(subtotal)}`,
  ].join("\n");

  return (
    <>
      <section className="bg-secondary text-white py-12">
        <div className="container-x">
          <h1 className="text-3xl md:text-4xl font-bold">Your Cart</h1>
          {hydrated && count > 0 && (
            <p className="mt-2 text-white/70">
              {count} item{count !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container-x">
          {!hydrated ? (
            <div className="animate-pulse bg-slate-200 rounded-2xl h-40" />
          ) : items.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <ShoppingBag className="mx-auto h-14 w-14 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse our catalog and add the products you need.
              </p>
              <div className="mt-6">
                <Link to="/products" search={{}} className="btn-primary">
                  Browse products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="card-surface flex gap-4 p-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-primary">{item.brand}</p>
                          <h2 className="font-semibold leading-snug line-clamp-2">{item.name}</h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.id)}
                          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="p-2 cursor-pointer"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="p-2 cursor-pointer"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="font-bold">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="card-surface p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold">Order summary</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="text-muted-foreground">Calculated at checkout</dd>
                  </div>
                </dl>
                <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>

                <Link to="/checkout" className="btn-primary mt-6 w-full justify-center">
                  Checkout
                </Link>
                <a
                  href={whatsappHref(whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline mt-3 w-full justify-center"
                >
                  <MessageCircle className="h-5 w-5" /> Order via WhatsApp instead
                </a>
    
                <button
                  type="button"
                  onClick={clear}
                  className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-red-600 cursor-pointer"
                >
                  Clear cart
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
