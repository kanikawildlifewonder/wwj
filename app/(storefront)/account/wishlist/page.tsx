"use client";

import React from "react";
import Link from "next/link";
import { User, Package, Heart, MapPin, SearchX } from "lucide-react";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { useWishlistStore } from "@/store/cartStore";
import { ProductCard } from "@/components/shop/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const isHydrated = useHydrated();

  if (!isHydrated) return null;

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-jungle py-8 sm:py-12 text-center border-b border-border">
        <h1 className="font-display text-3xl sm:text-4xl text-ivory">My Account</h1>
        <p className="font-sans text-sm text-ivory/60 mt-2">Manage your profile, orders & wishlist</p>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar — horizontal scroll on mobile, vertical on desktop */}
          <div className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <Link href="/account" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-2.5 px-4 py-3 bg-jungle text-gold rounded-lg transition-colors whitespace-nowrap text-sm font-medium flex-shrink-0">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </Link>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-5 sm:p-8 rounded-xl border border-jungle/10 shadow-sm">
              <h2 className="font-display text-xl sm:text-2xl text-jungle mb-6">Saved Items</h2>

              {items.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <SearchX className="w-12 h-12 text-jungle/20 mb-4" />
                  <p className="text-lg font-serif text-jungle">Your wishlist is empty</p>
                  <p className="text-jungle/60 mb-6">Save your favourite wildlife pieces here for later.</p>
                  <Link href="/shop" className="bg-jungle text-gold px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-charcoal transition-colors">
                    Explore Collections
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
