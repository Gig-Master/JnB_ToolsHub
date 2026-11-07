import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { randomInt } from "node:crypto";
import { db } from "@/db";
import {
  products,
  productImages,
  customerAddresses,
  orders,
  orderItems,
} from "@/db/schema";
import { getSessionCustomer } from "@/lib/customer-auth.server";
import { hitRateLimit } from "@/lib/rate-limit.server";
import { sendOwnerOrderEmail } from "@/lib/order-email.server";
import { DELIVERY } from "@/data/business";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_LINES = 30;
const MAX_QTY = 99;

type CheckoutInput = {
  items: { productId: string; quantity: number }[];
  fulfilment: "delivery" | "pickup";
  paymentMethod: "mpesa" | "cod";
  addressId: string | null;
  notes: string;
};

function parseCheckout(d: unknown): CheckoutInput {
  const bad = () => new Error("Invalid order request.");
  if (!d || typeof d !== "object") throw bad();
  const x = d as Record<string, unknown>;

  if (!Array.isArray(x.items) || x.items.length < 1 || x.items.length > MAX_LINES) throw bad();

  // Merge duplicate products so quantities can't be split to dodge limits
  const merged = new Map<string, number>();
  for (const it of x.items) {
    const r = it as Record<string, unknown>;
    const id = String(r?.productId ?? "");
    const q = Number(r?.quantity);
    if (!UUID.test(id) || !Number.isInteger(q) || q < 1 || q > MAX_QTY) throw bad();
    merged.set(id, Math.min(MAX_QTY, (merged.get(id) ?? 0) + q));
  }

  if (x.fulfilment !== "delivery" && x.fulfilment !== "pickup") throw bad();
  if (x.paymentMethod !== "mpesa" && x.paymentMethod !== "cod") throw bad();

  const addressId = x.addressId == null || x.addressId === "" ? null : String(x.addressId);
  if (addressId !== null && !UUID.test(addressId)) throw bad();

  const notes = String(x.notes ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, 300);

  return {
    items: [...merged].map(([productId, quantity]) => ({ productId, quantity })),
    fulfilment: x.fulfilment,
    paymentMethod: x.paymentMethod,
    addressId,
    notes,
  };
}

function makeOrderNumber(): string {
  const d = new Date();
  const yy = String(d.getUTCFullYear()).slice(2);
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `JNB-${yy}${mm}${dd}-${randomInt(1000, 10000)}`;
}

