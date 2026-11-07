import { createHash, randomBytes } from "node:crypto";

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** token goes in the email link; only tokenHash is stored in the database. */
export function generateResetToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashResetToken(token) };
}