import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Drill, Tractor, Cpu, Plug, Sun, Scissors, Zap, Lock, Wrench,
  ShieldCheck, BadgeDollarSign, HeartHandshake, MessageCircle, Phone,
  MapPin, Clock, Star, ArrowRight, Sparkles, Truck, Award,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BUSINESS, phoneHref, whatsappHref, MAP } from "@/data/business";
import { useProducts } from "@/hooks/useProducts";
import { listCategories } from "@/functions/categories";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import type { ProductDTO } from "@/types";

const heroImage = "/images/site/jnb-shop-interior.jpg";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Drill, Tractor, Cpu, Plug, Sun, Scissors, Zap, Lock, Wrench,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JnB Power Tools & Digital Electronics — Nairobi Hardware & Solar" },
      { name: "description", content: "Nairobi's trusted supplier of power tools, solar systems, electrical accessories, electronics, agricultural machinery and hardware. Visit us at Royal Palm Mall, Mfangano Street." },
      { property: "og:title", content: "JnB Power Tools & Digital Electronics — Nairobi" },
      { property: "og:description", content: "Genuine tools, solar and electricals at fair prices. Order via WhatsApp today." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [active, setActive] = useState<ProductDTO | null>(null);

  return (
    <>
      <Hero />
      <Categories />
      <WhyUs />
      <Featured onView={setActive} />
      <AboutPreview />
      <Testimonials />
      <LocationPreview />
      <FinalCTA />
      <ProductModal product={active} onClose={() => setActive(null)} onSelect={setActive} />
    </>
  );
}

