// Server-only: sends the "new order" alert to the shop owner.
// Never throws: a failed email must not fail a paid/placed order.

type OrderEmailLine = { name: string; quantity: number; unitPrice: number };

export type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  fulfilment: "delivery" | "pickup";
  paymentMethod: "mpesa" | "cod";
  county: string | null;
  town: string | null;
  street: string | null;
  landmark: string | null;
  notes: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryNeedsQuote: boolean;
  lines: OrderEmailLine[];
};

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const ksh = (n: number) => `KSh ${n.toLocaleString("en-KE")}`;

export async function sendOwnerOrderEmail(o: OrderEmailData): Promise<void> {
  try {
    const key = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const to = process.env.ORDER_ALERT_EMAIL;
    if (!key || !from || !to) {
      console.error("[order-email] RESEND_API_KEY, EMAIL_FROM or ORDER_ALERT_EMAIL missing");
      return;
    }

    const rows = o.lines
      .map(
        (l) =>
          `<tr><td style="padding:4px 8px">${esc(l.name)}</td>` +
          `<td style="padding:4px 8px;text-align:center">${l.quantity}</td>` +
          `<td style="padding:4px 8px;text-align:right">${ksh(l.unitPrice * l.quantity)}</td></tr>`,
      )
      .join("");

    const where =
      o.fulfilment === "pickup"
        ? "<b>PICKUP</b> at the shop"
        : `<b>DELIVERY</b><br>${esc(o.street)}, ${esc(o.town)}, ${esc(o.county)}` +
          (o.landmark ? `<br>Landmark: ${esc(o.landmark)}` : "");

    const html = `
<div style="font-family:Arial,sans-serif;max-width:560px">
  <h2>New order ${esc(o.orderNumber)}</h2>
  <p><b>${esc(o.customerName)}</b><br>${esc(o.customerEmail)}<br>Phone: ${esc(o.phone)}</p>
  <p>${where}</p>
  <p>Payment: <b>${o.paymentMethod === "mpesa" ? "M-Pesa" : "Pay on delivery / pickup"}</b></p>
  ${o.deliveryNeedsQuote ? '<p style="color:#b45309"><b>Delivery is outside Nairobi: quote the delivery fee to the customer.</b></p>' : ""}
  <table style="border-collapse:collapse;width:100%">${rows}</table>
  <p style="text-align:right">Subtotal: ${ksh(o.subtotal)}<br>
  Delivery: ${o.deliveryNeedsQuote ? "to be quoted" : ksh(o.deliveryFee)}<br>
  <b>Total: ${ksh(o.total)}</b></p>
  ${o.notes ? `<p>Customer note: ${esc(o.notes)}</p>` : ""}
</div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New order ${o.orderNumber} (${ksh(o.total)})`,
        html,
      }),
    });
    if (!res.ok) console.error("[order-email] Resend responded", res.status);
  } catch (err) {
    console.error("[order-email] failed", err);
  }
}