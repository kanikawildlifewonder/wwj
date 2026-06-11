import React from "react";
import Link from "next/link";
import { ArrowRight, Pencil } from "lucide-react";
import { COLLECTIONS_LIST } from "@/lib/mock-data";
import { getPageContent } from "@/app/actions/content";
import { currentUser } from "@clerk/nextjs/server";

export const metadata = {
  title: "Collections | WWJ — Wildlife Wonder Jewellery",
  description:
    "Explore WWJ Jewellery, WWA Accessories and our Gifting Collection — handcrafted wildlife-inspired pieces for every occasion.",
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
];

const DEFAULT_DESCRIPTIONS = [
  "Handcrafted animal-inspired fashion pieces.",
  "Cute everyday wildlife collectibles.",
  "Ready-to-gift pieces & curated sets.",
];

export default async function CollectionsPage() {
  // Load admin-saved images/descriptions
  let savedCollections: { title?: string; description?: string; image?: string }[] = [];
  try {
    const raw = await getPageContent("home-collections");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) savedCollections = parsed;
    }
  } catch { /* use defaults */ }

  const collections = COLLECTIONS_LIST.map((col, i) => ({
    ...col,
    description: savedCollections[i]?.description || DEFAULT_DESCRIPTIONS[i],
    image: savedCollections[i]?.image || DEFAULT_IMAGES[i],
  }));

  // Show edit button only for admin users
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="bg-jungle min-h-screen">

      {/* ── Admin edit FAB (no onClick — plain Link is fine in server component) ── */}
      {isAdmin && (
        <Link
          href="/admin/pages"
          className="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-gold text-jungle px-4 py-2.5 rounded-full shadow-xl text-xs font-bold tracking-wide hover:bg-ivory transition-colors"
          title="Edit collection thumbnails in admin"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Thumbnails
        </Link>
      )}

      {/* Header */}
      <div className="py-12 sm:py-20 text-center border-b border-border px-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="w-10 h-[1px] bg-gold/50" />
          <span className="text-gold text-xs tracking-[0.2em] uppercase font-bold">Explore</span>
          <span className="w-10 h-[1px] bg-gold/50" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory">Our Collections</h1>
        <p className="text-ivory/60 text-sm mt-4 font-sans max-w-lg mx-auto">
          Three worlds of wildlife wonder, each crafted with love and inspired by the beauty of nature.
        </p>
      </div>

      {/* Collection Cards */}
      <div className="container mx-auto px-4 lg:px-8 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {collections.map((col) => (
          <div key={col.slug} className="relative group">

            {/* Per-card admin edit icon — plain Link, no event handlers */}
            {isAdmin && (
              <Link
                href="/admin/pages"
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-gold/90 text-jungle rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gold"
                title={`Edit ${col.name} card`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Link>
            )}

            <Link
              href={`/collections/${col.slug}`}
              className="relative h-[350px] sm:h-[420px] md:h-[500px] rounded-card overflow-hidden border border-border block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                style={{ backgroundImage: `url(${col.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-jungle/50 to-jungle/95" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <h2 className="font-display text-3xl text-ivory mb-2 group-hover:text-gold transition-colors">
                  {col.name}
                </h2>
                <p className="text-ivory/70 text-sm mb-6">{col.description}</p>
                <div className="flex items-center gap-2 text-gold text-sm font-bold tracking-wider uppercase group-hover:gap-4 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
