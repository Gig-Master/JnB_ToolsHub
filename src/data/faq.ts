// Questions customers (and AI answer engines) ask most. Written as short,
// direct answers. Every fact comes from src/data/business.ts so the text
// on the page, the FAQ structured data and the shop details never disagree.
import { BUSINESS, DELIVERY, OPENING, phoneDisplay } from "@/data/business";

const a = BUSINESS.address;
const open = BUSINESS.hours[0];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Where is JnB Power Tools & Digital Electronics located?",
    a: `We are at ${a.line1}, ${a.line2}, ${a.city} CBD, ${a.country}. Use the Get Directions button on this page to open the exact spot in Google Maps.`,
  },
  {
    q: "What are your opening hours?",
    a: `We are open ${open.day}, ${open.time}. We are closed on Sunday.`,
  },
  {
    q: "What does JnB Power Tools sell?",
    a: "We sell power tools, agricultural machinery, electronics, electrical accessories, solar systems (panels, inverters and batteries), salon and barber equipment, locks and padlocks, and general hardware.",
  },
  {
    q: "Which brands do you stock?",
    a: "Our brands include Bosch, Makita, DeWalt, Yale, Schneider and Honda, plus other trusted tool and electrical brands.",
  },
  {
    q: "Are your products genuine?",
    a: "Yes. We only sell authentic stock sourced from trusted suppliers and brands, and our team can advise you on the right product for the job.",
  },
  {
    q: "Do you deliver in Nairobi and the rest of Kenya?",
    a: `Yes. Delivery within Nairobi is a flat KSh ${DELIVERY.nairobiFee}. For other counties we confirm the delivery fee with you before dispatch. You can also collect your order from our shop.`,
  },
  {
    q: "How do I place an order?",
    a: `Add products to your cart, create a free account and check out on this website, or message us on WhatsApp at ${phoneDisplay}. We confirm availability before you pay.`,
  },
  {
    q: "How can I pay?",
    a: "You can pay on delivery or when you collect your order at the shop. Online M-Pesa payment is coming soon.",
  },
  {
    q: "How can I contact JnB Power Tools?",
    a: `Call or WhatsApp ${phoneDisplay}, email ${BUSINESS.email}, or use the contact form on this website. We usually reply within a few hours during business hours.`,
  },
];

/** FAQPage structured data (schema.org) built from the same list. */
export const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// Used by structured data elsewhere
export const OPEN_DAYS = OPENING.days;