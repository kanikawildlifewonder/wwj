import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PawPrint } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-jungle text-ivory/80 pt-10 sm:pt-16 pb-6 sm:pb-8 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-8 mb-10 sm:mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4 sm:space-y-6 col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex flex-col items-start -space-y-1 group">
              <span className="font-display text-3xl font-bold text-ivory tracking-widest group-hover:text-gold transition-colors">
                WWJ
              </span>
              <span className="font-sans text-[0.55rem] tracking-[0.2em] text-gold uppercase whitespace-nowrap">
                Wildlife Wonder Jewellery
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              WWJ - Wildlife Wonder Jewellery is more than just a brand. It&apos;s a movement to celebrate wildlife, creativity and craftsmanship.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="Pinterest">
                <span className="font-display font-bold italic text-lg leading-none">P</span>
              </a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Newsletter / Community */}
          <div className="space-y-4 sm:space-y-6 col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="font-sans text-sm tracking-widest font-bold text-ivory uppercase">Join the Wild Community</h4>
            <p className="text-sm">Get exclusive updates, new launches, styling tips & wildlife stories.</p>
            <form className="flex flex-col sm:flex-row max-w-sm">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border border-border px-4 py-2 text-sm w-full focus:outline-none focus:border-gold text-ivory placeholder:text-ivory/50"
                required
              />
              <button 
                type="submit"
                className="bg-gold text-jungle px-4 py-2 text-xs font-bold tracking-wider hover:bg-gold-light transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-sans text-sm tracking-widest font-bold text-ivory uppercase">Explore</h4>
            <ul className="space-y-3 text-sm flex flex-col">
              <li><Link href="/shop" className="hover:text-gold transition-colors">Shop All</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/impact" className="hover:text-gold transition-colors">Our Impact</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-6">
            <h4 className="font-sans text-sm tracking-widest font-bold text-ivory uppercase">Support</h4>
            <ul className="space-y-3 text-sm flex flex-col">
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQs</Link></li>
              <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Instagram Feed */}
          <div className="space-y-6 col-span-2 sm:col-span-2 lg:col-span-1">
            <h4 className="font-sans text-sm tracking-widest font-bold text-ivory uppercase hover:text-gold transition-colors">
              <a href="https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" target="_blank" rel="noopener noreferrer">
                Instagram Feed
              </a>
            </h4>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {[
                { src: "/images/wildlife/tiger.png", alt: "Tiger Wildlife" },
                { src: "/images/products/peacock_necklace.png", alt: "Peacock Necklace" },
                { src: "/images/wildlife/deer.png", alt: "Deer Wildlife" },
                { src: "/images/products/butterfly_earrings.png", alt: "Butterfly Earrings" },
                { src: "/images/wildlife/peacock.png", alt: "Peacock Wildlife" },
                { src: "/images/products/leopard_pendant.png", alt: "Leopard Pendant" },
              ].map((img, idx) => (
                <a 
                  key={idx} 
                  href="https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="aspect-square bg-forest rounded overflow-hidden block relative group"
                >
                  <Image 
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 30vw, 100px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-jungle/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-5 h-5 text-gold stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} WWJ - Wildlife Wonder Jewellery. All Rights Reserved.</p>
          <div className="flex items-center gap-1 text-gold">
            <PawPrint className="w-3 h-3" />
            <span className="text-ivory/60 italic ml-2">Handcrafted with ♥ for Wildlife & Nature Lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
