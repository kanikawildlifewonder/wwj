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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-serif text-jungle mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <Link href="/account" className="flex items-center gap-3 p-3 hover:bg-ivory/50 rounded-md transition-colors text-jungle/80">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link href="/account/orders" className="flex items-center gap-3 p-3 hover:bg-ivory/50 rounded-md transition-colors text-jungle/80">
            <Package className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          <Link href="/account/wishlist" className="flex items-center gap-3 p-3 bg-jungle text-ivory rounded-md transition-colors">
            <Heart className="w-5 h-5" />
            <span>Wishlist</span>
          </Link>
          <Link href="/account/addresses" className="flex items-center gap-3 p-3 hover:bg-ivory/50 rounded-md transition-colors text-jungle/80">
            <MapPin className="w-5 h-5" />
            <span>Addresses</span>
          </Link>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <h2 className="text-2xl font-serif text-jungle mb-6">Saved Items</h2>

          {items.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-lg border border-border shadow-sm flex flex-col items-center">
              <SearchX className="w-12 h-12 text-jungle/20 mb-4" />
              <p className="text-lg font-serif text-jungle">Your wishlist is empty</p>
              <p className="text-jungle/60 mb-6">Save your favourite wildlife pieces here for later.</p>
              <Link href="/shop" className="bg-jungle text-gold px-6 py-2 text-sm font-bold tracking-widest uppercase rounded-btn hover:bg-charcoal transition-colors">
                Explore Collections
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
