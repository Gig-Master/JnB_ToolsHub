import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { customerAddresses } from "@/db/schema";
import { requireCustomer } from "@/lib/customer-auth.server";
import { normalizeKenyanPhone } from "@/lib/phone";
import { KENYA_COUNTIES } from "@/data/kenya";

const MAX_ADDRESSES = 5;

export interface AddressDTO {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  county: string;
  town: string;
  street: string;
  landmark: string | null;
  isDefault: boolean;
}

export interface AddressInput {
  id?: string;
  label: string;
  recipientName: string;
  phone: string;
  county: string;
  town: string;
  street: string;
  landmark?: string;
  isDefault?: boolean;
}

const addressSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().min(1, "Give this address a label, e.g. Home").max(30),
  recipientName: z.string().trim().min(2, "Enter the recipient's name").max(80),
  phone: z.string().trim().min(1, "Enter a phone number").max(20),
  county: z.enum(KENYA_COUNTIES, { errorMap: () => ({ message: "Choose a county" }) }),
  town: z.string().trim().min(2, "Enter the town or area").max(80),
  street: z.string().trim().min(3, "Enter the street, building or house details").max(160),
  landmark: z.string().trim().max(200).optional(),
  isDefault: z.boolean().optional(),
});

const addressColumns = {
  id: customerAddresses.id,
  label: customerAddresses.label,
  recipientName: customerAddresses.recipientName,
  phone: customerAddresses.phone,
  county: customerAddresses.county,
  town: customerAddresses.town,
  street: customerAddresses.street,
  landmark: customerAddresses.landmark,
  isDefault: customerAddresses.isDefault,
};

/* ── List my addresses ── */
export const listMyAddresses = createServerFn({ method: "GET" }).handler(
  async (): Promise<AddressDTO[]> => {
    const me = await requireCustomer();
    return db
      .select(addressColumns)
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, me.id))
      .orderBy(desc(customerAddresses.isDefault), desc(customerAddresses.createdAt));
  },
);

/* ── Create or update ── */
export const saveAddress = createServerFn({ method: "POST" })
  .validator((d: AddressInput) => d)
  .handler(async ({ data }) => {
    const me = await requireCustomer();

    const parsed = addressSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid address" };
    }
    const a = parsed.data;

    const phone = normalizeKenyanPhone(a.phone);
    if (!phone) {
      return {
        ok: false as const,
        error: "Enter a valid Kenyan phone number, e.g. 0712345678",
      };
    }

    return db.transaction(async (tx) => {
      const existing = await tx
        .select({ id: customerAddresses.id })
        .from(customerAddresses)
        .where(eq(customerAddresses.customerId, me.id));

      if (!a.id && existing.length >= MAX_ADDRESSES) {
        return {
          ok: false as const,
          error: `You can save up to ${MAX_ADDRESSES} addresses. Delete one to add another.`,
        };
      }
      if (a.id && !existing.some((e) => e.id === a.id)) {
        return { ok: false as const, error: "Address not found." };
      }

      // The first address is always the default
      const makeDefault = a.isDefault === true || existing.length === 0;
      if (makeDefault) {
        await tx
          .update(customerAddresses)
          .set({ isDefault: false })
          .where(eq(customerAddresses.customerId, me.id));
      }

      const values = {
        label: a.label,
        recipientName: a.recipientName,
        phone,
        county: a.county,
        town: a.town,
        street: a.street,
        landmark: a.landmark || null,
      };

      if (a.id) {
        await tx
          .update(customerAddresses)
          .set({ ...values, ...(makeDefault ? { isDefault: true } : {}), updatedAt: new Date() })
          .where(and(eq(customerAddresses.id, a.id), eq(customerAddresses.customerId, me.id)));
      } else {
        await tx
          .insert(customerAddresses)
          .values({ ...values, customerId: me.id, isDefault: makeDefault });
      }

      return { ok: true as const };
    });
  });

/* ── Delete ── */
export const deleteAddress = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const me = await requireCustomer();
    const id = z.string().uuid().safeParse(data.id);
    if (!id.success) return { ok: false as const, error: "Address not found." };

    return db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(customerAddresses)
        .where(and(eq(customerAddresses.id, id.data), eq(customerAddresses.customerId, me.id)))
        .returning({ wasDefault: customerAddresses.isDefault });

      if (!deleted) return { ok: false as const, error: "Address not found." };

      // If the default was deleted, promote the newest remaining address
      if (deleted.wasDefault) {
        const [next] = await tx
          .select({ id: customerAddresses.id })
          .from(customerAddresses)
          .where(eq(customerAddresses.customerId, me.id))
          .orderBy(desc(customerAddresses.createdAt))
          .limit(1);
        if (next) {
          await tx
            .update(customerAddresses)
            .set({ isDefault: true })
            .where(eq(customerAddresses.id, next.id));
        }
      }
      return { ok: true as const };
    });
  });

/* ── Make default ── */
export const setDefaultAddress = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const me = await requireCustomer();
    const id = z.string().uuid().safeParse(data.id);
    if (!id.success) return { ok: false as const, error: "Address not found." };

    return db.transaction(async (tx) => {
      const [target] = await tx
        .select({ id: customerAddresses.id })
        .from(customerAddresses)
        .where(and(eq(customerAddresses.id, id.data), eq(customerAddresses.customerId, me.id)));
      if (!target) return { ok: false as const, error: "Address not found." };

      await tx
        .update(customerAddresses)
        .set({ isDefault: false })
        .where(eq(customerAddresses.customerId, me.id));
      await tx
        .update(customerAddresses)
        .set({ isDefault: true })
        .where(eq(customerAddresses.id, target.id));
      return { ok: true as const };
    });
  });