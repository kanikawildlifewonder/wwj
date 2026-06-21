"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useCartStore, useWishlistStore } from "@/store/cartStore";
import { formatINR, calculateDiscount } from "@/lib/utils/currency";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  theme?: "light" | "dark";
}

export function ProductCard({ product, theme = "light" }: ProductCardProps) {
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

  const isDark = theme === "dark";

  return (
    <Link 
      href={`/products/${product.id}`} 
      className={cn(
        "group flex flex-col h-full rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xs transition-all duration-300",
        isDark
          ? "bg-forest/30 hover:bg-forest/65 border border-gold/10 hover:border-gold/45 shadow-xs hover:shadow-lg hover:shadow-gold/5 hover:-translate-y-1 text-ivory"
          : "bg-white/50 hover:bg-white/95 backdrop-blur-xs border border-jungle/10 hover:border-gold/60 hover:-translate-y-1 shadow-xs hover:shadow-md text-jungle"
      )}
    >
      <div className={cn(
        "relative aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-2.5 sm:mb-3.5 border shrink-0",
        isDark ? "bg-forest border-gold/5" : "bg-cream border-jungle/5"
      )}>
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.isBestseller && (
            <span className={cn(
              "px-2 py-0.5 text-[9px] font-bold tracking-widest rounded",
              isDark ? "bg-gold text-jungle" : "bg-jungle/90 backdrop-blur text-gold"
            )}>
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className={cn(
              "px-2 py-0.5 text-[9px] font-bold tracking-widest rounded",
              isDark ? "bg-jungle text-gold border border-gold/20" : "bg-gold text-jungle"
            )}>
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
          className={cn(
            "absolute top-3 right-3 z-10 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-1 md:group-hover:translate-y-0",
            isWishlisted
              ? "bg-red-50 text-red-500"
              : isDark
                ? "bg-jungle/80 text-ivory hover:text-red-400 border border-gold/15"
                : "bg-ivory/80 text-jungle hover:text-red-400"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Image */}
        <Image
          src={product.images[0] || "/images/products/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Add */}
        <motion.button
          onClick={handleAddToCart}
          className={cn(
            "absolute bottom-0 left-0 right-0 z-10 py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300",
            isDark
              ? "bg-gold text-jungle hover:bg-gold-light"
              : "bg-jungle/90 backdrop-blur-sm text-gold hover:bg-charcoal"
          )}
          whileTap={{ scale: 0.97 }}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Quick Add
        </motion.button>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 sm:gap-1.5 px-0.5 sm:px-1 flex-1 justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-[10px] uppercase tracking-widest font-semibold",
            isDark ? "text-gold/70" : "text-gold-dark/80"
          )}>
            {product.animalInspiration ? `${product.animalInspiration} · ` : ""}{product.category}
          </p>
          <h3 className={cn(
            "font-sans font-medium text-xs sm:text-sm leading-tight transition-colors line-clamp-2",
            isDark ? "text-ivory group-hover:text-gold" : "text-jungle group-hover:text-charcoal"
          )}>
            {product.name}
          </h3>
        </div>

        <div className={cn(
          "space-y-2 mt-auto pt-2.5 border-t",
          isDark ? "border-gold/10" : "border-jungle/5"
        )}>
          <div className="flex items-center gap-1.5">
            <div className="flex text-gold">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(product.rating || 5) ? "fill-current" : "opacity-35"}`}
                />
              ))}
            </div>
            <span className={cn(
              "text-[10px]",
              isDark ? "text-ivory/40" : "text-jungle/50"
            )}>({product.reviewCount || 0})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={cn(
              "font-sans font-bold text-xs sm:text-sm",
              isDark ? "text-gold" : "text-jungle"
            )}>{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className={cn(
                "font-sans text-xs line-through",
                isDark ? "text-ivory/30" : "text-jungle/40"
              )}>
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
