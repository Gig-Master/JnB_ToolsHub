import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { BUSINESS, phoneHref, emailHref, whatsappHref, MAP } from "@/data/business";
import { submitContact } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact JnB Power Tools & Digital Electronics — Nairobi" },
      { name: "description", content: "Get in touch with JnB Power Tools in Nairobi. Call, WhatsApp, email or visit our shop at Royal Palm Mall, Mfangano Street." },
      { property: "og:title", content: "Contact JnB Power Tools" },
      { property: "og:description", content: "Reach us via phone, WhatsApp, email or visit our shop in Nairobi CBD." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      await submitContact({ data: parsed.data });
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  const cards = [
    { icon: Phone, title: "Call us", value: `+${BUSINESS.phone}`, href: phoneHref },
    { icon: MessageCircle, title: "WhatsApp", value: `+${BUSINESS.whatsapp}`, href: whatsappHref() },
    { icon: Mail, title: "Email", value: BUSINESS.email, href: emailHref },
    { icon: MapPin, title: "Visit us", value: "Royal Palm Mall, Mfangano St", href: MAP.placeUrl },
    { icon: Clock, title: "Hours", value: "Mon-Sat: 5:45am – 9pm", href: undefined },
  ];

  return (
    <>
      <section className="bg-secondary text-white py-14">
        <div className="container-x max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold">Contact JnB Power Tools & Digital Electronics</h1>
          <p className="mt-4 text-white/80 text-lg">
            Whether you need product advice, a quote, or help placing an order — we're here to help.
            Reach us the way that suits you.
          </p>
        </div>
      </section>

      <section className="py-14 bg-background">
        <div className="container-x">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((c) => {
              const inner = (
                <>
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{c.title}</p>
                  <p className="mt-1 font-semibold text-sm">{c.value}</p>
                </>
              );
              return c.href ? (
                <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card-surface p-5 border border-border block">
                  {inner}
                </a>
              ) : (
                <div key={c.title} className="card-surface p-5 border border-border">{inner}</div>
              );
            })}
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="card-surface p-6 md:p-8 border border-border">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">We usually reply within a few hours during business hours.</p>

              {status === "success" && (
                <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 text-sm">
                  <CheckCircle2 className="h-5 w-5" /> Thanks — your message was received. We'll be in touch.
                </div>
              )}

              <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
                <Field label="Full name" name="name" required error={errors.name} />
                <Field label="Phone number" name="phone" type="tel" required error={errors.phone} />
                <Field label="Email (optional)" name="email" type="email" error={errors.email} />
                <Field label="Subject" name="subject" required error={errors.subject} />
                <div>
                  <label htmlFor="message" className="text-sm font-medium">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {status === "sending" ? "Sending..." : "Send message"}
                </button>
                {status === "error" && (
                  <p className="text-sm text-destructive text-center">Couldn't send — please try WhatsApp or call.</p>
                )}
              </form>
            </div>

            {/* Map + quick actions */}
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-video bg-muted shadow-card">
                {/* PLACEHOLDER_MAP_IFRAME — replace src with real Google Maps embed */}
                <iframe
                  title="JnB Power Tools location on Google Maps"
                  src={MAP.embedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <a href={phoneHref} className="card-surface p-4 border border-border text-center hover:border-primary">
                  <Phone className="h-5 w-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs font-semibold">Call Now</p>
                </a>
                <a href={whatsappHref()} target="_blank" rel="noreferrer" className="card-surface p-4 border border-border text-center hover:border-accent">
                  <MessageCircle className="h-5 w-5 mx-auto text-accent" />
                  <p className="mt-2 text-xs font-semibold">WhatsApp</p>
                </a>
                <a href={MAP.directionsUrl} target="_blank" rel="noreferrer" className="card-surface p-4 border border-border text-center hover:border-primary">
                  <MapPin className="h-5 w-5 mx-auto text-primary" />
                  <p className="mt-2 text-xs font-semibold">Directions</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required, error }: { label: string; name: string; type?: string; required?: boolean; error?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">{label} {required && "*"}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
