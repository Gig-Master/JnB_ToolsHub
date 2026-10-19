import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/functions/categories";
import { BUSINESS, phoneHref, whatsappHref } from "@/data/business";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  // Fetch live categories from the database
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(),
  });

  return (
    <footer className="bg-secondary text-white/80 py-12 mt-auto">
      <div className="container-x grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Brand & About */}
        <div>
          <h3 className="text-white text-lg font-bold mb-4">{BUSINESS.name}</h3>
          <p className="text-sm leading-relaxed mb-4">
            Nairobi's trusted supplier of power tools, solar systems, electrical accessories, electronics, agricultural machinery and hardware.
          </p>
        </div>

        {/* Quick Links (Top Categories) */}
        <div>
          <h4 className="text-white font-semibold mb-4">Shop Categories</h4>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link 
                  to="/products" 
                  search={{ category: c.slug }}
                  className="hover:text-accent transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/products" search={{}} className="text-accent hover:text-white transition-colors font-medium">
                View all products →
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-accent shrink-0" />
              <span>{BUSINESS.address.line1}, {BUSINESS.address.line2}, {BUSINESS.address.city}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent shrink-0" />
              <a href={phoneHref} className="hover:text-white">{BUSINESS.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-accent shrink-0" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-white">{BUSINESS.email}</a>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div>
          <h4 className="text-white font-semibold mb-4">Need Help?</h4>
          <p className="text-sm mb-4">Chat with our team for expert advice and fast orders.</p>
          <a 
            href={whatsappHref()} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground font-semibold px-5 py-2.5 hover:brightness-95 transition cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
        </div>

      </div>
      
      <div className="container-x mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/50">
        <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}