import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { getMe } from "@/functions/customer";
import { getMyOrder } from "@/functions/orders";
import { formatPrice } from "@/lib/utils";
import { DELIVERY, whatsappHref } from "@/data/business";

export const Route = createFileRoute("/order/$orderNumber")({
  beforeLoad: async ({ params }) => {
    const user = await getMe();
    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: `/order/${params.orderNumber}` },
      });
    }
  },
  loader: async ({ params }) => {
    const order = await getMyOrder({ data: { orderNumber: params.orderNumber } });
    if (!order) throw notFound();
    return order;
  },
  head: () => ({
    meta: [
      { title: "Order received — JnB Power Tools & Digital Electronics" },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <div className="container-x py-24 text-center">
      <h1 className="text-2xl font-bold">Order not found</h1>
      <p className="mt-2 text-muted-foreground">
        We could not find that order on your account.
      </p>
      <Link to="/products" search={{}} className="btn-primary mt-6 inline-flex">
        Continue shopping
      </Link>
    </div>
  ),
  component: OrderPage,
});

function OrderPage() {
  const order = Route.useLoaderData();

  const needsQuote =
    order.fulfilment === "delivery" &&
    !(DELIVERY.flatFeeCounties as readonly string[]).includes(order.county ?? "");

  const waMessage = `Hello JnB, I just placed order ${order.orderNumber}. Please confirm.`;

  return (
    <>
      <section className="bg-secondary text-white py-12">
        <div className="container-x">
          <h1 className="flex items-center gap-3 text-3xl md:text-4xl font-bold">
            <CheckCircle2 className="h-8 w-8 text-green-400" /> Order received
          </h1>
          <p className="mt-2 text-white/70">
            Order number: <span className="font-semibold text-white">{order.orderNumber}</span>
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container-x max-w-2xl space-y-6">
          <div className="card-surface p-6 text-sm">
            <p>
              Thank you, {order.recipientName}. We have received your order and will contact you
              on <b>{order.phone}</b> to confirm.
            </p>
            {needsQuote && (
              <p className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-800">
                Delivery to {order.county} is quoted by us. We will tell you the delivery fee
                before anything is sent.
              </p>
            )}
            <p className="mt-4 text-muted-foreground">
              Payment:{" "}
              {order.paymentMethod === "mpesa"
                ? "M-Pesa"
                : `Pay on ${order.fulfilment === "pickup" ? "pickup" : "delivery"}`}
              {" · "}
              {order.fulfilment === "pickup"
                ? "Pickup at our shop"
                : `Deliver to ${order.street}, ${order.town}, ${order.county}`}
            </p>
          </div>

          <div className="card-surface p-6">
            <h2 className="text-lg font-semibold">Items</h2>
            <ul className="mt-4 space-y-3">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {i.imageUrl && (
                      <img src={i.imageUrl} alt={i.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <span className="min-w-0 flex-1">
                    {i.quantity} × {i.name}
                  </span>
                  <span className="font-medium">{formatPrice(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>
                  {order.fulfilment === "pickup"
                    ? "Free"
                    : needsQuote
                      ? "To be quoted"
                      : formatPrice(order.deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <dt>Total</dt>
                <dd className="text-primary">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappHref(waMessage)}
              target="_blank"
              rel="noreferrer"
              className="btn-accent"
            >
              <MessageCircle className="h-5 w-5" /> Message us on WhatsApp
            </a>
            <Link to="/products" search={{}} className="btn-primary">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}