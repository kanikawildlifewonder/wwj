import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { COLLECTIONS_LIST } from "@/lib/mock-data";
import { ProductCard } from "@/components/shop/ProductCard";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";
import prisma from "@/lib/prisma";

const COLLECTION_MAP: Record<string, string> = {
  jewellery: "WWJ Jewellery",
  accessories: "WWA Accessories",
  gifting: "Gifting Collection",
};

const COLLECTION_IMAGES: Record<string, string> = {
  jewellery: "/images/collections/jewellery_banner.jpg",
  accessories: "/images/collections/accessories_banner.jpg",
  gifting: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop",
};

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}

type DbProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  video: string | null;
  mainCategory: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { category } = await searchParams;
  const categoryQuery = typeof category === "string" ? category : Array.isArray(category) ? category[0] : undefined;

  const collectionName = COLLECTION_MAP[slug];
  if (!collectionName) notFound();

  // Fetch products that match this collection by mainCategory or category fallback
  let rawProducts: DbProduct[] = [];
  if (slug === "jewellery") {
    rawProducts = await prisma.product.findMany({
      where: {
        mainCategory: "wwj",
        // Exclude specific accessory categories to avoid mix-matching
        category: {
          notIn: ["Keychains", "Magnets", "Coffee Mugs", "Customise your own pet", "Hair Accessories", "Bookmarks"]
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } else if (slug === "accessories") {
    rawProducts = await prisma.product.findMany({
      where: {
        OR: [
          { mainCategory: "wwa" },
          { category: { in: ["Keychains", "Magnets", "Hair Accessories", "Coffee Mugs", "Customise your own pet", "Bookmarks"] } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  } else if (slug === "gifting") {
    rawProducts = await prisma.product.findMany({
      where: {
        OR: [
          { mainCategory: "gift_cards" },
          { category: { in: ["Gift Boxes", "Combo", "Sets", "Festive Collections"] } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Group products into sections based on slug
  interface SectionGroup {
    title: string;
    products: ReturnType<typeof mapDbProductToUI>[];
  }
  const sections: SectionGroup[] = [];

  const checkCategory = (categoryName: string, keywords: string[]) => {
    const name = (categoryName || "").toLowerCase().trim();
    return keywords.some(kw => name.includes(kw));
  };

  const mapProducts = (products: DbProduct[]) => products.map(mapDbProductToUI);

  if (slug === "jewellery") {
    // 1. Necklaces
    const necklaces = rawProducts.filter(p => checkCategory(p.category, ["necklace"]));
    // 2. Rings
    const rings = rawProducts.filter(p => checkCategory(p.category, ["ring"]));
    // 3. Earrings
    const earrings = rawProducts.filter(p => checkCategory(p.category, ["earring", "stud"]));
    // 4. Bracelets
    const bracelets = rawProducts.filter(p => checkCategory(p.category, ["bracelet"]));
    // 5. Sets & Combos
    const sets = rawProducts.filter(p => checkCategory(p.category, ["set", "combo"]));
    
    // 6. Others
    const groupedIds = new Set([
      ...necklaces.map(p => p.id),
      ...rings.map(p => p.id),
      ...earrings.map(p => p.id),
      ...bracelets.map(p => p.id),
      ...sets.map(p => p.id)
    ]);
    const others = rawProducts.filter(p => !groupedIds.has(p.id));

    if (necklaces.length > 0) sections.push({ title: "Necklaces", products: mapProducts(necklaces) });
    if (rings.length > 0) sections.push({ title: "Rings", products: mapProducts(rings) });
    if (earrings.length > 0) sections.push({ title: "Earrings", products: mapProducts(earrings) });
    if (bracelets.length > 0) sections.push({ title: "Bracelets", products: mapProducts(bracelets) });
    if (sets.length > 0) sections.push({ title: "Sets & Combos", products: mapProducts(sets) });
    if (others.length > 0) sections.push({ title: "Other Jewellery Pieces", products: mapProducts(others) });

  } else if (slug === "accessories") {
    // 1. Keychains & Charms
    const keychains = rawProducts.filter(p => checkCategory(p.category, ["keychain", "charm"]));
    // 2. Fridge Magnets
    const magnets = rawProducts.filter(p => checkCategory(p.category, ["magnet"]));
    // 3. Hair Accessories
    const hair = rawProducts.filter(p => checkCategory(p.category, ["hair", "clip", "headband", "hairband", "band"]));
    // 4. Coffee Mugs
    const mugs = rawProducts.filter(p => checkCategory(p.category, ["mug", "mugs", "coffee"]));
    // 5. Bookmarks
    const bookmarks = rawProducts.filter(p => checkCategory(p.category, ["bookmark"]));
    // 6. Custom Pet Portraits
    const customPet = rawProducts.filter(p => checkCategory(p.category, ["pet", "customise"]));
    
    const groupedIds = new Set([
      ...keychains.map(p => p.id),
      ...magnets.map(p => p.id),
      ...hair.map(p => p.id),
      ...mugs.map(p => p.id),
      ...bookmarks.map(p => p.id),
      ...customPet.map(p => p.id),
    ]);
    const others = rawProducts.filter(p => !groupedIds.has(p.id));

    if (keychains.length > 0) sections.push({ title: "Keychains & Charms", products: mapProducts(keychains) });
    if (magnets.length > 0) sections.push({ title: "Fridge Magnets", products: mapProducts(magnets) });
    if (hair.length > 0) sections.push({ title: "Hair Accessories", products: mapProducts(hair) });
    if (mugs.length > 0) sections.push({ title: "Coffee Mugs", products: mapProducts(mugs) });
    if (bookmarks.length > 0) sections.push({ title: "Bookmarks", products: mapProducts(bookmarks) });
    if (customPet.length > 0) sections.push({ title: "Custom Pet Portraits", products: mapProducts(customPet) });
    if (others.length > 0) sections.push({ title: "Other Collectibles", products: mapProducts(others) });

  } else if (slug === "gifting") {
    // 1. Gift Boxes
    const boxes = rawProducts.filter(p => checkCategory(p.category, ["gift box", "gift boxes", "box", "boxes"]));
    // 2. Combos & Gift Sets
    const sets = rawProducts.filter(p => checkCategory(p.category, ["combo", "set", "sets"]));
    // 3. Festive & Special
    const festive = rawProducts.filter(p => checkCategory(p.category, ["festive", "special", "celebration"]));

    const groupedIds = new Set([
      ...boxes.map(p => p.id),
      ...sets.map(p => p.id),
      ...festive.map(p => p.id)
    ]);
    const others = rawProducts.filter(p => !groupedIds.has(p.id));

    if (boxes.length > 0) sections.push({ title: "Curated Gift Boxes", products: mapProducts(boxes) });
    if (sets.length > 0) sections.push({ title: "Combos & Gift Sets", products: mapProducts(sets) });
    if (festive.length > 0) sections.push({ title: "Festive & Special Collections", products: mapProducts(festive) });
    if (others.length > 0) sections.push({ title: "Other Gift Options", products: mapProducts(others) });
  }

  const collectionInfo = COLLECTIONS_LIST.find((c) => c.slug === slug);

  // Filter sections by category query if present
  let filteredSections = sections;
  if (categoryQuery) {
    const queryLower = categoryQuery.toLowerCase().trim();
    filteredSections = sections.filter(sec => {
      const titleLower = sec.title.toLowerCase();
      if (titleLower.includes(queryLower)) return true;
      if (queryLower === "magnets" && titleLower.includes("magnet")) return true;
      if (queryLower === "keychains" && titleLower.includes("keychain")) return true;
      if (queryLower === "hair accessories" && titleLower.includes("hair")) return true;
      if (queryLower === "customise your own pet" && titleLower.includes("pet")) return true;
      return false;
    });
  }

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      {slug === "gifting" ? (
        <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
          {COLLECTION_IMAGES[slug] ? (
            <Image
              src={COLLECTION_IMAGES[slug]}
              alt={collectionName}
              fill
              priority
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-jungle/70" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-8 h-[1px] bg-gold/50" />
              <Link href="/collections" className="text-gold text-xs tracking-widest uppercase">Collections</Link>
              <span className="w-8 h-[1px] bg-gold/50" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-ivory">{collectionName}</h1>
            <p className="text-ivory/70 mt-4 text-sm font-sans max-w-lg">{collectionInfo?.description}</p>
          </div>
        </div>
      ) : (
        <div className="w-full relative aspect-[16/9] overflow-hidden bg-ivory">
          {COLLECTION_IMAGES[slug] ? (
            <Image
              src={COLLECTION_IMAGES[slug]}
              alt={collectionName}
              fill
              priority
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-jungle/10 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Products */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {categoryQuery && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gold/10 border border-gold/20 rounded-card p-4 mb-8 gap-4">
            <p className="text-sm text-jungle">
              Showing only <span className="font-bold uppercase tracking-wider">{categoryQuery}</span> in {collectionName}
            </p>
            <Link
              href={`/collections/${slug}`}
              className="inline-block text-center text-xs font-bold text-jungle hover:text-gold uppercase tracking-widest border border-jungle/20 px-4 py-2 hover:border-gold hover:bg-jungle hover:text-ivory transition-all rounded-btn"
            >
              Clear Filter / Show All
            </Link>
          </div>
        )}

        <p className="text-sm text-jungle/50 mb-8">
          Showing <span className="font-bold text-jungle">{rawProducts.length}</span> pieces in this collection
        </p>
        
        {rawProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-jungle/30">No products in this collection yet</p>
            <Link href="/shop" className="mt-6 inline-block border border-jungle/30 text-jungle px-6 py-2 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-jungle hover:text-ivory transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-jungle/30">No products found in this category yet</p>
            <Link href={`/collections/${slug}`} className="mt-6 inline-block border border-jungle/30 text-jungle px-6 py-2 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-jungle hover:text-ivory transition-colors">
              View All {collectionName}
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredSections.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-2xl text-jungle tracking-wide whitespace-nowrap">{section.title}</h2>
                  <span className="w-full h-[1px] bg-gold/30" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {section.products.map((p) => (
                    <ProductCard key={p.id} product={mapDbProductToUI({ ...p, mainCategory: collectionName })} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
