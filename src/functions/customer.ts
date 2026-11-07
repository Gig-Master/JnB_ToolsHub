import { createServerFn } from "@tanstack/react-start";
import { setCookie, deleteCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { hashPassword, verifyPasswordHash, fakeVerify } from "@/lib/password.server";
import {
  CUSTOMER_COOKIE,
  CUSTOMER_MAX_AGE,
  createCustomerToken,
  getSessionCustomer,
} from "@/lib/customer-auth.server";
import { normalizeKenyanPhone } from "@/lib/phone";
import { passwordPolicyError } from "@/lib/password-strength";
import { getClientIp, hitRateLimit } from "@/lib/rate-limit.server"; // NEW

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;

const signupSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(254),
  phone: z.string().trim().max(20).optional(),
  password: z
    .string()
    .max(128, "Password is too long")
    .superRefine((value, ctx) => {
      const message = passwordPolicyError(value);
      if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    }),
});

async function startSession(customerId: string) {
  const token = await createCustomerToken(customerId);
  setCookie(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_MAX_AGE,
  });
}

/* ── Sign up ── */
export const signupCustomer = createServerFn({ method: "POST" })
  .validator((d: { name: string; email: string; phone?: string; password: string }) => d)
  .handler(async ({ data }) => {
    // NEW: max 10 sign-ups per hour from one connection
    const ip = getClientIp();
    if (!(await hitRateLimit(`signup:${ip}`, 10, 60 * 60)).allowed) {
      return { ok: false as const, error: "Too many sign-up attempts. Please try again later." };
    }

    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) {
      return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid details" };
    }
    const { name, email, password } = parsed.data;

    let phone: string | null = null;
    if (parsed.data.phone) {
      phone = normalizeKenyanPhone(parsed.data.phone);
      if (!phone) {
        return {
          ok: false as const,
          error: "Please enter a valid Kenyan phone number, e.g. 0712345678",
        };
      }
    }

    const existing = await db.query.customers.findFirst({
      where: eq(customers.email, email),
      columns: { id: true },
    });
    if (existing) {
      return {
        ok: false as const,
        error: "An account with this email already exists. Try logging in.",
      };
    }

    const passwordHash = await hashPassword(password);
    const [created] = await db
      .insert(customers)
      .values({ name, email, phone, passwordHash })
      .returning({ id: customers.id });

    await startSession(created.id);
    return { ok: true as const };
  });

/* ── Log in ── */
export const loginCustomer = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    // NEW: max 20 login attempts per 15 minutes from one connection
    const ip = getClientIp();
    if (!(await hitRateLimit(`login:${ip}`, 20, 15 * 60)).allowed) {
      return {
        ok: false as const,
        error: "Too many attempts from your connection. Please try again in 15 minutes.",
      };
    }

    const email = String(data.email ?? "").trim().toLowerCase();
    const password = String(data.password ?? "").slice(0, 128);
    const wrong = { ok: false as const, error: "Incorrect email or password." };

    const customer = await db.query.customers.findFirst({ where: eq(customers.email, email) });
    if (!customer) {
      await fakeVerify(password);
      return wrong;
    }

    if (customer.lockedUntil && customer.lockedUntil > new Date()) {
      return {
        ok: false as const,
        error: `Too many failed attempts. Please try again in ${LOCK_MINUTES} minutes.`,
      };
    }

    const valid = await verifyPasswordHash(password, customer.passwordHash);
    if (!valid) {
      const failed = customer.failedLogins + 1;
      const lock = failed >= MAX_FAILED;
      await db
        .update(customers)
        .set({
          failedLogins: lock ? 0 : failed,
          lockedUntil: lock ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null,
        })
        .where(eq(customers.id, customer.id));
      return wrong;
    }

    if (customer.failedLogins > 0 || customer.lockedUntil) {
      await db
        .update(customers)
        .set({ failedLogins: 0, lockedUntil: null })
        .where(eq(customers.id, customer.id));
    }

    await startSession(customer.id);
    return { ok: true as const };
  });

/* ── Log out ── */
export const logoutCustomer = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(CUSTOMER_COOKIE, { path: "/" });
  return { ok: true as const };
});

/* ── Who am I? (null when logged out) ── */
export const getMe = createServerFn({ method: "GET" }).handler(async () => {
  return getSessionCustomer();
});