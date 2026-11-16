import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth.server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const bad = () => new Error("Invalid request.");

export interface AdminMessageDTO {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  handledAt: string | null;
}

export const listMessagesAdmin = createServerFn({ method: "GET" })
  .validator((d: { status?: string } | undefined) => ({
    status: d?.status === "new" || d?.status === "handled" ? d.status : undefined,
  }))
  .handler(async ({ data }): Promise<AdminMessageDTO[]> => {
    await requireAdmin();
    const rows = await db
      .select()
      .from(contactMessages)
      .where(data.status ? eq(contactMessages.status, data.status) : undefined)
      .orderBy(desc(contactMessages.createdAt))
      .limit(200);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      subject: r.subject,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      handledAt: r.handledAt ? r.handledAt.toISOString() : null,
    }));
  });

export const setMessageHandled = createServerFn({ method: "POST" })
  .validator((d: { id: string; handled: boolean }) => {
    if (!UUID.test(String(d?.id)) || typeof d?.handled !== "boolean") throw bad();
    return { id: d.id, handled: d.handled };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const done = await db
      .update(contactMessages)
      .set({
        status: data.handled ? "handled" : "new",
        handledAt: data.handled ? new Date() : null,
      })
      .where(eq(contactMessages.id, data.id))
      .returning({ id: contactMessages.id });
    return { ok: done.length > 0 };
  });

export const deleteMessageAdmin = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => {
    if (!UUID.test(String(d?.id))) throw bad();
    return { id: d.id };
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const done = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, data.id))
      .returning({ id: contactMessages.id });
    return { ok: done.length > 0 };
  });