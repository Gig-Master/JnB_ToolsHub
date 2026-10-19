import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(1000),
});

// PLACEHOLDER — this simply logs submissions server-side.
// Replace with real persistence (database table, email service, etc.).
export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    console.log("[contact] new submission", {
      ...data,
      receivedAt: new Date().toISOString(),
    });
    return { ok: true as const };
  });
