import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { getClientIp, hitRateLimit } from "@/lib/rate-limit.server";
import { normalizeKenyanPhone } from "@/lib/phone";
import { sendContactAlert } from "@/lib/contact-email.server";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().max(255).email().optional().or(z.literal("")),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(1000),
  // Hidden trap field: real visitors never fill it, bots usually do.
  website: z.string().max(200).optional(),
});

// Remove control characters (keep line breaks and tabs in the message)
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
const multiLine = (s: string) => s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();

export const submitContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    // Bots: pretend it worked, save nothing, send nothing.
        if (data.website && data.website.trim() !== "") {
      console.warn("[contact] honeypot triggered, message dropped");
      return { ok: true as const };
    }

    // Limit: 5 messages per hour per visitor
    const { allowed } = await hitRateLimit(`contact:${getClientIp()}`, 5, 60 * 60);
    if (!allowed) {
      return {
        ok: false as const,
        error: "You have sent several messages already. Please try again later or WhatsApp us.",
      };
    }

    const phone = normalizeKenyanPhone(data.phone);
    if (!phone) {
      return { ok: false as const, error: "Enter a valid Kenyan phone number, e.g. 0712345678." };
    }

    const entry = {
      name: oneLine(data.name),
      phone,
      email: data.email ? oneLine(data.email) : null,
      subject: oneLine(data.subject),
      message: multiLine(data.message),
    };
    if (!entry.name || !entry.subject || !entry.message) {
      return { ok: false as const, error: "Please fill in all the required fields." };
    }

    // 1. Save first, so nothing is lost even if email fails
    try {
      await db.insert(contactMessages).values(entry);
    } catch (err) {
      console.error("[contact] could not save message", err);
      return {
        ok: false as const,
        error: "We could not save your message right now. Please WhatsApp or call us.",
      };
    }

    // 2. Tell the owner
    await sendContactAlert(entry);

    return { ok: true as const };
  });