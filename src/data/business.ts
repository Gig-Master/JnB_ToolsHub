// Business constants — replace placeholders with real values before launch.
// Order of replacement (search these strings across the repo):
//   PLACEHOLDER_WHATSAPP_NUMBER, PLACEHOLDER_PHONE_NUMBER, PLACEHOLDER_EMAIL,
//   PLACEHOLDER_MAP_IFRAME
export const BUSINESS = {
  name: "JnB Power Tools & Digital Electronics",
  shortName: "JnB Power Tools",
  tagline: "Quality Power Tools & Digital Electronics You Can Trust",
  description:
    "Trusted Nairobi supplier of genuine power tools, agricultural machinery, electronics, electrical accessories, solar systems, salon and barber equipment, locks, padlocks and general hardware — for contractors, technicians, electricians, farmers and homeowners.",
  address: {
    line1: "Shop AG11, Magic Business Centre (Royal Palm Mall)",
    line2: "Mfangano Street",
    city: "Nairobi",
    country: "Kenya",
  },
  // Phone (E.164, no +)
  phone: "254740151986",
  // WhatsApp (E.164, no +)
  whatsapp: "254740151986",
  // Contact email
  email: "jnbtools@gmail.com",
  hours: [
    { day: "Monday – Saturday", time: "5:50 AM – 9:30 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  socials: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
} as const;

export const MAP = {
  lat: -1.2853274,
  lng: 36.8278345,
  /** Public Google Maps place link (also used for "Get Directions"). */
  placeUrl:
    "https://www.google.com/maps/place/JnB+Power+Tools+%26+Digital+Electronics/@-1.2853274,36.8252596,17z/data=!3m1!4b1!4m6!3m5!1s0x182f118e1220c3ff:0xa1ff475e2f5adc10!8m2!3d-1.2853274!4d36.8278345!16s%2Fg%2F11zgw2dw8d",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=-1.2853274,36.8278345&destination_place_id=ChIJ_8MgEo4RLxgRENxaL15H_6E",
  embedUrl:
    "https://www.google.com/maps?q=-1.2853274,36.8278345&z=17&hl=en&output=embed",
} as const;

export const phoneHref = `tel:+${BUSINESS.phone}`;

export const emailHref = `mailto:${BUSINESS.email}`;
export const whatsappHref = (message?: string) =>
  `https://wa.me/${BUSINESS.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
export const whatsappProductMessage = (productName: string, price?: number) =>
  `Hello JnB, I'm interested in ${productName}${price ? ` (listed at KSh ${price.toLocaleString()})` : ""}. Please confirm availability and delivery options.`;
