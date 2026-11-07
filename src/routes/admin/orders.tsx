import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  listOrdersAdmin,
  updateOrderStatus,
  setOrderPaid,
  setOrderDeliveryFee,
  type AdminOrderDTO,
} from "@/functions/admin-orders";
import { ORDER_STATUSES, statusBadge, statusLabel, paymentLabel } from "@/lib/order-status";
import { formatPrice } from "@/lib/utils";
import { DELIVERY } from "@/data/business";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

const FILTERS = ["all", ...ORDER_STATUSES] as const;

function AdminOrdersPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["admin-orders", filter],
    queryFn: () => listOrdersAdmin({ data: { status: filter === "all" ? undefined : filter } }),
    refetchInterval: 60_000, // pick up new orders automatically
  });

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
      <p className="text-slate-500">New orders appear here and by email. This list refreshes every minute.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold cursor-pointer ${
              filter === f ? "bg-[#102A43] text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            {f === "all" ? "All" : statusLabel(f)}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading && <p>Loading orders...</p>}
        {isError && <p className="text-red-600">Could not load orders. Please refresh.</p>}
        {!isLoading && !isError && orders.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No orders here yet.
          </p>
        )}
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order: o }: { order: AdminOrderDTO }) {
  const queryClient = useQueryClient();
  const [fee, setFee] = useState(String(o.deliveryFee));
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  const failed = () => alert("Could not update this order. Please refresh and try again.");

  const status = useMutation({
    mutationFn: (s: string) => updateOrderStatus({ data: { id: o.id, status: s } }),
    onSuccess: (r) => (r.ok ? refresh() : failed()),
    onError: failed,
  });
  const paid = useMutation({
    mutationFn: (p: boolean) => setOrderPaid({ data: { id: o.id, paid: p } }),
    onSuccess: (r) => (r.ok ? refresh() : failed()),
    onError: failed,
  });
  const feeMut = useMutation({
    mutationFn: (n: number) => setOrderDeliveryFee({ data: { id: o.id, fee: n } }),
    onSuccess: (r) => (r.ok ? refresh() : failed()),
    onError: failed,
  });

  const isPaid = o.paymentStatus === "paid";
  const needsQuote =
    o.fulfilment === "delivery" &&
    o.deliveryFee === 0 &&
    !(DELIVERY.flatFeeCounties as readonly string[]).includes(o.county ?? "");

  const wa = `https://wa.me/${o.phone}?text=${encodeURIComponent(
    `Hello ${o.recipientName}, this is JnB Power Tools about your order ${o.orderNumber}.`,
  )}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-slate-900">{o.orderNumber}</p>
          <p className="text-xs text-slate-500">
            {new Date(o.createdAt).toLocaleString("en-KE", {
              timeZone: "Africa/Nairobi",
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(o.status)}`}>
          {statusLabel(o.status, o.fulfilment)}
        </span>
      </div>

      <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
        <div>
          <p className="font-semibold text-slate-900">{o.recipientName}</p>
          <p className="text-slate-600">{o.phone}</p>
          <p className="break-all text-slate-600">{o.customerEmail}</p>
          <p className="mt-2 text-slate-700">
            {o.fulfilment === "pickup" ? (
              <b>Pickup at the shop</b>
            ) : (
              <>
                <b>Delivery:</b> {o.street}, {o.town}, {o.county}
                {o.landmark ? ` (${o.landmark})` : ""}
              </>
            )}
          </p>
          {o.notes && <p className="mt-1 text-slate-600">Customer note: {o.notes}</p>}
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-700"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp customer
          </a>
        </div>

        <div>
          <ul className="space-y-1 text-slate-700">
            {o.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-3">
                <span>
                  {i.quantity} × {i.name}
                </span>
                <span>{formatPrice(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
            <p className="flex justify-between text-slate-600">
              <span>Subtotal</span> <span>{formatPrice(o.subtotal)}</span>
            </p>
            <p className="flex justify-between text-slate-600">
              <span>Delivery</span>
              <span>{needsQuote ? "To be quoted" : formatPrice(o.deliveryFee)}</span>
            </p>
            <p className="flex justify-between font-bold text-slate-900">
              <span>Total</span> <span>{formatPrice(o.total)}</span>
            </p>
          </div>
        </div>
      </div>

      {needsQuote && (
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Delivery outside Nairobi: quote the customer, then enter the fee below.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-end gap-4 border-t border-slate-100 pt-4 text-sm">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Status</label>
          <select
            value={o.status}
            disabled={status.isPending}
            onChange={(e) => {
              const next = e.target.value;
              if (next === "cancelled" && !confirm(`Cancel order ${o.orderNumber}?`)) return;
              status.mutate(next);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s, o.fulfilment)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            {paymentLabel(o.paymentMethod, o.paymentStatus)}
          </label>
          <button
            type="button"
            disabled={paid.isPending}
            onClick={() => paid.mutate(!isPaid)}
            className="rounded-lg border border-slate-200 px-3 py-2 font-semibold cursor-pointer hover:bg-slate-50"
          >
            {isPaid ? "Mark as unpaid" : "Mark as paid"}
          </button>
        </div>

        {o.fulfilment === "delivery" && !isPaid && (
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const n = Number(fee);
              if (!Number.isInteger(n) || n < 0) return alert("Enter the fee in whole shillings.");
              feeMut.mutate(n);
            }}
          >
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Delivery fee (KSh)
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-28 rounded-lg border border-slate-200 px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={feeMut.isPending}
              className="rounded-lg bg-[#102A43] px-3 py-2 font-semibold text-white cursor-pointer"
            >
              Save fee
            </button>
          </form>
        )}
      </div>
    </div>
  );
}