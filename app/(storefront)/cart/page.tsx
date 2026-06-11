"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/utils/currency";
import { ProductCard } from "@/components/shop/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { getPageContent } from "@/app/actions/content";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const [shippingThreshold, setShippingThreshold] = useState(1499);

  useEffect(() => {
    getPageContent("store-settings").then((raw) => {
      if (raw) {
        try {
          const s = JSON.parse(raw);
          if (typeof s.shippingThreshold === "number") setShippingThreshold(s.shippingThreshold);
        } catch { /* keep default */ }
      }
    });
  }, []);

  const shippingFee = subtotal() >= shippingThreshold ? 0 : 99;
  const total = subtotal() + shippingFee;
  const suggested = MOCK_PRODUCTS.filter((p) => !items.some((i) => i.product.id === p.id)).slice(0, 4);

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-jungle">Shopping Cart</h1>
          <p className="text-sm text-jungle/50 mt-1">{items.length} {items.length === 1 ? "item" : "items"}</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <ShoppingBag className="w-16 h-16 text-jungle/20" />
            <p className="font-display text-2xl text-jungle/40">Your cart is empty</p>
            <p className="text-sm text-jungle/30">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop" className="mt-4 bg-jungle text-gold px-8 py-3 text-sm font-bold tracking-widest uppercase rounded-btn hover:bg-charcoal transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-5 p-5 bg-ivory rounded-xl border border-jungle/10 shadow-sm">
                  <Link href={`/products/${item.product.slug}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-cream">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.product.images[0]})` }} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`} className="font-sans font-medium text-sm text-jungle hover:text-gold transition-colors leading-tight block">
                      {item.product.name}
                    </Link>
                    <p className="text-[11px] text-jungle/50 mt-0.5">{item.product.animalInspiration} · {item.product.category}</p>
                    <p className="font-sans font-bold text-sm text-jungle mt-2">{formatINR(item.product.price)}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-0 border border-jungle/20 rounded-btn overflow-hidden">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1.5 text-jungle hover:bg-jungle/10 transition-colors text-sm">−</button>
                        <span className="px-4 py-1.5 text-sm font-medium text-jungle border-x border-jungle/20">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1.5 text-jungle hover:bg-jungle/10 transition-colors text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="text-jungle/30 hover:text-red-500 transition-colors p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="p-5 bg-ivory rounded-xl border border-jungle/10 flex gap-3">
                <Tag className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-jungle mb-3">Have a coupon code?</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter coupon code" className="flex-1 border border-jungle/20 px-4 py-2 text-sm text-jungle rounded-btn focus:outline-none focus:border-gold bg-cream placeholder:text-jungle/30" />
                    <button className="bg-jungle text-gold px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-charcoal transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-ivory rounded-xl border border-jungle/10 p-6 space-y-5 sticky top-28">
                <h2 className="font-display text-xl text-jungle">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-jungle/70">
                    <span>Subtotal</span>
                    <span className="font-medium text-jungle">{formatINR(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-jungle/70">
                    <span>Shipping</span>
                    <span className={shippingFee === 0 ? "text-emerald-600 font-medium" : "font-medium text-jungle"}>
                      {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                    </span>
                  </div>
                </div>

                {subtotal() < shippingThreshold && (
                  <div className="bg-gold/10 border border-gold/20 rounded-btn px-4 py-3 text-xs text-jungle/80">
                    Add <span className="font-bold text-gold">{formatINR(shippingThreshold - subtotal())}</span> more to get <span className="font-bold text-gold">FREE SHIPPING</span>!
                  </div>
                )}

                <div className="border-t border-jungle/10 pt-4 flex justify-between items-center">
                  <span className="font-bold text-jungle">Total</span>
                  <span className="font-display text-2xl text-jungle">{formatINR(total)}</span>
                </div>
                <p className="text-[11px] text-jungle/40">GST included where applicable</p>

                <Link href="/checkout" className="block w-full bg-jungle text-gold py-4 text-sm font-bold tracking-widest uppercase text-center hover:bg-charcoal transition-colors rounded-btn">
                  Proceed to Checkout <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>

                <Link href="/shop" className="block text-center text-xs text-jungle/40 hover:text-jungle transition-colors">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like */}
        {suggested.length > 0 && (
          <section className="mt-20 border-t border-jungle/10 pt-12">
            <h2 className="font-display text-2xl text-jungle mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {suggested.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
