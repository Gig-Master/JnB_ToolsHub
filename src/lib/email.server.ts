import { BUSINESS } from "@/data/business";

const RESEND_URL = "https://api.resend.com/emails";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Base address for links in emails. Taken from config, never from the request. */
export function siteUrl(): string {
  const url = process.env.SITE_URL;
  if (!url) throw new Error("SITE_URL is not set. Add it to .env.local.");
  return url.replace(/\/+$/, "");
}

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/** Returns true if Resend accepted the email. Never throws. */
export async function sendEmail(msg: EmailMessage): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return false;
  }
  const from = process.env.EMAIL_FROM || "JnB Power Tools <no-reply@jnbpowertools.co.ke>";

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("Resend rejected the email:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend request failed:", error);
    return false;
  }
}

function wrap(inner: string): string {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
  <h2 style="margin:0 0 16px;color:#0b1f3a">JnB Power Tools &amp; Digital Electronics</h2>
  ${inner}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
  <p style="font-size:12px;color:#64748b">You received this email because of activity on your JnB account.</p>
</div>`;
}

export function resetEmail(to: string, name: string, link: string): EmailMessage {
  return {
    to,
    subject: "Reset your JnB Power Tools password",
    html: wrap(`
  <p>Hello ${esc(name)},</p>
  <p>We received a request to reset your password. Click the button below to choose a new one. This link works once and expires in 30 minutes.</p>
  <p style="margin:24px 0"><a href="${esc(link)}" style="background:#f97316;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold">Reset my password</a></p>
  <p style="font-size:13px;color:#475569">If the button doesn't work, copy this link into your browser:<br />${esc(link)}</p>
  <p style="font-size:13px;color:#475569">If you didn't ask for this, you can ignore this email. Your password will stay the same.</p>`),
    text: `Hello ${name},\n\nWe received a request to reset your password. Open this link to choose a new one (it works once and expires in 30 minutes):\n\n${link}\n\nIf you didn't ask for this, ignore this email. Your password will stay the same.`,
  };
}

export function passwordChangedEmail(to: string, name: string): EmailMessage {
  const phone = `+${BUSINESS.phone}`;
  return {
    to,
    subject: "Your JnB Power Tools password was changed",
    html: wrap(`
  <p>Hello ${esc(name)},</p>
  <p>Your password was just changed and you were signed out on your other devices.</p>
  <p style="font-size:13px;color:#475569">If this wasn't you, reset your password again straight away and contact us on ${esc(phone)}.</p>`),
    text: `Hello ${name},\n\nYour password was just changed and you were signed out on your other devices.\n\nIf this wasn't you, reset your password again straight away and contact us on ${phone}.`,
  };
}