import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, customers } from "@/db/schema";
import { requireAdmin } from "@/lib/auth.server";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/order-status";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const bad = () => new Error("Invalid request.");

export interface AdminOrderDTO {
  id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  fulfilment: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  recipientName: string;
  phone: string;
  county: string | null;
  town: string | null;
  street: string | null;
  landmark: string | null;
  notes: string | null;
  createdAt: string;
  customerEmail: string;
  items: { name: string; unitPrice: number; quantity: number }[];
}

/* ── List (newest first, optional status filter) ── */
export const listOrdersAdmin = createServerFn({ method: "GET" })
  .validator((d: { status?: string } | undefined) => ({
    status: ORDER_STATUSES.includes(d?.status as OrderStatus)
      ? (d!.status as OrderStatus)
      : undefined,
  }))
  .handler(async ({ data }): Promise<AdminOrderDTO[]> => {
    await requireAdmin();

    const rows = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        fulfilment: orders.fulfilment,
        subtotal: orders.subtotal,
        deliveryFee: orders.deliveryFee,
        total: orders.total,
        recipientName: orders.recipientName,
        phone: orders.phone,
        county: orders.county,
        town: orders.town,
        street: orders.street,
        landmark: orders.landmark,
        notes: orders.notes,
        createdAt: orders.createdAt,
        customerEmail: customers.email,
      })
      .from(orders)
      .innerJoin(customers, eq(customers.id, orders.customerId))
      .where(data.status ? eq(orders.status, data.status) : undefined)
      .orderBy(desc(orders.createdAt))
      .limit(100);

    if (rows.length === 0) return [];

    const lines = await db
      .select({
        orderId: orderItems.orderId,
        name: orderItems.name,
        unitPrice: orderItems.unitPrice,
        quantity: orderItems.quantity,
      })
      .from(orderItems)
      .where(inArray(orderItems.orderId, rows.map((r) => r.id)));

    return rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      items: lines
        .filter((l) => l.orderId === r.id)
        .map(({ name, unitPrice, quantity }) => ({ name, unitPrice, quantity })),
    }));
  });

/* ── Change order status ── */
export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator((d: { id: string; status: string }) => {
    if (!UUID.test(String(d?.id)) || !ORDER_STATUSES.includes(d?.status as OrderStatus)) {
      throw bad();
    }
    return { id: d.id, status: d.status as OrderStatus };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const done = await db
      .update(orders)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(orders.id, data.id))
      .returning({ id: orders.id });
    return { ok: done.length > 0 };
  });

/* ── Mark paid / unpaid (e.g. cash received on delivery) ── */
export const setOrderPaid = createServerFn({ method: "POST" })
  .validator((d: { id: string; paid: boolean }) => {
    if (!UUID.test(String(d?.id)) || typeof d?.paid !== "boolean") throw bad();
    return { id: d.id, paid: d.paid };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const done = await db
      .update(orders)
      .set({ paymentStatus: data.paid ? "paid" : "unpaid", updatedAt: new Date() })
      .where(eq(orders.id, data.id))
      .returning({ id: orders.id });
    return { ok: done.length > 0 };
  });

/* ── Set the delivery fee you quoted (delivery orders that are not yet paid) ── */
export const setOrderDeliveryFee = createServerFn({ method: "POST" })
  .validator((d: { id: string; fee: number }) => {
    const fee = Number(d?.fee);
    if (!UUID.test(String(d?.id)) || !Number.isInteger(fee) || fee < 0 || fee > 100000) {
      throw bad();
    }
    return { id: d.id, fee };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const done = await db
      .update(orders)
      .set({
        deliveryFee: data.fee,
        total: sql`${orders.subtotal} + ${data.fee}`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(orders.id, data.id),
          eq(orders.fulfilment, "delivery"),
          ne(orders.paymentStatus, "paid"),
        ),
      )
      .returning({ id: orders.id });
    return { ok: done.length > 0 };
  });