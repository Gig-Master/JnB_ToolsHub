import { SignJWT, jwtVerify } from "jose";
import { getCookie } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
function getSecret(): Uint8Array {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "ADMIN_JWT_SECRET is missing or too short. " +
        "Set a 32+ character random value in .env.local.",
    );
  }
  return new TextEncoder().encode(s);
}

export const SESSION_COOKIE = "jnb_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/** Signs a JWT that proves the bearer is an authenticated admin. */
export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

/** Returns true if the token is valid AND has role=admin. Never throws. */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Checks the plaintext password against the server-only env var, in constant time. */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set. Add it to .env.local.");
  }
  // Hash both so the two buffers always have the same length
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
/** 
 * Guard function to be used inside other server functions.
 * Throws an error if the user is not authenticated.
 */
export async function requireAdmin() {
  const token = getCookie(SESSION_COOKIE);
  const ok = await verifySessionToken(token);
  if (!ok) throw new Error("Unauthorized");
}