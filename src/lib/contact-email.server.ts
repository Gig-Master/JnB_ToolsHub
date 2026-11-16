import { sendEmail } from "@/lib/email.server";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export interface ContactAlert {
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
}

/** Emails the shop owner. Never throws: the message is already saved in the database. */
export async function sendContactAlert(m: ContactAlert): Promise<void> {
  const to = process.env.CONTACT_ALERT_EMAIL;
  if (!to) {
    console.error("[contact] CONTACT_ALERT_EMAIL is not set");
    return;
  }

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#0f172a">
  <h2 style="margin:0 0 12px">New website message</h2>
  <p style="margin:0 0 4px"><b>${esc(m.subject)}</b></p>
  <p style="margin:0 0 16px;color:#475569">
    From <b>${esc(m.name)}</b><br />
    Phone: ${esc(m.phone)}<br />
    Email: ${m.email ? esc(m.email) : "not given"}
  </p>
  <div style="white-space:pre-wrap;border-left:4px solid #f97316;padding:8px 14px;background:#f8fafc">${esc(m.message)}</div>
  <p style="margin-top:16px;font-size:12px;color:#64748b">
    ${m.email ? "Press Reply to answer the customer by email." : "No email was given: reply by phone or WhatsApp."}
    You can also see this in your admin page under Messages.
  </p>
</div>`;

  const text = [
    `New website message: ${m.subject}`,
    `From: ${m.name}`,
    `Phone: ${m.phone}`,
    `Email: ${m.email ?? "not given"}`,
    "",
    m.message,
  ].join("\n");

  await sendEmail({
    to,
    subject: `New website message: ${m.subject}`,
    html,
    text,
    replyTo: m.email || undefined,
  });
}