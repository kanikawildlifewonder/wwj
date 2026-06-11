import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us | WWJ",
  description: "Learn about the story behind WildLife Jewellery (WWJ) and our commitment to craftsmanship and conservation.",
};

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section id="brand" className="relative h-[45vh] sm:h-[50vh] md:h-[60vh] min-h-[300px] sm:min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-jungle z-0">
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero_leopard.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/50 to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-12 sm:mt-20">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-gold mb-4 sm:mb-6 tracking-wide">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-ivory/90 font-light leading-relaxed">
            Where high-end craftsmanship meets untamed beauty. Born from a passion for wildlife and a dedication to exquisite design.
          </p>
        </div>
      </section>

      {/* The Founder Section */}
      <section id="founder" className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-[4/5] max-h-[400px] md:max-h-none relative rounded-t-full overflow-hidden border-4 sm:border-8 border-ivory shadow-xl">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=800&auto=format&fit=crop')" }}
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="font-display text-4xl text-jungle">Meet Kanika</h2>
              <div className="w-12 h-1 bg-gold"></div>
              <p className="text-jungle/70 leading-relaxed text-lg">
                &quot;I founded WildLife Jewellery (WWJ) with a singular vision: to capture the fierce, delicate, and awe-inspiring essence of nature in wearable art.&quot;
              </p>
              <p className="text-jungle/70 leading-relaxed">
                Growing up surrounded by the rich biodiversity of India, Kanika developed a deep reverence for wildlife. Combining this passion with formal training in fine jewellery design, she launched WWJ to offer pieces that are more than just accessories—they are statements of strength, grace, and environmental consciousness.
              </p>
              <p className="text-jungle/70 leading-relaxed">
                Every piece in our collection is meticulously crafted by skilled artisans, ensuring that the spirit of the animal it represents is honored through uncompromising quality and detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 sm:py-20 bg-ivory border-y border-jungle/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="font-display text-3xl sm:text-4xl text-jungle text-center mb-10 sm:mb-16">Our Philosophy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-jungle flex items-center justify-center text-gold text-2xl font-serif">I</div>
              <h3 className="font-display text-xl text-jungle">Artisanal Craftsmanship</h3>
              <p className="text-jungle/60 text-sm leading-relaxed">
                We believe in slow fashion. Every curve, texture, and gemstone is placed with intention by master craftsmen using techniques passed down through generations.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-jungle flex items-center justify-center text-gold text-2xl font-serif">II</div>
              <h3 className="font-display text-xl text-jungle">Ethical Sourcing</h3>
              <p className="text-jungle/60 text-sm leading-relaxed">
                Our materials are procured with deep respect for the earth. We use conflict-free gemstones and recycled precious metals wherever possible.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-jungle flex items-center justify-center text-gold text-2xl font-serif">III</div>
              <h3 className="font-display text-xl text-jungle">Wildlife Conservation</h3>
              <p className="text-jungle/60 text-sm leading-relaxed">
                Nature gives us our inspiration, and we give back. A portion of every purchase goes directly to verified wildlife sanctuaries and conservation funds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 text-center px-4">
        <h2 className="font-display text-3xl md:text-4xl text-jungle mb-6">Wear Your Wild Side</h2>
        <p className="text-jungle/60 mb-8 max-w-xl mx-auto">
          Explore our collections and find the spirit animal that resonates with your unique style.
        </p>
        <Link 
          href="/collections" 
          className="inline-flex items-center justify-center bg-jungle text-gold px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-charcoal transition-colors rounded-btn"
        >
          Explore Collections <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
