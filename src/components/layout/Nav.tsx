import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { BUSINESS, phoneHref, whatsappHref } from "@/data/business";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[color:var(--color-secondary)]/95 text-white shadow-md">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground text-sm">JnB</span>
          <span className="hidden sm:block text-sm leading-tight">
            <span className="block">JnB Power Tools</span>
            <span className="block text-xs text-white/70 font-normal">& Digital Electronics</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-white/85 hover:text-white transition-colors"
              activeProps={{ className: "text-accent" }}
              activeOptions={{ exact: true }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={phoneHref} className="btn-outline !border-white !text-white hover:!bg-white hover:!text-secondary text-sm !py-2 !px-4">
            <Phone className="h-4 w-4" /> Call
          </a>
          <a href={whatsappHref()} target="_blank" rel="noreferrer" className="btn-accent text-sm !py-2 !px-4">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
          <div className="container-x flex flex-col gap-1 py-3">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-white/90 hover:bg-white/10"
                activeProps={{ className: "bg-white/10 text-accent" }}
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <a href={phoneHref} className="btn-outline !border-white !text-white flex-1 text-sm !py-2">
                <Phone className="h-4 w-4" /> Call
              </a>
              <a href={whatsappHref()} target="_blank" rel="noreferrer" className="btn-accent flex-1 text-sm !py-2">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Nav;
