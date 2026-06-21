"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";
import { ProductCard } from "@/components/shop/ProductCard";

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
              <div
                key={product.id}
                className="min-w-[200px] sm:min-w-[260px] max-w-[280px] flex-none snap-start"
              >
                <ProductCard product={uiProduct} theme="dark" />
              </div>
            );
        })}
      </div>
    </div>
  );
}
