"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  featured?: boolean | null;
  mainCategory?: string | null;
};

export function BestsellersCarouselClient({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, products]);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll by ~2 card widths
    const cardWidth = el.querySelector("a")?.offsetWidth ?? 280;
    el.scrollBy({ left: dir === "left" ? -(cardWidth * 2 + 24) : (cardWidth * 2 + 24), behavior: "smooth" });
  };

  if (products.length === 0) {
    return (
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
    );
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-20 -translate-x-3
          w-10 h-10 rounded-full bg-jungle border border-gold/40 text-gold shadow-lg
          flex items-center justify-center
          hover:bg-gold hover:text-jungle transition-all duration-200
          disabled:opacity-0 disabled:pointer-events-none
        `}
        disabled={!canScrollLeft}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 z-20 translate-x-3
          w-10 h-10 rounded-full bg-jungle border border-gold/40 text-gold shadow-lg
          flex items-center justify-center
          hover:bg-gold hover:text-jungle transition-all duration-200
          disabled:opacity-0 disabled:pointer-events-none
        `}
        disabled={!canScrollRight}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scroll track */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory hide-scrollbar scroll-smooth px-1"
      >
        {products.map((product) => {
          const uiProduct = mapDbProductToUI({
            ...product,
            featured: product.featured ?? undefined,
            mainCategory: product.mainCategory ?? undefined,
          });
          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="min-w-[200px] sm:min-w-[260px] max-w-[280px] flex-none snap-start group/card bg-forest/30 hover:bg-forest/65 border border-gold/10 hover:border-gold/40 rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-forest mb-3.5 border border-gold/5 flex-shrink-0">
                <div className="absolute top-3 left-3 z-10 bg-gold/90 backdrop-blur px-2 py-0.5 text-[9px] font-bold tracking-widest text-jungle rounded">
                  BESTSELLER
                </div>
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover/card:scale-105"
                  style={{ backgroundImage: `url(${product.images[0] ?? "/images/products/placeholder.png"})` }}
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
    </div>
  );
}