export const placeOrder = createServerFn({ method: "POST" })
  .validator(parseCheckout)
  .handler(async ({ data }) => {
    // 1. Must be logged in
    const me = await getSessionCustomer();
    if (!me) return { ok: false as const, error: "Please log in to place an order." };

    // 2. Limit order spam: 10 per hour per customer
    const { allowed } = await hitRateLimit(`checkout:${me.id}`, 10, 60 * 60);
    if (!allowed) {
      return { ok: false as const, error: "Too many orders. Please try again later." };
    }

    // 3. Re-read products from the DATABASE. Cart prices are never trusted.
    const ids = data.items.map((i) => i.productId);
    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        inStock: products.inStock,
      })
      .from(products)
      .where(inArray(products.id, ids));
    const byId = new Map(rows.map((r) => [r.id, r]));

    const problems: string[] = [];
    for (const it of data.items) {
      const p = byId.get(it.productId);
      if (!p) problems.push("An item in your cart is no longer available");
      else if (!p.inStock) problems.push(`${p.name} is out of stock`);
      else if (p.price <= 0) problems.push(`${p.name} has no online price: please WhatsApp us`);
    }
    if (problems.length) {
      return { ok: false as const, error: [...new Set(problems)].join(". ") + "." };
    }

    // Primary image per product, for the order snapshot
    const imgRows = await db
      .select({ productId: productImages.productId, url: productImages.url })
      .from(productImages)
      .where(inArray(productImages.productId, ids))
      .orderBy(desc(productImages.isPrimary), asc(productImages.sortOrder));
    const imageFor = new Map<string, string>();
    for (const r of imgRows) if (!imageFor.has(r.productId)) imageFor.set(r.productId, r.url);

    const lines = data.items.map((it) => {
      const p = byId.get(it.productId)!;
      return {
        productId: p.id,
        name: p.name,
        unitPrice: p.price,
        quantity: it.quantity,
        imageUrl: imageFor.get(p.id) ?? null,
      };
    });
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

    // 4. Where is it going? Address comes from the DB and must belong to this customer.
    let recipientName = me.name;
    let phone = me.phone ?? "";
    let county: string | null = null;
    let town: string | null = null;
    let street: string | null = null;
    let landmark: string | null = null;

    if (data.fulfilment === "delivery") {
      if (!data.addressId) {
        return { ok: false as const, error: "Please choose a delivery address." };
      }
      const [addr] = await db
        .select()
        .from(customerAddresses)
        .where(
          and(
            eq(customerAddresses.id, data.addressId),
            eq(customerAddresses.customerId, me.id),
          ),
        )
        .limit(1);
      if (!addr) return { ok: false as const, error: "Delivery address not found." };
      recipientName = addr.recipientName;
      phone = addr.phone;
      county = addr.county;
      town = addr.town;
      street = addr.street;
      landmark = addr.landmark;
    } else if (!phone) {
      return {
        ok: false as const,
        error: "Please add a phone number to your account (or choose delivery with an address).",
      };
    }

    // 5. Delivery fee: flat inside Nairobi, quoted elsewhere
    const flat = (DELIVERY.flatFeeCounties as readonly string[]).includes(county ?? "");
    const deliveryNeedsQuote = data.fulfilment === "delivery" && !flat;
    const deliveryFee = data.fulfilment === "delivery" && flat ? DELIVERY.nairobiFee : 0;

    if (deliveryNeedsQuote && data.paymentMethod === "mpesa") {
      return {
        ok: false as const,
        error:
          "Delivery outside Nairobi is quoted by us first. Choose pay on delivery or pickup, or WhatsApp us.",
      };
    }
    const total = subtotal + deliveryFee;

    // 6. Save the order and its lines in ONE transaction (all or nothing)
    let created: { id: string; orderNumber: string } | null = null;
    for (let attempt = 0; attempt < 4 && !created; attempt++) {
      try {
        created = await db.transaction(async (tx) => {
          const [o] = await tx
            .insert(orders)
            .values({
              orderNumber: makeOrderNumber(),
              customerId: me.id,
              status: "pending",
              paymentMethod: data.paymentMethod,
              paymentStatus: "unpaid",
              fulfilment: data.fulfilment,
              subtotal,
              deliveryFee,
              total,
              recipientName,
              phone,
              county,
              town,
              street,
              landmark,
              notes: data.notes || null,
            })
            .returning({ id: orders.id, orderNumber: orders.orderNumber });
          await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: o.id })));
          return o;
        });
      } catch (err: any) {
        const code = err?.code ?? err?.cause?.code;
        if (code === "23505") continue; // order-number collision: try a new number
        console.error("[placeOrder] failed", err);
        return { ok: false as const, error: "Could not place your order. Please try again." };
      }
    }
    if (!created) {
      return { ok: false as const, error: "Could not place your order. Please try again." };
    }

    // 7. Alert the owner (never blocks or fails the order)
    await sendOwnerOrderEmail({
      orderNumber: created.orderNumber,
      customerName: recipientName,
      customerEmail: me.email,
      phone,
      fulfilment: data.fulfilment,
      paymentMethod: data.paymentMethod,
      county,
      town,
      street,
      landmark,
      notes: data.notes || null,
      subtotal,
      deliveryFee,
      total,
      deliveryNeedsQuote,
      lines,
    });

    return {
      ok: true as const,
      orderNumber: created.orderNumber,
      total,
      deliveryNeedsQuote,
    };
  });