import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS_LIST } from "@/lib/mock-data";

export default function CollectionsPage() {
  const collectionsWithImages = [
    { ...COLLECTIONS_LIST[0], image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop" },
    { ...COLLECTIONS_LIST[1], image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=800&auto=format&fit=crop" },
    { ...COLLECTIONS_LIST[2], image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop" },
  ];

  return (
    <div className="bg-jungle min-h-screen">
      {/* Header */}
      <div className="py-20 text-center border-b border-border">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="w-10 h-[1px] bg-gold/50" />
          <span className="text-gold text-xs tracking-[0.2em] uppercase font-bold">Explore</span>
          <span className="w-10 h-[1px] bg-gold/50" />
        </div>
        <h1 className="font-display text-5xl text-ivory">Our Collections</h1>
        <p className="text-ivory/60 text-sm mt-4 font-sans max-w-lg mx-auto">Three worlds of wildlife wonder, each crafted with love and inspired by the beauty of nature.</p>
      </div>

      {/* Collection Cards */}
      <div className="container mx-auto px-4 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {collectionsWithImages.map((col) => (
          <Link key={col.slug} href={`/collections/${col.slug}`} className="group relative h-[500px] rounded-card overflow-hidden border border-border block">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60" style={{ backgroundImage: `url(${col.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-jungle/50 to-jungle/95" />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <h2 className="font-display text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">{col.name}</h2>
              <p className="text-ivory/70 text-sm mb-6">{col.description}</p>
              <div className="flex items-center gap-2 text-gold text-sm font-bold tracking-wider uppercase group-hover:gap-4 transition-all">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
