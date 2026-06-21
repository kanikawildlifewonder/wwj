import React from "react";
import { PawPrint } from "lucide-react";
import { getFeaturedProducts } from "@/app/actions/products";
import { BestsellersCarouselClient } from "./BestsellersCarouselClient";

export async function BestsellersCarousel() {
  const products = await getFeaturedProducts();

  return (
    <section className="bg-jungle py-12 sm:py-20 border-b border-border text-ivory relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-8 h-px bg-gold/30" />
            <span className="text-gold text-xs tracking-[0.2em] uppercase font-bold flex items-center">
              <PawPrint className="w-3 h-3 inline-block mr-2" />
              Bestsellers
            </span>
            <span className="w-8 h-px bg-gold/30" />
          </div>
        </div>

        {/* Client carousel with arrows */}
        <BestsellersCarouselClient products={products} />
      </div>
    </section>
  );
}
