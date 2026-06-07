import React from "react";
import Link from "next/link";
import { ArrowRight, Globe, Shield, Heart } from "lucide-react";

export const metadata = {
  title: "Our Impact | WWJ",
  description: "Discover how WWJ gives back to wildlife conservation and protects endangered species globally.",
};

export default function ImpactPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-jungle z-0">
          <div 
            className="absolute inset-0 opacity-50 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/wildlife/peacock.png')" }}
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl text-ivory mb-6 tracking-wide">
            Conservation First
          </h1>
          <p className="text-lg md:text-xl text-gold font-light leading-relaxed">
            Beautiful jewellery shouldn&apos;t cost the earth. We are committed to protecting the creatures that inspire us.
          </p>
        </div>
      </section>

      {/* The 5% Pledge */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="font-display text-4xl text-jungle">The WWJ Pledge</h2>
          <div className="w-16 h-1 bg-gold mx-auto"></div>
          <p className="text-xl text-jungle/80 leading-relaxed font-serif italic">
            &quot;For every piece of jewellery sold, WWJ donates 5% of the profits directly to grassroots wildlife conservation organizations in India and Africa.&quot;
          </p>
          <p className="text-jungle/60 leading-relaxed max-w-2xl mx-auto">
            We believe that businesses have a fundamental responsibility to the planet. Our inspiration comes from the majestic beauty of animals, and it is our duty to ensure these species thrive for generations to come.
          </p>
        </div>
      </section>

      {/* Impact Pillars */}
      <section className="py-20 bg-jungle text-ivory">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <Globe className="w-12 h-12 text-gold" />
              <h3 className="font-display text-2xl">Habitat Restoration</h3>
              <p className="text-ivory/70 text-sm leading-relaxed">
                We fund projects that plant native trees and restore degraded lands, ensuring that apex predators and grazing herbivores have the space they need to live naturally.
              </p>
            </div>
            <div className="space-y-4">
              <Shield className="w-12 h-12 text-gold" />
              <h3 className="font-display text-2xl">Anti-Poaching</h3>
              <p className="text-ivory/70 text-sm leading-relaxed">
                By supporting frontline rangers with better equipment and training, our donations actively help protect elephants, rhinos, and big cats from illegal hunting.
              </p>
            </div>
            <div className="space-y-4">
              <Heart className="w-12 h-12 text-gold" />
              <h3 className="font-display text-2xl">Community Education</h3>
              <p className="text-ivory/70 text-sm leading-relaxed">
                Conservation only works when local communities benefit. We fund educational programs that teach coexistence and provide sustainable livelihoods to people living near wildlife.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 text-center px-4 bg-ivory">
        <h2 className="font-display text-3xl text-jungle mb-12">Our Conservation Partners</h2>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
          {/* Mock Logos */}
          <div className="font-display text-2xl font-bold tracking-widest">WILDTRUST</div>
          <div className="font-display text-2xl font-bold tracking-widest">SAVETHECATS</div>
          <div className="font-display text-2xl font-bold tracking-widest">EARTHFUND</div>
          <div className="font-display text-2xl font-bold tracking-widest">GREENHORIZON</div>
        </div>
        
        <div className="mt-16">
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center bg-jungle text-gold px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-charcoal transition-colors rounded-btn"
          >
            Shop to Support <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
