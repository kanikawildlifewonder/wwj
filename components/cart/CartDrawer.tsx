"use client";

import React from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/utils/currency";

export function CartDrawer({ threshold = 1499 }: { threshold?: number }) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 z-100 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-105 bg-jungle border-l border-border z-101 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-display text-lg text-ivory tracking-wide">
                  Your Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-ivory/60 hover:text-ivory transition-colors p-1"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-20">
                  <ShoppingBag className="w-12 h-12 text-gold/30" />
                  <p className="font-display text-xl text-ivory/60">Your cart is empty</p>
                  <p className="text-sm text-ivory/40">Add some wildlife-inspired pieces!</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 border border-gold text-gold px-6 py-2 text-xs font-bold tracking-widest uppercase hover:bg-gold hover:text-jungle transition-all rounded-btn"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 pb-6 border-b border-border last:border-0"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-forest">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.product.images[0]})` }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans text-sm font-medium text-ivory leading-tight mb-1 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gold mb-3">{formatINR(item.product.price)}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-border rounded-btn px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="text-ivory/60 hover:text-ivory transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm text-ivory font-medium w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="text-ivory/60 hover:text-ivory transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-ivory/40 hover:text-red-400 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-6 space-y-4 bg-forest/40">
                {subtotal() < threshold && (
                  <p className="text-xs text-ivory/60 text-center bg-gold/10 border border-gold/20 rounded px-3 py-2">
                    Add {formatINR(threshold - subtotal())} more for <span className="text-gold font-bold">FREE SHIPPING</span>
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-ivory/70">Subtotal</span>
                  <span className="font-display text-xl text-gold">{formatINR(subtotal())}</span>
                </div>
                <p className="text-[11px] text-ivory/40 text-center">Shipping & taxes calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-gold text-jungle py-4 text-sm font-bold tracking-widest uppercase text-center hover:bg-gold-light transition-colors rounded-btn"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-xs text-ivory/50 hover:text-ivory transition-colors underline"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
