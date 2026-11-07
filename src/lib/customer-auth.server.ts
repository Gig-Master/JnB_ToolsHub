import { SignJWT, jwtVerify } from "jose";
import { getCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { customers } from "@/db/schema";

export const CUSTOMER_COOKIE = "jnb_session";
export const CUSTOMER_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): Uint8Array {
  const s = process.env.SESSION_JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "SESSION_JWT_SECRET is missing or too short. Set a 32+ character random value in .env.local.",
    );
  }
  return new TextEncoder().encode(s);
}

export async function createCustomerToken(customerId: string): Promise<string> {
  return new SignJWT({ role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(customerId)
    .setIssuedAt()
    .setExpirationTime(`${CUSTOMER_MAX_AGE}s`)
    .sign(getSecret());
}

/** The logged-in customer, or null. Never throws. */
export async function getSessionCustomer() {
  const token = getCookie(CUSTOMER_COOKIE);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "customer" || !payload.sub) return null;

    const row = await db.query.customers.findFirst({
      where: eq(customers.id, payload.sub),
      columns: { id: true, email: true, name: true, phone: true, passwordChangedAt: true },
    });
    if (!row) return null;

    // A password change signs out every session that was created before it
    if (
      row.passwordChangedAt &&
      (payload.iat ?? 0) < Math.floor(row.passwordChangedAt.getTime() / 1000)
    ) {
      return null;
    }

    return { id: row.id, email: row.email, name: row.name, phone: row.phone };
  } catch {
    return null;
  }
}
/** Guard for server functions that need a logged-in customer (used in stages 3 and 4). */
export async function requireCustomer() {
  const customer = await getSessionCustomer();
  if (!customer) throw new Error("Unauthorized");
  return customer;
}