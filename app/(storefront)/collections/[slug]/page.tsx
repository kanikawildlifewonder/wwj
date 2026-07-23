import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

const COLLECTION_MAP: Record<string, string> = {
  jewellery: "WWJ Jewellery",
  accessories: "WWA Accessories",
  gifting: "Gifting Collection",
};

const COLLECTION_IMAGES: Record<string, string> = {
  jewellery: "/images/collections/jewellery_banner.webp",
  accessories: "/images/collections/accessories_banner.webp",
  gifting: "/images/collections/gifting_box.webp",
};

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const titleMap: Record<string, string> = {
    jewellery: "WWJ Jewellery | Handcrafted Animal-Inspired Fine Jewelry",
    accessories: "WWA Accessories | Unique Animal Keychains, Magnets & Collectibles",
    gifting: "Gifting Collection | Luxury Curated Jewelry Gift Boxes & Gift Cards",
  };

  const descMap: Record<string, string> = {
    jewellery: "Explore the premium WWJ jewellery collection. Handcrafted rings, necklaces, bracelets, and earrings inspired by wildlife, crafted in 925 sterling silver and brass.",
    accessories: "Discover unique handcrafted accessories by Wildlife Wonder. Buy wild animal keychains, fridge magnets, hair accessories, bookmarks, and customized pet portraits.",
    gifting: "Shop luxury curated gift sets and gift cards for wildlife lovers. Perfect presents featuring handcrafted animal-inspired jewelry and festive collections.",
  };

  const title = titleMap[slug] || "Collections | WWJ";
  const description = descMap[slug] || "Browse our themed collections of wildlife-inspired jewellery and handcrafted accessories.";

  return {
    title,
    description,
    alternates: {
      canonical: `/collections/${slug}`,
    },
    openGraph: {
      title: `${title} - WWJ`,
      description,
      url: `/collections/${slug}`,
      type: "website",
    },
  };
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

export const revalidate = 300;

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
          { category: { in: ["Gift Boxes", "Festive Collections", "Friendship Day", "Gift Cards"] } },
          { category: { contains: "Gift" } }
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
    return keywords.some(kw => {
      // Prevent "ring" matching "earring" / "earrings"
      if (kw === "ring" || kw === "rings") {
        if (name.includes("earring") || name.includes("stud") || name.includes("jhumka") || name.includes("hoop") || name.includes("dangle")) {
          return false;
        }
        return name.includes("ring") || name.includes("band");
      }
      return name.includes(kw);
    });
  };

  const mapProducts = (products: DbProduct[]) => products.map(mapDbProductToUI);

  if (slug === "jewellery") {
    // 1. Necklaces
    const necklaces = rawProducts.filter(p => checkCategory(p.category, ["necklace", "choker", "pendant"]));
    // 2. Earrings (Evaluated before rings)
    const earrings = rawProducts.filter(p => checkCategory(p.category, ["earring", "stud", "jhumka", "hoop", "dangle"]));
    // 3. Rings
    const rings = rawProducts.filter(p => checkCategory(p.category, ["ring", "band"]));
    // 4. Bracelets
    const bracelets = rawProducts.filter(p => checkCategory(p.category, ["bracelet", "bangle", "kada"]));
    // 5. Sets & Combos
    const sets = rawProducts.filter(p => checkCategory(p.category, ["set", "combo"]));

    // 6. Remaining products grouped by exact category name
    const groupedIds = new Set([
      ...necklaces.map(p => p.id),
      ...earrings.map(p => p.id),
      ...rings.map(p => p.id),
      ...bracelets.map(p => p.id),
      ...sets.map(p => p.id)
    ]);
    const others = rawProducts.filter(p => !groupedIds.has(p.id));

    if (necklaces.length > 0) sections.push({ title: "Necklaces", products: mapProducts(necklaces) });
    if (earrings.length > 0) sections.push({ title: "Earrings", products: mapProducts(earrings) });
    if (rings.length > 0) sections.push({ title: "Rings", products: mapProducts(rings) });
    if (bracelets.length > 0) sections.push({ title: "Bracelets", products: mapProducts(bracelets) });
    if (sets.length > 0) sections.push({ title: "Sets & Combos", products: mapProducts(sets) });

    const otherCatMap: Record<string, DbProduct[]> = {};
    for (const prod of others) {
      const cName = prod.category ? prod.category.trim() : "Fine Jewellery";
      if (!otherCatMap[cName]) otherCatMap[cName] = [];
      otherCatMap[cName].push(prod);
    }
    for (const [cName, prods] of Object.entries(otherCatMap)) {
      if (prods.length > 0) sections.push({ title: cName, products: mapProducts(prods) });
    }

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

    const otherCatMap: Record<string, DbProduct[]> = {};
    for (const prod of others) {
      const cName = prod.category ? prod.category.trim() : "Accessories";
      if (!otherCatMap[cName]) otherCatMap[cName] = [];
      otherCatMap[cName].push(prod);
    }
    for (const [cName, prods] of Object.entries(otherCatMap)) {
      if (prods.length > 0) sections.push({ title: cName, products: mapProducts(prods) });
    }

  } else if (slug === "gifting") {
    // Dynamically group products in gifting by their exact category name (e.g. Friendship Day, Gift Boxes, etc.)
    const catMap: Record<string, DbProduct[]> = {};
    for (const prod of rawProducts) {
      const catName = prod.category ? prod.category.trim() : "Gift Collection";
      if (!catMap[catName]) catMap[catName] = [];
      catMap[catName].push(prod);
    }

    for (const [catName, prods] of Object.entries(catMap)) {
      if (prods.length > 0) {
        sections.push({ title: catName, products: mapProducts(prods) });
      }
    }
  }

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
      <div className="w-full relative aspect-video overflow-hidden bg-ivory">
        {COLLECTION_IMAGES[slug] ? (
          <Image
            src={COLLECTION_IMAGES[slug]}
            alt={collectionName}
            fill
            priority
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-jungle/10 to-transparent pointer-events-none" />
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8 border-b border-jungle/10 pb-6">
          <h1 className="font-display text-xl sm:text-2xl text-jungle font-semibold">{collectionName}</h1>
          <p className="text-sm text-jungle/60">
            Showing <span className="font-bold text-jungle">{rawProducts.length}</span> pieces
          </p>
        </div>



        {categoryQuery && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gold/10 border border-gold/20 rounded-card p-4 mb-8 gap-4">
            <p className="text-sm text-jungle">
              Showing only <span className="font-bold uppercase tracking-wider">{categoryQuery}</span> in {collectionName}
            </p>
            <Link
              href={`/collections/${slug}`}
              className="inline-block text-center text-xs font-bold text-jungle uppercase tracking-widest border border-jungle/20 px-4 py-2 hover:border-gold hover:bg-jungle hover:text-ivory transition-all rounded-btn"
            >
              Clear Filter / Show All
            </Link>
          </div>
        )}

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
                  <span className="w-full h-px bg-gold/30" />
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
