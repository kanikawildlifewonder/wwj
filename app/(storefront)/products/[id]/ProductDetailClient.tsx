"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingBag, ChevronLeft, ChevronRight, Package, RotateCcw, Shield, Truck, Play } from "lucide-react";
import { motion } from "motion/react";
import { useCartStore, useWishlistStore } from "@/store/cartStore";
import { formatINR, calculateDiscount } from "@/lib/utils/currency";
import { ProductCard } from "@/components/shop/ProductCard";

export default function ProductDetailClient({ product, reviews, related }: { product: any, reviews: any[], related: any[] }) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const { toggle, hasItem } = useWishlistStore();
  
  const isWishlisted = hasItem(product.id);
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : null;
  const inStock = product.inStock;

  const mediaList = useMemo(() => {
    const list = (product.images || []).map((img: string) => ({ type: 'image', url: img }));
    if (product.video) {
      list.push({ type: 'video', url: product.video });
    }
    return list;
  }, [product.images, product.video]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    openCart();
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-jungle/10 py-3">
        <div className="container mx-auto px-4 lg:px-8 flex items-center gap-2 text-xs text-jungle/50">
          <Link href="/" className="hover:text-jungle">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-jungle">Shop</Link>
          <span>/</span>
          <span className="text-jungle font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-cream flex items-center justify-center">
              {mediaList[selectedMediaIndex]?.type === 'video' ? (
                <video
                  src={mediaList[selectedMediaIndex].url}
                  controls
                  playsInline
                  className="w-full h-full object-contain bg-black"
                  preload="metadata"
                />
              ) : (
                <div
                  className="w-full h-full bg-cover bg-center transition-all duration-500"
                  style={{ backgroundImage: `url(${mediaList[selectedMediaIndex]?.url || '/images/products/placeholder.png'})` }}
                />
              )}
              {mediaList.length > 1 && (
                <>
                  <button onClick={() => setSelectedMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ivory/80 backdrop-blur flex items-center justify-center text-jungle hover:bg-ivory transition-colors shadow z-10">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setSelectedMediaIndex((prev) => (prev + 1) % mediaList.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ivory/80 backdrop-blur flex items-center justify-center text-jungle hover:bg-ivory transition-colors shadow z-10">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {mediaList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-jungle/10">
                {mediaList.map((media: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMediaIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 relative ${selectedMediaIndex === idx ? "border-gold" : "border-transparent"}`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-black/80 flex flex-col items-center justify-center relative">
                        {product.images?.[0] && (
                          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${product.images[0]})` }} />
                        )}
                        <Play className="w-6 h-6 text-gold fill-current z-10" />
                        <span className="text-[10px] text-ivory font-bold tracking-wider uppercase mt-1 z-10">Video</span>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${media.url})` }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.featured && <span className="bg-jungle text-gold px-3 py-1 text-[10px] font-bold tracking-widest rounded">BESTSELLER</span>}
              {product.isNewArrival && <span className="bg-gold text-jungle px-3 py-1 text-[10px] font-bold tracking-widest rounded">NEW ARRIVAL</span>}
              {discount && <span className="bg-red-100 text-red-700 px-3 py-1 text-[10px] font-bold tracking-widest rounded">{discount}% OFF</span>}
            </div>

            <div>
              <p className="text-xs text-gold uppercase tracking-widest font-medium mb-1">{product.animalInspiration || 'Wildlife'} · {product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl text-charcoal leading-tight">{product.name}</h1>
              <p className="text-xs text-jungle/40 mt-1">SKU: {product.id.slice(0, 8).toUpperCase()}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating || 5) ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <span className="text-sm text-jungle/70">{product.rating || 5} ({product.reviewCount || 10} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl text-jungle">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <span className="text-jungle/40 line-through text-lg">{formatINR(product.originalPrice)}</span>
              )}
            </div>

            {/* Description */}
            <p className="font-sans text-sm text-jungle/80 leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className={`text-sm font-medium flex items-center gap-2 ${inStock ? "text-emerald-700" : "text-red-600"}`}>
              <div className={`w-2 h-2 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              {inStock ? "In Stock" : "Out of Stock"}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-jungle">Qty:</span>
              <div className="flex items-center gap-0 border border-jungle/20 rounded-btn overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-jungle hover:bg-jungle/10 transition-colors text-lg font-light">−</button>
                <span className="px-4 py-2 text-sm font-medium text-jungle min-w-[40px] text-center border-x border-jungle/20">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="px-4 py-2 text-jungle hover:bg-jungle/10 transition-colors text-lg font-light">+</button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 bg-jungle text-gold py-4 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-charcoal transition-colors rounded-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toggle(product)}
                className={`px-4 py-4 border-2 rounded-btn transition-all ${isWishlisted ? "border-red-400 text-red-500 bg-red-50" : "border-jungle/20 text-jungle hover:border-jungle"}`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: Truck, title: "Free Shipping", desc: "On orders above ₹1499" },
                { icon: RotateCcw, title: "Easy Returns", desc: "Within 7 days" },
                { icon: Shield, title: "Secure Payment", desc: "100% safe checkout" },
                { icon: Package, title: "Artisan Made", desc: "Handcrafted in India" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3 bg-cream rounded-lg border border-jungle/10">
                  <Icon className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-jungle">{title}</p>
                    <p className="text-[11px] text-jungle/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <section className="mt-20 pt-12 border-t border-jungle/10">
            <h2 className="font-display text-2xl text-jungle mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-cream rounded-xl p-6 border border-jungle/10">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-gold text-gold" : "text-jungle/20"}`} />)}
                  </div>
                  <h4 className="font-sans font-bold text-sm text-jungle mb-1">{review.title}</h4>
                  <p className="text-sm text-jungle/70 leading-relaxed mb-3">{review.body}</p>
                  <div className="flex items-center justify-between text-xs text-jungle/40">
                    <span className="font-medium">— {review.author}</span>
                    {review.verified && <span className="text-emerald-600">✓ Verified Purchase</span>}
                  </div>
                  <p className="text-[10px] text-jungle/30 mt-1 italic">Demo review — for illustrative purposes only</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-jungle/10">
            <h2 className="font-display text-2xl text-jungle mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
