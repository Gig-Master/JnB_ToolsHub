export const MIN_LENGTH = 8;
export const STRONG_LENGTH = 12;

const COMMON_PASSWORDS = new Set([
  "password", "password1", "password12", "password123", "passw0rd", "12345678", "123456789",
  "1234567890", "qwerty123", "qwertyuiop", "iloveyou", "admin123", "welcome1", "welcome123",
  "abc12345", "letmein123", "changeme", "11111111", "00000000", "kenya123", "nairobi123",
]);

export interface PasswordChecks {
  length: boolean;
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
  long: boolean;
}

export function checkPassword(pw: string): PasswordChecks {
  return {
    length: pw.length >= MIN_LENGTH,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
    long: pw.length >= STRONG_LENGTH,
  };
}

/** Returns an error message, or null if the password is acceptable. */
export function passwordPolicyError(pw: string): string | null {
  const c = checkPassword(pw);
  if (!c.length) return `Password must be at least ${MIN_LENGTH} characters`;
  if (!c.upper) return "Password must include an uppercase letter";
  if (!c.lower) return "Password must include a lowercase letter";
  if (!c.number) return "Password must include a number";
  if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
    return "That password is too common. Choose something harder to guess";
  }
  return null;
}

export function passwordMeetsPolicy(pw: string): boolean {
  return passwordPolicyError(pw) === null;
}

export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!pw) return { score: 0, label: "" };
  if (!passwordMeetsPolicy(pw)) return { score: 1, label: "Weak" };
  const c = checkPassword(pw);
  let score = 2;
  if (c.symbol) score++;
  if (c.long) score++;
  return { score: score as 2 | 3 | 4, label: ["", "Weak", "Fair", "Good", "Strong"][score] };
}