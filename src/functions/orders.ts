import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { requireCustomer } from "@/lib/customer-auth.server";

export interface OrderDTO {
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
  items: { name: string; unitPrice: number; quantity: number; imageUrl: string | null }[];
}

export const getMyOrder = createServerFn({ method: "GET" })
  .validator((d: { orderNumber: string }) => d)
  .handler(async ({ data }): Promise<OrderDTO | null> => {
    const me = await requireCustomer();

    const num = String(data.orderNumber ?? "").toUpperCase();
    if (!/^JNB-\d{6}-\d{4}$/.test(num)) return null;

    // Filtering on customerId means nobody can open someone else's order
    const [o] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.orderNumber, num), eq(orders.customerId, me.id)))
      .limit(1);
    if (!o) return null;

    const items = await db
      .select({
        name: orderItems.name,
        unitPrice: orderItems.unitPrice,
        quantity: orderItems.quantity,
        imageUrl: orderItems.imageUrl,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, o.id));

    return {
      orderNumber: o.orderNumber,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      fulfilment: o.fulfilment,
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      total: o.total,
      recipientName: o.recipientName,
      phone: o.phone,
      county: o.county,
      town: o.town,
      street: o.street,
      landmark: o.landmark,
      notes: o.notes,
      createdAt: o.createdAt.toISOString(),
      items,
    };
  });

  export interface OrderSummaryDTO {
  orderNumber: string;
  status: string;
  fulfilment: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
}

export const listMyOrders = createServerFn({ method: "GET" }).handler(
  async (): Promise<OrderSummaryDTO[]> => {
    const me = await requireCustomer();
    const rows = await db
      .select({
        orderNumber: orders.orderNumber,
        status: orders.status,
        fulfilment: orders.fulfilment,
        paymentMethod: orders.paymentMethod,
        paymentStatus: orders.paymentStatus,
        total: orders.total,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(eq(orders.customerId, me.id))
      .orderBy(desc(orders.createdAt))
      .limit(20);
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  },
);