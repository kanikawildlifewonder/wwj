import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Sparkle } from "lucide-react";

export const metadata = {
  title: "About Us | WWJ — Wildlife Wonder Jewellery",
  description: "Learn about the story behind Wildlife Wonder Jewellery and our commitment to craftsmanship and conservation.",
};

export default function AboutPage() {
  return (
    <div className="bg-jungle min-h-screen flex flex-col justify-between">
      {/* Header section */}
      <div className="py-12 sm:py-20 text-center px-4 max-w-3xl mx-auto flex-shrink-0">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-10 h-[1px] bg-gold/45" />
          <span className="text-gold text-xs tracking-[0.25em] uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Our Worlds
          </span>
          <span className="w-10 h-[1px] bg-gold/45" />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory tracking-wide leading-tight">
          Beauty. Purpose. Wild.
        </h1>
        <p className="text-sm sm:text-base text-ivory/60 mt-4 font-sans leading-relaxed">
          Wildlife Wonder Jewellery is a movement to celebrate wildlife and support conservation. Step into our world to discover the story of our craft and the vision of our founder.
        </p>
      </div>

      {/* Split Cards Grid */}
      <div className="container mx-auto px-4 lg:px-8 mb-16 sm:mb-24 flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Card 1: Our Brand Story */}
        <div className="group relative rounded-2xl overflow-hidden border border-border bg-forest h-[400px] sm:h-[450px] md:h-[500px] flex flex-col justify-between shadow-xl">
          {/* Background image with parallax scale zoom */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-65 group-hover:opacity-85 transition-all duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('/images/hero_leopard.png')" }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-jungle/50 via-transparent to-jungle/95" />

          {/* Icon Badge */}
          <div className="relative z-10 p-6 sm:p-8 flex justify-end">
            <div className="w-10 h-10 rounded-full bg-jungle/90 border border-gold/30 flex items-center justify-center text-gold shadow-lg">
              <Sparkle className="w-5 h-5 fill-gold/10" />
            </div>
          </div>

          {/* Content info */}
          <div className="relative z-10 p-6 sm:p-8 pt-0 space-y-4">
            <span className="text-[10px] text-gold tracking-[0.2em] uppercase font-bold block">Since 2019</span>
            <h2 className="font-display text-3xl text-ivory tracking-wide leading-none group-hover:text-gold transition-colors">
              The Brand Story
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ivory/80 leading-relaxed max-w-sm">
              Discover how handcrafted, animal-inspired fashion pieces are designed and created in our Indian studios, supporting traditional metalwork and global conservation.
            </p>
            <div className="pt-2">
              <Link
                href="/about/brand"
                className="inline-flex items-center gap-2 bg-gold hover-shimmer text-jungle px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all rounded-lg shadow-lg active:scale-95"
              >
                Explore Our Brand <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: Meet the Founder */}
        <div className="group relative rounded-2xl overflow-hidden border border-border bg-forest h-[400px] sm:h-[450px] md:h-[500px] flex flex-col justify-between shadow-xl">
          {/* Background image with parallax scale zoom */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-65 group-hover:opacity-85 transition-all duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=800&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-jungle/50 via-transparent to-jungle/95" />

          {/* Icon Badge */}
          <div className="relative z-10 p-6 sm:p-8 flex justify-end">
            <div className="w-10 h-10 rounded-full bg-jungle/90 border border-gold/30 flex items-center justify-center text-gold shadow-lg">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          {/* Content info */}
          <div className="relative z-10 p-6 sm:p-8 pt-0 space-y-4">
            <span className="text-[10px] text-gold tracking-[0.2em] uppercase font-bold block">The Visionary</span>
            <h2 className="font-display text-3xl text-ivory tracking-wide leading-none group-hover:text-gold transition-colors">
              Meet Kanika
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ivory/80 leading-relaxed max-w-sm">
              Read the story of Kanika’s passion for wildlife, her formal training in fine metalsmithing, and her vision of transforming environmental consciousness into luxury wearable art.
            </p>
            <div className="pt-2">
              <Link
                href="/about/founder"
                className="inline-flex items-center gap-2 bg-gold hover-shimmer text-jungle px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all rounded-lg shadow-lg active:scale-95"
              >
                Meet the Founder <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
