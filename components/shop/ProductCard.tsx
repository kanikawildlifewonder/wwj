"use client";

import React from "react";
import Link from "next/link";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useCartStore, useWishlistStore } from "@/store/cartStore";
import { formatINR, calculateDiscount } from "@/lib/utils/currency";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const { toggle, hasItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    openCart();
  };

  return (
    <Link 
      href={`/products/${product.id}`} 
      className="group flex flex-col h-full bg-white/50 hover:bg-white/95 backdrop-blur-xs border border-jungle/10 hover:border-gold/60 rounded-2xl p-3 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-cream mb-3.5 border border-jungle/5 flex-shrink-0">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isBestseller && (
            <span className="bg-jungle/90 backdrop-blur text-gold px-2 py-0.5 text-[9px] font-bold tracking-widest rounded">
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-gold text-jungle px-2 py-0.5 text-[9px] font-bold tracking-widest rounded">
              NEW
            </span>
          )}
          {discount && (
            <span className="bg-red-600/90 backdrop-blur text-white px-2 py-0.5 text-[9px] font-bold tracking-widest rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product); }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all
            ${isWishlisted ? "bg-red-50 text-red-500" : "bg-ivory/80 text-jungle hover:text-red-400"}
            opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-1 md:group-hover:translate-y-0`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Image */}
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${product.images[0]})` }}
        />

        {/* Quick Add */}
        <motion.button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 z-10 bg-jungle/90 backdrop-blur-sm text-gold py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          whileTap={{ scale: 0.97 }}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Quick Add
        </motion.button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5 px-1 flex-1 justify-between">
        <div className="space-y-1">
          <p className="text-[10px] text-gold-dark/80 uppercase tracking-widest font-semibold">
            {product.animalInspiration ? `${product.animalInspiration} · ` : ""}{product.category}
          </p>
          <h3 className="font-sans font-medium text-sm text-jungle leading-tight group-hover:text-charcoal transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        <div className="space-y-2 mt-auto pt-2.5 border-t border-jungle/5">
          <div className="flex items-center gap-1.5">
            <div className="flex text-gold">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(product.rating) ? "fill-current" : "opacity-30"}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-jungle/50">({product.reviewCount})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-sm text-jungle">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="font-sans text-xs text-jungle/40 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
