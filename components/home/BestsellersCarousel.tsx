import React from "react";
import Link from "next/link";
import { Heart, Star, ChevronLeft, ChevronRight, PawPrint } from "lucide-react";

const BESTSELLERS = [
  {
    id: 1,
    name: "Leopard Pendant Set",
    price: "1,899",
    rating: 4.9,
    reviews: 128,
    image: "/images/products/leopard_pendant.png",
    badge: "BESTSELLER",
  },
  {
    id: 2,
    name: "Owl Wisdom Ring",
    price: "999",
    rating: 4.8,
    reviews: 96,
    image: "/images/products/owl_ring.png",
    badge: null,
  },
  {
    id: 3,
    name: "Butterfly Earrings",
    price: "1,299",
    rating: 4.7,
    reviews: 74,
    image: "/images/products/butterfly_earrings.png",
    badge: null,
  },
  {
    id: 4,
    name: "Deer Antler Necklace",
    price: "1,599",
    rating: 4.9,
    reviews: 118,
    image: "/images/products/deer_necklace.png",
    badge: null,
  },
  {
    id: 5,
    name: "Panda Charm Keychain",
    price: "499",
    rating: 4.8,
    reviews: 45,
    image: "/images/products/panda_keychain.png",
    badge: null,
  },
];

export function BestsellersCarousel() {
  return (
    <section className="bg-jungle py-20 border-b border-border text-ivory relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
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

        {/* Carousel Container */}
        <div className="relative group">
          
          {/* Navigation Buttons */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-forest border border-border shadow-lg flex items-center justify-center text-ivory/70 hover:text-gold hover:border-gold transition-colors opacity-0 group-hover:opacity-100 hidden md:flex">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-forest border border-border shadow-lg flex items-center justify-center text-ivory/70 hover:text-gold hover:border-gold transition-colors opacity-0 group-hover:opacity-100 hidden md:flex">
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Product Grid (Carousel simulation for now) */}
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
            {BESTSELLERS.map((product) => (
              <div key={product.id} className="min-w-[260px] max-w-[280px] flex-none snap-start group/card cursor-pointer">
                
                {/* Image Container */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-forest mb-4 border border-border">
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10 bg-gold/90 backdrop-blur px-2 py-1 text-[9px] font-bold tracking-widest text-jungle rounded">
                      {product.badge}
                    </div>
                  )}
                  <button className="absolute bottom-3 right-3 z-10 w-8 h-8 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center text-jungle hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0">
                    <Heart className="w-4 h-4" />
                  </button>
                  <div 
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover/card:scale-105"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 px-1">
                  <h3 className="font-sans font-medium text-sm text-ivory leading-tight group-hover/card:text-gold transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-ivory/50">({product.reviews})</span>
                  </div>
                  
                  <div className="mt-1 font-sans font-bold text-sm text-gold">
                    ₹{product.price}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
