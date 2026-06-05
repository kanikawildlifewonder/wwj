import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTIONS_LIST } from "@/lib/mock-data";
import { ProductCard } from "@/components/shop/ProductCard";
import prisma from "@/lib/prisma";

const COLLECTION_MAP: Record<string, string> = {
  jewellery: "WWJ Jewellery",
  accessories: "WWA Accessories",
  gifting: "Gifting Collection",
};

const CATEGORY_MAP: Record<string, string[]> = {
  jewellery: ["necklaces", "earrings", "rings", "bracelets"],
  accessories: ["accessories", "bags"],
  gifting: ["gifting"],
};

const COLLECTION_IMAGES: Record<string, string> = {
  jewellery: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1600&auto=format&fit=crop",
  accessories: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=1600&auto=format&fit=crop",
  gifting: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1600&auto=format&fit=crop",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collectionName = COLLECTION_MAP[slug];
  if (!collectionName) notFound();

  // Fetch products that match the categories in this collection
  const categories = CATEGORY_MAP[slug] || [];
  const products = await prisma.product.findMany({
    where: {
      category: { in: categories }
    },
    orderBy: { createdAt: 'desc' }
  });

  const collectionInfo = COLLECTIONS_LIST.find((c) => c.slug === slug);

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${COLLECTION_IMAGES[slug]})` }} />
        <div className="absolute inset-0 bg-jungle/70" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-8 h-[1px] bg-gold/50" />
            <Link href="/collections" className="text-gold text-xs tracking-widest uppercase">Collections</Link>
            <span className="w-8 h-[1px] bg-gold/50" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-ivory">{collectionName}</h1>
          <p className="text-ivory/70 mt-4 text-sm font-sans">{collectionInfo?.description}</p>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <p className="text-sm text-jungle/50 mb-8">
          Showing <span className="font-bold text-jungle">{products.length}</span> pieces in this collection
        </p>
        {products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-jungle/30">No products in this collection yet</p>
            <Link href="/shop" className="mt-6 inline-block border border-jungle/30 text-jungle px-6 py-2 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-jungle hover:text-ivory transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p: any) => {
              const uiProduct: any = {
                ...p,
                slug: p.id,
                longDescription: p.description,
                collection: collectionName,
                animalInspiration: "Wildlife",
                material: "Standard",
                colors: [],
                stockCount: p.inStock ? 10 : 0,
                sku: p.id.substring(0, 8).toUpperCase(),
                isBestseller: p.featured,
                isNewArrival: false,
                rating: 5,
                reviewCount: 12,
                features: [],
                careInstructions: "",
                tags: []
              };
              return <ProductCard key={p.id} product={uiProduct} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
