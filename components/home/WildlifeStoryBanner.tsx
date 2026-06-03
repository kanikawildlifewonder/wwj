import React from "react";
import Link from "next/link";

export function WildlifeStoryBanner({
  subtitle = "INSPIRED BY NATURE. MADE FOR YOU.",
  title = "Every Piece Tells <br /> A Wild Story.",
  paragraph = "From the elegance of a butterfly to the strength of a tiger, our designs are a tribute to the incredible wildlife that inspires us every day."
}: {
  subtitle?: string;
  title?: string;
  paragraph?: string;
}) {
  return (
    <section className="relative bg-jungle py-16 border-b border-border overflow-hidden">
      {/* Tiger Background Left */}
      <div
        className="absolute left-0 top-0 w-1/2 h-full bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/images/wildlife/tiger.png')" }}
      />
      <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-transparent to-jungle" />
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Text Content */}
          <div className="flex-1 space-y-6 max-w-xl relative z-10">
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase font-bold text-gold">
              {subtitle}
            </h4>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="font-sans text-sm text-ivory/80 leading-relaxed max-w-md">
              {paragraph}
            </p>
            <div className="pt-4">
              <Link 
                href="/wildlife-impact" 
                className="border border-gold text-gold px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-jungle transition-all rounded-btn inline-block"
              >
                DISCOVER INSPIRATION
              </Link>
            </div>
          </div>

          {/* Right Images Collage */}
          <div className="flex-1 relative h-[300px] md:h-[400px] w-full flex items-center justify-center">
            
            {/* Center Image */}
            <div className="absolute z-20 w-40 md:w-56 aspect-[3/4] bg-forest rounded shadow-2xl border-2 border-ivory p-1 rotate-2 transition-transform hover:rotate-0 hover:z-30 hover:scale-105">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/images/wildlife/deer.png')" }}
              />
            </div>

            {/* Left Image */}
            <div className="absolute z-10 w-32 md:w-48 aspect-[3/4] bg-forest rounded shadow-xl border border-ivory/50 p-1 -translate-x-20 md:-translate-x-32 -rotate-6 transition-transform hover:rotate-0 hover:z-30 hover:scale-105">
              <div 
                className="w-full h-full bg-cover bg-center opacity-80"
                style={{ backgroundImage: "url('/images/wildlife/peacock.png')" }}
              />
            </div>

            {/* Right Image */}
            <div className="absolute z-10 w-32 md:w-48 aspect-[3/4] bg-forest rounded shadow-xl border border-ivory/50 p-1 translate-x-20 md:translate-x-32 rotate-6 transition-transform hover:rotate-0 hover:z-30 hover:scale-105">
              <div 
                className="w-full h-full bg-cover bg-center opacity-80"
                style={{ backgroundImage: "url('/images/products/elephant_keychain.png')" }}
              />
            </div>

            <div className="absolute -bottom-8 md:-bottom-12 right-0 md:right-10 z-0">
              <span className="font-serif italic text-4xl md:text-5xl text-gold opacity-50">Stay Wild</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
