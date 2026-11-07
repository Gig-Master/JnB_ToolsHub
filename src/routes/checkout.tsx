import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Store, Smartphone, Banknote } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { getMe } from "@/functions/customer";
import { listMyAddresses } from "@/functions/addresses";
import { placeOrder } from "@/functions/checkout";
import { BUSINESS, DELIVERY } from "@/data/business";

// Flip to true in Stage 4, once M-Pesa STK push is built.
const MPESA_ENABLED = false;

export const Route = createFileRoute("/checkout")({
  beforeLoad: async () => {
    const user = await getMe();
    if (!user) throw redirect({ to: "/login", search: { redirect: "/checkout" } });
    return { user };
  },
  head: () => ({
    meta: [
      { title: "Checkout — JnB Power Tools & Digital Electronics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

type Fulfilment = "delivery" | "pickup";
type Payment = "mpesa" | "cod";

function CheckoutPage() {
  const router = useRouter();
  const { items, hydrated, subtotal, clear } = useCart();
  const { data: addresses = [], isLoading: loadingAddr } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => listMyAddresses(),
  });

  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery");
  const [addressId, setAddressId] = useState<string | null>(null);
  const [payment, setPayment] = useState<Payment>(MPESA_ENABLED ? "mpesa" : "cod");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false); // blocks double-clicks instantly

  // Use the chosen address, else the default one, else the first one
  const chosenId =
    addressId ?? addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null;
  const selected = addresses.find((a) => a.id === chosenId) ?? null;

  // Display only. The server recalculates everything from the database.
  const flat = selected
    ? (DELIVERY.flatFeeCounties as readonly string[]).includes(selected.county)
    : false;
  const needsQuote = fulfilment === "delivery" && !!selected && !flat;
  const fee = fulfilment === "delivery" && selected && flat ? DELIVERY.nairobiFee : 0;
  const total = subtotal + fee;

  const mpesaAllowed = MPESA_ENABLED && !needsQuote;
  const pay: Payment = mpesaAllowed ? payment : "cod";

  const canSubmit =
    !busy && items.length > 0 && (fulfilment === "pickup" || (!!selected && !loadingAddr));

  async function submit() {
    if (submitting.current || !canSubmit) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      const res = await placeOrder({
        data: {
          items: items.map((i) => ({ productId: i.id, quantity: i.qty })),
          fulfilment,
          paymentMethod: pay,
          addressId: fulfilment === "delivery" ? chosenId : null,
          notes,
        },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      // Go to the confirmation first, then empty the cart (avoids a flash of "empty cart")
      await router.navigate({
        to: "/order/$orderNumber",
        params: { orderNumber: res.orderNumber },
      });
      clear();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  const radioCard = (active: boolean, disabled = false) =>
    `flex items-start gap-3 rounded-xl border p-4 text-sm ${
      active ? "border-primary bg-primary/5" : "border-border"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`;

  return (
    <>
      <section className="bg-secondary text-white py-12">
        <div className="container-x">
          <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container-x">
          {!hydrated ? (
            <div className="animate-pulse bg-slate-200 rounded-2xl h-40" />
          ) : items.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <div className="mt-6">
                <Link to="/products" search={{}} className="btn-primary">
                  Browse products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
              <div className="space-y-6">
                {/* 1. Delivery or pickup */}
                <div className="card-surface p-6">
                  <h2 className="text-lg font-semibold">1. How do you want to receive it?</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className={radioCard(fulfilment === "delivery")}>
                      <input
                        type="radio"
                        name="fulfilment"
                        checked={fulfilment === "delivery"}
                        onChange={() => setFulfilment("delivery")}
                        className="mt-1"
                      />
                      <span>
                        <span className="flex items-center gap-2 font-semibold">
                          <MapPin className="h-4 w-4" /> Delivery
                        </span>
                        <span className="text-muted-foreground">
                          {formatPrice(DELIVERY.nairobiFee)} within Nairobi. Other counties are quoted by us.
                        </span>
                      </span>
                    </label>
                    <label className={radioCard(fulfilment === "pickup")}>
                      <input
                        type="radio"
                        name="fulfilment"
                        checked={fulfilment === "pickup"}
                        onChange={() => setFulfilment("pickup")}
                        className="mt-1"
                      />
                      <span>
                        <span className="flex items-center gap-2 font-semibold">
                          <Store className="h-4 w-4" /> Pickup (free)
                        </span>
                        <span className="text-muted-foreground">
                          {BUSINESS.address.line1}, {BUSINESS.address.line2}, {BUSINESS.address.city}
                        </span>
                      </span>
                    </label>
                  </div>

                  {fulfilment === "delivery" && (
                    <div className="mt-5">
                      {loadingAddr ? (
                        <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
                      ) : addresses.length === 0 ? (
                        <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                          You have no saved delivery address yet.{" "}
                          <Link to="/account" search={{}} className="font-semibold text-primary">
                            Add one in your account
                          </Link>
                          , then come back. Your cart is saved.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {addresses.map((a) => (
                            <label key={a.id} className={radioCard(chosenId === a.id)}>
                              <input
                                type="radio"
                                name="address"
                                checked={chosenId === a.id}
                                onChange={() => setAddressId(a.id)}
                                className="mt-1"
                              />
                              <span>
                                <span className="font-semibold">
                                  {a.label}
                                  {a.isDefault ? " (default)" : ""}
                                </span>
                                <br />
                                {a.recipientName} · {a.phone}
                                <br />
                                <span className="text-muted-foreground">
                                  {a.street}, {a.town}, {a.county}
                                </span>
                              </span>
                            </label>
                          ))}
                          <Link to="/account" search={{}} className="text-sm font-semibold text-primary">
                            Manage addresses
                          </Link>
                        </div>
                      )}
                      {needsQuote && (
                        <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                          Delivery to {selected?.county} is quoted by us. After you order, we will
                          contact you with the delivery fee before anything is sent.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Payment */}
                <div className="card-surface p-6">
                  <h2 className="text-lg font-semibold">2. How do you want to pay?</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className={radioCard(pay === "mpesa", !mpesaAllowed)}>
                      <input
                        type="radio"
                        name="payment"
                        disabled={!mpesaAllowed}
                        checked={pay === "mpesa"}
                        onChange={() => setPayment("mpesa")}
                        className="mt-1"
                      />
                      <span>
                        <span className="flex items-center gap-2 font-semibold">
                          <Smartphone className="h-4 w-4" /> M-Pesa now
                        </span>
                        <span className="text-muted-foreground">
                          {MPESA_ENABLED
                            ? needsQuote
                              ? "Not available until the delivery fee is quoted."
                              : "A payment prompt is sent to your phone."
                            : "Coming soon."}
                        </span>
                      </span>
                    </label>
                    <label className={radioCard(pay === "cod")}>
                      <input
                        type="radio"
                        name="payment"
                        checked={pay === "cod"}
                        onChange={() => setPayment("cod")}
                        className="mt-1"
                      />
                      <span>
                        <span className="flex items-center gap-2 font-semibold">
                          <Banknote className="h-4 w-4" /> Pay on {fulfilment === "pickup" ? "pickup" : "delivery"}
                        </span>
                        <span className="text-muted-foreground">
                          Pay in cash or M-Pesa when you receive your order.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* 3. Notes */}
                <div className="card-surface p-6">
                  <label htmlFor="order-notes" className="text-lg font-semibold">
                    3. Anything we should know? <span className="text-sm font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    id="order-notes"
                    rows={3}
                    maxLength={300}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Please call before delivering"
                    className="mt-3 w-full rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Summary */}
              <aside className="card-surface p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold">Order summary</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-3">
                      <span className="min-w-0">
                        {i.qty} × <span className="line-clamp-1 inline">{i.name}</span>
                      </span>
                      <span className="shrink-0 font-medium">{formatPrice(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="font-medium">
                      {fulfilment === "pickup"
                        ? "Free"
                        : needsQuote
                          ? "To be quoted"
                          : selected
                            ? formatPrice(fee)
                            : "Choose an address"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Prices are confirmed when you place the order.
                </p>

                {error && (
                  <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="btn-primary mt-5 w-full justify-center disabled:opacity-60 cursor-pointer"
                >
                  {busy ? "Placing order..." : "Place order"}
                </button>
                <Link
                  to="/cart"
                  className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary"
                >
                  Back to cart
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}