/** Normalises Kenyan mobile numbers to 2547XXXXXXXX or 2541XXXXXXXX. Returns null if invalid. */
export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, "");
  let n: string;
  if (/^\+254\d{9}$/.test(digits)) n = digits.slice(1);
  else if (/^254\d{9}$/.test(digits)) n = digits;
  else if (/^0\d{9}$/.test(digits)) n = "254" + digits.slice(1);
  else if (/^[17]\d{8}$/.test(digits)) n = "254" + digits;
  else return null;
  return /^254[17]\d{8}$/.test(n) ? n : null;
}