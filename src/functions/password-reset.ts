import { createServerFn } from "@tanstack/react-start";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { db } from "@/db";
import { customers, passwordResetTokens } from "@/db/schema";
import { hashPassword } from "@/lib/password.server";
import { generateResetToken, hashResetToken } from "@/lib/reset-token.server";
import { passwordChangedEmail, resetEmail, sendEmail, siteUrl } from "@/lib/email.server";
import { passwordPolicyError } from "@/lib/password-strength";
import { getClientIp, hitRateLimit } from "@/lib/rate-limit.server"; // NEW

const TOKEN_MINUTES = 30;
const MAX_REQUESTS_PER_HOUR = 3;

/* ── Step 1: customer asks for a reset link ── */
export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    // NEW: max 5 reset requests per hour from one connection
    const ip = getClientIp();
    if (!(await hitRateLimit(`forgot:${ip}`, 5, 60 * 60)).allowed) {
      return { ok: false as const, error: "Too many requests. Please try again later." };
    }

    // Always the same answer, so this can't be used to discover who has an account
    const generic = { ok: true as const };

    const email = String(data.email ?? "").trim().toLowerCase().slice(0, 254);
    if (!email.includes("@")) return generic;

    const customer = await db.query.customers.findFirst({
      where: eq(customers.email, email),
      columns: { id: true, name: true, email: true },
    });
    if (!customer) return generic;

    // At most 3 requests per customer per hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db
      .select({ id: passwordResetTokens.id })
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.customerId, customer.id),
          gt(passwordResetTokens.createdAt, hourAgo),
        ),
      );
    if (recent.length >= MAX_REQUESTS_PER_HOUR) return generic;

    // Housekeeping: remove tokens that expired more than a day ago
    await db
      .delete(passwordResetTokens)
      .where(lt(passwordResetTokens.expiresAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

    // A new request cancels any older unused links
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(and(eq(passwordResetTokens.customerId, customer.id), isNull(passwordResetTokens.usedAt)));

    const { token, tokenHash } = generateResetToken();
    await db.insert(passwordResetTokens).values({
      customerId: customer.id,
      tokenHash,
      expiresAt: new Date(Date.now() + TOKEN_MINUTES * 60 * 1000),
    });

    const link = `${siteUrl()}/reset-password?token=${token}`;
    await sendEmail(resetEmail(customer.email, customer.name, link));

    return generic;
  });

/* ── Step 2: customer sets a new password using the emailed link ── */
export const resetPassword = createServerFn({ method: "POST" })
  .validator((d: { token: string; password: string }) => d)
  .handler(async ({ data }) => {
    const token = String(data.token ?? "");
    const password = String(data.password ?? "");
    const invalid = {
      ok: false as const,
      error: "This reset link is invalid or has expired. Please request a new one.",
    };

    if (token.length < 20 || token.length > 100) return invalid;

    const policyError =
      password.length > 128 ? "Password is too long" : passwordPolicyError(password);
    if (policyError) return { ok: false as const, error: policyError };

    const tokenHash = hashResetToken(token);
    const newHash = await hashPassword(password);

    const customer = await db.transaction(async (tx) => {
      // Single use: only one request can flip usedAt from null, even if clicked twice at once
      const [row] = await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(
          and(
            eq(passwordResetTokens.tokenHash, tokenHash),
            isNull(passwordResetTokens.usedAt),
            gt(passwordResetTokens.expiresAt, new Date()),
          ),
        )
        .returning({ customerId: passwordResetTokens.customerId });
      if (!row) return null;

      const [updated] = await tx
        .update(customers)
        .set({
          passwordHash: newHash,
          passwordChangedAt: new Date(), // signs out all older sessions
          failedLogins: 0,
          lockedUntil: null,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, row.customerId))
        .returning({ name: customers.name, email: customers.email });

      // Cancel any other unused links for this customer
      await tx
        .update(passwordResetTokens)
        .set({ usedAt: new Date() })
        .where(
          and(eq(passwordResetTokens.customerId, row.customerId), isNull(passwordResetTokens.usedAt)),
        );

      return updated ?? null;
    });

    if (!customer) return invalid;

    await sendEmail(passwordChangedEmail(customer.email, customer.name));
    return { ok: true as const };
  });