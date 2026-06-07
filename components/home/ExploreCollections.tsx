import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Gem, Link as LinkIcon, Gift } from "lucide-react";

export type CollectionCard = {
  title: string;
  description: string;
  image: string;
  link: string;
  subLinks: { name: string; icon: "Sparkles" | "Gem" | "LinkIcon" | "Gift" }[];
};

const ICON_MAP = { Sparkles, Gem, LinkIcon, Gift };

const DEFAULT_COLLECTIONS: CollectionCard[] = [
  {
    title: "WWJ JEWELLERY",
    description: "Handcrafted animal-inspired fashion pieces.",
    image: "/images/products/peacock_necklace.png",
    link: "/collections/jewellery",
    subLinks: [
      { name: "Necklace", icon: "Sparkles" },
      { name: "Rings", icon: "Gem" },
      { name: "Earrings", icon: "Sparkles" },
      { name: "Bracelets", icon: "LinkIcon" },
    ],
  },
  {
    title: "WWA ACCESSORIES",
    description: "Cute everyday wildlife collectibles.",
    image: "/images/products/elephant_keychain.png",
    link: "/collections/accessories",
    subLinks: [
      { name: "Keychains", icon: "LinkIcon" },
      { name: "Magnets", icon: "Sparkles" },
    ],
  },
  {
    title: "GIFTING COLLECTION",
    description: "Ready-to-gift pieces & curated sets for every occasion.",
    image: "/images/collections/gifting_box.png",
    link: "/collections/gifting",
    subLinks: [
      { name: "Gift Boxes", icon: "Gift" },
      { name: "Combo", icon: "Gift" },
      { name: "Sets", icon: "Sparkles" },
      { name: "Festive Collections", icon: "Sparkles" },
    ],
  },
];

export function ExploreCollections({
  collections = DEFAULT_COLLECTIONS,
}: {
  collections?: CollectionCard[];
}) {
  // Merge DB-overrides into defaults (image/title/description only; keep subLinks from default)
  const merged = DEFAULT_COLLECTIONS.map((def, i) => {
    const override = collections[i];
    if (!override) return def;
    return {
      ...def,
      title: override.title || def.title,
      description: override.description || def.description,
      image: override.image || def.image,
    };
  });

  return (
    <section className="bg-jungle py-20 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">

        <div className="text-center mb-12 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-8 h-[1px] bg-gold/50" />
            <span className="text-gold text-xs tracking-[0.2em] uppercase font-bold">
              <Sparkles className="w-3 h-3 inline-block mr-2" />
              Explore Our Collections
            </span>
            <span className="w-8 h-[1px] bg-gold/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {merged.map((col, idx) => {
            return (
              <div key={idx} className="group relative rounded-card overflow-hidden border border-border bg-forest h-[450px] flex flex-col justify-between">

                {/* Background Image */}
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  style={{ backgroundImage: `url(${col.image})` }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-jungle/80 via-transparent to-jungle/90 group-hover:opacity-70 transition-opacity duration-700" />

                {/* Top Content */}
                <div className="relative z-10 p-8 flex flex-col items-start">
                  <h3 className="font-display text-3xl text-ivory mb-2 tracking-tight group-hover:text-gold transition-colors">{col.title}</h3>
                  <p className="font-sans text-sm text-ivory/80 mb-6">{col.description}</p>

                  <Link
                    href={col.link}
                    className="flex items-center gap-2 border border-gold/50 text-gold px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-jungle transition-all rounded-btn"
                  >
                    Explore <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Bottom Sub-links */}
                <div className="relative z-10 p-6 pt-0 mt-auto flex justify-center gap-6 border-t border-border/30 w-full pt-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  {col.subLinks.map((sub, sidx) => {
                    const Icon = ICON_MAP[sub.icon] ?? Sparkles;
                    return (
                      <Link href={`${col.link}?category=${sub.name.toLowerCase()}`} key={sidx} className="flex flex-col items-center gap-1 hover:text-gold transition-colors text-ivory">
                        <Icon className="w-4 h-4 text-gold/70" />
                        <span className="text-[10px] tracking-wider uppercase text-center">{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
