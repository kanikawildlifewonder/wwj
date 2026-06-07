import React from "react";
import Link from "next/link";
import { Star, PawPrint, ChevronRight } from "lucide-react";
import { getFeaturedProducts } from "@/app/actions/products";
import { formatINR } from "@/lib/utils/currency";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";

export async function BestsellersCarousel() {
  const products = await getFeaturedProducts();

  return (
    <section className="bg-jungle py-20 border-b border-border text-ivory relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-8 h-[1px] bg-gold/30" />
            <span className="text-gold text-xs tracking-[0.2em] uppercase font-bold flex items-center">
              <PawPrint className="w-3 h-3 inline-block mr-2" />
              Bestsellers
            </span>
            <span className="w-8 h-[1px] bg-gold/30" />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-ivory/60 text-sm mb-4">
              No bestsellers yet. Mark products as bestseller in the admin panel.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-gold/50 text-gold px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-gold hover:text-jungle transition-all rounded-btn"
            >
              Browse Shop <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
            {products.map((product) => {
              const uiProduct = mapDbProductToUI(product);

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="min-w-[260px] max-w-[280px] flex-none snap-start group/card bg-forest/30 hover:bg-forest/65 border border-gold/10 hover:border-gold/40 rounded-2xl p-3 shadow-xs hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-forest mb-3.5 border border-gold/5 flex-shrink-0">
                    <div className="absolute top-3 left-3 z-10 bg-gold/90 backdrop-blur px-2 py-0.5 text-[9px] font-bold tracking-widest text-jungle rounded">
                      BESTSELLER
                    </div>
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover/card:scale-105"
                      style={{
                        backgroundImage: `url(${product.images[0] ?? "/images/products/placeholder.png"})`,
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 px-1 flex-1 justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gold/70 uppercase tracking-widest font-semibold">
                        {uiProduct.animalInspiration} / {uiProduct.category}
                      </p>
                      <h3 className="font-sans font-medium text-sm text-ivory leading-tight group-hover/card:text-gold transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="space-y-2 mt-auto pt-2.5 border-t border-gold/10">
                      <div className="flex items-center gap-1">
                        <div className="flex text-gold">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <div className="font-sans font-bold text-sm text-gold">
                        {formatINR(product.price)}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
