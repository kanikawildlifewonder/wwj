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
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-cream mb-4 border border-jungle/10">
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
            opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0`}
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
      <div className="flex flex-col gap-1.5 px-1">
        <p className="text-[10px] text-gold/70 uppercase tracking-widest font-medium">
          {product.animalInspiration} · {product.category}
        </p>
        <h3 className="font-sans font-medium text-sm text-jungle leading-tight group-hover:text-charcoal transition-colors">
          {product.name}
        </h3>

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

        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-sans font-bold text-sm text-jungle">{formatINR(product.price)}</span>
          {product.originalPrice && (
            <span className="font-sans text-xs text-jungle/40 line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
