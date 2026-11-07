export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Human label. For pickup orders, "out_for_delivery" reads "Ready for pickup". */
export function statusLabel(status: string, fulfilment?: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "out_for_delivery":
      return fulfilment === "pickup" ? "Ready for pickup" : "Out for delivery";
    case "delivered":
      return fulfilment === "pickup" ? "Collected" : "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function statusBadge(status: string): string {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "out_for_delivery":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function paymentLabel(method: string, status: string): string {
  const how = method === "mpesa" ? "M-Pesa" : "Pay on delivery/pickup";
  const state = status === "paid" ? "Paid" : status === "failed" ? "Payment failed" : "Unpaid";
  return `${how} · ${state}`;
}