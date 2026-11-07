import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  n: number,
  r: number,
  p: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keylen, { N: n, r, p }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

/** Returns "scrypt$N$r$p$salt$hash". The salt is random per password. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEYLEN, N, R, P);
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPasswordHash(password: string, stored: string): Promise<boolean> {
  try {
    const [scheme, n, r, p, saltB64, hashB64] = stored.split("$");
    if (scheme !== "scrypt") return false;
    const expected = Buffer.from(hashB64, "base64");
    const actual = await scryptAsync(
      password,
      Buffer.from(saltB64, "base64"),
      expected.length,
      Number(n),
      Number(r),
      Number(p),
    );
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | undefined;

/** Spends the same time as a real check, so response time doesn't reveal which emails exist. */
export async function fakeVerify(password: string): Promise<void> {
  dummyHash ??= hashPassword("jnb-timing-placeholder");
  await verifyPasswordHash(password, await dummyHash);
}