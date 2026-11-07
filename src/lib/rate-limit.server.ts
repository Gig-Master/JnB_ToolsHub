import { getRequestHeader } from "@tanstack/react-start/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";

/** Visitor's IP address. Vercel sets these headers itself, so visitors can't fake them. */
export function getClientIp(): string {
  const real = getRequestHeader("x-real-ip");
  if (real) return real.trim();
  const forwarded = getRequestHeader("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown"; // local development
}

/**
 * Counts one hit for `key`. Returns allowed=false once there have been more than
 * `max` hits inside the last `windowSeconds`. Atomic, so parallel requests can't slip past.
 */
export async function hitRateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<{ allowed: boolean }> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - windowSeconds * 1000).toISOString();
  const nowIso = now.toISOString();

  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, windowStart: now })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${rateLimits.windowStart} < ${cutoff}::timestamptz THEN 1 ELSE ${rateLimits.count} + 1 END`,
        windowStart: sql`CASE WHEN ${rateLimits.windowStart} < ${cutoff}::timestamptz THEN ${nowIso}::timestamptz ELSE ${rateLimits.windowStart} END`,
      },
    })
    .returning({ count: rateLimits.count });

  return { allowed: row.count <= max };
}

export async function clearRateLimit(key: string): Promise<void> {
  await db.delete(rateLimits).where(eq(rateLimits.key, key));
}