/* ─────────────── Hero ─────────────── */
function Hero() {
  const perks = [
    { icon: ShieldCheck, label: "Genuine Products" },
    { icon: BadgeDollarSign, label: "Competitive Prices" },
    { icon: HeartHandshake, label: "Expert Support" },
    { icon: Truck, label: "Fast Response" },
  ];
  return (
    <section className="relative overflow-hidden bg-secondary text-white">
      <div className="absolute inset-0 opacity-20">
        <img
          src={heroImage}
          alt="JnB Power Tools & Digital Electronics shop interior in Nairobi"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/95 to-primary/60" />
      <div className="container-x relative py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Nairobi's trusted hardware & electronics store
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight">
            Quality <span className="text-accent">Power Tools</span> & Digital Electronics You Can Trust
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-xl">
            Supplying genuine power tools, solar systems, electrical accessories, electronics,
            agricultural machinery and hardware products across Nairobi.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn-accent">
              View Products <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={whatsappHref("Hello JnB, I'd like to place an order.")} target="_blank" rel="noreferrer" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-secondary">
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {perks.map((p, i) => (
            <div
              key={p.label}
              className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-5 hover:bg-white/15 transition animate-float"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <p.icon className="h-8 w-8 text-accent" />
              <p className="mt-3 font-semibold">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Categories ─────────────── */
function Categories() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(),
  });

  return (
    <section className="py-20 bg-background">
      <div className="container-x">
        <SectionHeader
          eyebrow="What we stock"
          title="Shop by category"
          subtitle="Everything a contractor, technician, farmer or homeowner might need — under one roof."
        />
        
        {isLoading ? (
          <p className="text-center mt-10 text-muted-foreground">Loading categories...</p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const Icon = ICONS[c.icon] ?? Wrench;
              return (
                <Link
                  key={c.id}
                  to="/products"
                  search={{ category: c.slug }}
                  className="card-surface p-6 group border border-transparent hover:border-primary/20"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{c.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    Browse <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────── Why Us ─────────────── */
function WhyUs() {
  const items = [
    { icon: ShieldCheck, title: "Genuine & Quality Products", body: "Only authentic stock sourced from trusted suppliers and brands." },
    { icon: BadgeDollarSign, title: "Affordable Prices", body: "Competitive pricing for contractors, businesses and individuals." },
    { icon: Award, title: "Trusted Brands", body: "Bosch, Makita, DeWalt, Yale, Schneider, Honda and many more." },
    { icon: HeartHandshake, title: "Expert Technical Advice", body: "Our team helps you pick the right tool for the job." },
    { icon: Sparkles, title: "Excellent Customer Service", body: "Friendly, professional service before and after every sale." },
    { icon: MapPin, title: "Convenient Nairobi Location", body: "Royal Palm Mall, Mfangano Street — easy to reach in the CBD." },
  ];
  return (
    <section className="relative overflow-hidden py-20 bg-white">
      <div className="absolute inset-0 opacity-20">
        <img src={heroImage} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="container-x relative">
        <SectionHeader eyebrow="Why JnB" title="Why customers choose us" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div key={i.title} className="card-surface p-6 border border-border">
              <div className="h-11 w-11 rounded-xl bg-accent/10 text-accent grid place-items-center">
                <i.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{i.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Featured ─────────────── */
function Featured({ onView }: { onView: (p: ProductDTO) => void }) {
  const { data: featured = [], isLoading } = useProducts({ featured: true });

  return (
    <section className="py-20 bg-background">
      <div className="container-x">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <SectionHeader eyebrow="Bestsellers" title="Featured products" align="left" />
          <Link to="/products" className="text-primary font-semibold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {isLoading ? (
           <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
             {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse bg-slate-200 rounded-2xl h-80" />)}
           </div>
        ) : featured.length === 0 ? (
          <p className="mt-10 text-muted-foreground">No featured products at the moment.</p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onView={onView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────── About Preview ─────────────── */
function AboutPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-muted">
          <img
            src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80"
            alt="Inside a hardware store"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <span className="text-sm font-semibold text-primary">About JnB</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">Your neighbourhood tool & electronics experts</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            JnB Power Tools & Digital Electronics is a trusted supplier of quality power tools,
            agricultural machinery, electronics, electrical accessories, solar systems, salon and
            barber equipment, locks, padlocks, and general hardware products. We serve contractors,
            technicians, electricians, farmers, businesses, and homeowners with reliable products
            at competitive prices, backed by expert advice and excellent customer service.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">Learn More</Link>
            <a href={whatsappHref()} target="_blank" rel="noreferrer" className="btn-outline">
              <MessageCircle className="h-4 w-4" /> Chat with us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Testimonials ─────────────── */
function Testimonials() {
  const items = [
    { name: "Peter Kamau", role: "Electrical Contractor", text: "JnB has become my go-to for wiring accessories and MCBs. Their prices beat anywhere else in town and the team really knows their stock." },
    { name: "Grace Wanjiku", role: "Salon Owner", text: "Bought a dryer, steamer and clippers from JnB. All genuine, all working perfectly one year on. Great customer service." },
    { name: "John Mwangi", role: "Farmer, Kiambu", text: "Got a Honda water pump and knapsack sprayer. Delivered same day and the technical advice was spot on." },
  ];
  const [i, setI] = useState(0);
  const t = items[i];
  return (
    <section className="py-20 bg-background">
      <div className="container-x">
        <SectionHeader eyebrow="Customer stories" title="What our customers say" />
        <div className="mt-10 max-w-3xl mx-auto card-surface p-8 md:p-10 text-center">
          <div className="flex justify-center gap-1 text-accent">
            {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-5 w-5 fill-accent" />)}
          </div>
          <p className="mt-6 text-lg text-foreground leading-relaxed">"{t.text}"</p>
          <p className="mt-6 font-semibold">{t.name}</p>
          <p className="text-sm text-muted-foreground">{t.role}</p>
          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Review ${k + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${k === i ? "w-8 bg-primary" : "w-2 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Location Preview ─────────────── */
function LocationPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="container-x grid lg:grid-cols-2 gap-10">
        <div>
          <SectionHeader eyebrow="Visit us" title="Find our shop" align="left" />
          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"><MapPin className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-muted-foreground text-sm">{BUSINESS.address.line1}, {BUSINESS.address.line2}, {BUSINESS.address.city}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0"><Clock className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold">Business hours</p>
                {BUSINESS.hours.map((h) => (
                  <p key={h.day} className="text-sm text-muted-foreground">{h.day}: {h.time}</p>
                ))}
              </div>
            </li>
          </ul>
          <a href={MAP.directionsUrl} target="_blank" rel="noreferrer" className="btn-primary mt-8">
            <MapPin className="h-4 w-4" /> Get Directions
          </a>
        </div>
        <div className="rounded-2xl overflow-hidden aspect-video bg-muted shadow-card">
          <iframe
            title="JnB Power Tools & Digital Electronics location"
            src={MAP.embedUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Final CTA ─────────────── */
function FinalCTA() {
  return (
    <section className="py-16">
      <div className="container-x">
        <div className="rounded-3xl bg-gradient-to-br from-accent to-orange-600 text-white p-10 md:p-14 text-center shadow-soft">
          <h2 className="text-3xl md:text-4xl font-bold">Need Tools or Electrical Supplies?</h2>
          <p className="mt-3 text-white/90 max-w-2xl mx-auto">
            Talk to us — we'll help you find the right product at the right price, and get it to you fast.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href={whatsappHref()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white text-accent font-semibold px-6 py-3 hover:brightness-95 transition">
              <MessageCircle className="h-5 w-5" /> WhatsApp Now
            </a>
            <a href={phoneHref} className="inline-flex items-center gap-2 rounded-full border-2 border-white text-white font-semibold px-6 py-3 hover:bg-white hover:text-accent transition">
              <Phone className="h-5 w-5" /> Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Shared ─────────────── */
function SectionHeader({
  eyebrow, title, subtitle, align = "center",
}: { eyebrow?: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && <span className="text-sm font-semibold text-primary uppercase tracking-wider">{eyebrow}</span>}
      <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}