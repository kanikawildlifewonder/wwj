"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Package,
  RotateCcw,
  Shield,
  Truck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";
import { motion } from "motion/react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCartStore, useWishlistStore } from "@/store/cartStore";
import { Product, Review } from "@/types/product";
import { calculateDiscount, formatINR } from "@/lib/utils/currency";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";
import { getPageContent } from "@/app/actions/content";

type ProductDetailRecord = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  video?: string | null;
  category: string;
  mainCategory?: string;
  inStock: boolean;
  featured?: boolean;
  originalPrice?: number;
  animalInspiration?: string;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
};

type MediaItem =
  | { type: "image"; url: string }
  | { type: "video"; url: string };

type ProductDetailClientProps = {
  product: ProductDetailRecord;
  related: ProductDetailRecord[];
  reviews: Review[];
};

export default function ProductDetailClient({
  product,
  related,
  reviews,
}: ProductDetailClientProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addItem, openCart } = useCartStore();
  const { toggle, hasItem } = useWishlistStore();
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

  const mediaList = useMemo<MediaItem[]>(() => {
    const list: MediaItem[] = (product.images || []).map((image) => ({
      type: "image",
      url: image,
    }));

    if (product.video) {
      list.push({ type: "video", url: product.video });
    }

    return list;
  }, [product.images, product.video]);

  const currentMedia = mediaList[selectedMediaIndex];
  const isWishlisted = hasItem(product.id);
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : null;

  const resetVideoState = () => {
    setIsPlaying(false);
    setIsMuted(true);
    setVideoProgress(0);
  };

  const selectMedia = (index: number) => {
    setSelectedMediaIndex(index);
    resetVideoState();
  };

  const togglePlay = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }

    void videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const toggleMute = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!videoRef.current) return;

    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setVideoProgress(progress || 0);
  };

  const handleFullscreen = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!videoRef.current?.requestFullscreen) return;
    void videoRef.current.requestFullscreen();
  };

  const handleAddToCart = () => {
    const cartProduct: Product = mapDbProductToUI(product);

    for (let index = 0; index < quantity; index += 1) {
      addItem(cartProduct);
    }

    openCart();
  };

  return (
    <div className="bg-ivory min-h-screen">
      <div className="bg-cream border-b border-jungle/10 py-3">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 flex items-center gap-2 text-xs text-jungle/50 overflow-x-auto hide-scrollbar">
          <Link href="/" className="hover:text-jungle">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-jungle">
            Shop
          </Link>
          <span>/</span>
          <span className="text-jungle font-medium truncate max-w-50 sm:max-w-none">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-cream flex items-center justify-center">
              {currentMedia?.type === "video" ? (
                <div
                  className="relative w-full h-full bg-black group/video flex items-center justify-center cursor-pointer"
                  onClick={togglePlay}
                >
                  <video
                    ref={videoRef}
                    src={currentMedia.url}
                    loop
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-contain"
                    preload="none"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center text-jungle shadow-lg scale-100 hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 z-20">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="w-8 h-8 rounded-full bg-ivory/80 backdrop-blur shrink-0 flex items-center justify-center text-jungle hover:bg-white hover:text-charcoal transition-all shadow"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="w-8 h-8 rounded-full bg-ivory/80 backdrop-blur shrink-0 flex items-center justify-center text-jungle hover:bg-white hover:text-charcoal transition-all shadow"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={handleFullscreen}
                      className="w-8 h-8 rounded-full bg-ivory/80 backdrop-blur shrink-0 flex items-center justify-center text-jungle hover:bg-white hover:text-charcoal transition-all shadow"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20 pointer-events-none">
                    <div
                      className="h-full bg-gold transition-all duration-100"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <Image
                  src={currentMedia?.url || "/images/products/placeholder.png"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={selectedMediaIndex === 0}
                  className="object-cover transition-all duration-500"
                />
              )}

              {mediaList.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      selectMedia(
                        (selectedMediaIndex - 1 + mediaList.length) % mediaList.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ivory/80 backdrop-blur flex items-center justify-center text-jungle hover:bg-ivory transition-colors shadow z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => selectMedia((selectedMediaIndex + 1) % mediaList.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ivory/80 backdrop-blur flex items-center justify-center text-jungle hover:bg-ivory transition-colors shadow z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {mediaList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-jungle/10">
                {mediaList.map((media, index) => (
                  <button
                    key={`${media.type}-${media.url}`}
                    onClick={() => selectMedia(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors shrink-0 relative ${selectedMediaIndex === index ? "border-gold" : "border-transparent"}`}
                  >
                    {media.type === "video" ? (
                      <div className="w-full h-full bg-black/80 flex flex-col items-center justify-center relative">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt="Video thumbnail background"
                            fill
                            sizes="80px"
                            className="object-cover opacity-40"
                          />
                        )}
                        <Play className="w-6 h-6 text-gold fill-current z-10" />
                        <span className="text-[10px] text-ivory font-bold tracking-wider uppercase mt-1 z-10">
                          Video
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={media.url}
                        alt={`${product.name} thumbnail ${index}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {product.featured && (
                <span className="bg-jungle text-gold px-3 py-1 text-[10px] font-bold tracking-widest rounded">
                  BESTSELLER
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-gold text-jungle px-3 py-1 text-[10px] font-bold tracking-widest rounded">
                  NEW ARRIVAL
                </span>
              )}
              {discount && (
                <span className="bg-red-100 text-red-700 px-3 py-1 text-[10px] font-bold tracking-widest rounded">
                  {discount}% OFF
                </span>
              )}
            </div>

            <div>
              <p className="text-xs text-gold uppercase tracking-widest font-medium mb-1">
                {product.animalInspiration || "Wildlife"} / {product.category}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-charcoal leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-jungle/40 mt-1">
                SKU: {product.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(product.rating || 5) ? "fill-current" : "opacity-30"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-jungle/70">
                {product.rating || 5} ({product.reviewCount || 10} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl sm:text-3xl text-jungle">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-jungle/40 line-through text-lg">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="font-sans text-sm text-jungle/80 leading-relaxed">
              {product.description}
            </p>

            <div
              className={`text-sm font-medium flex items-center gap-2 ${product.inStock ? "text-emerald-700" : "text-red-600"}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-500"}`}
              />
              {product.inStock ? "In Stock" : "Out of Stock"}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-jungle">Qty:</span>
              <div className="flex items-center gap-0 border border-jungle/20 rounded-btn overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-jungle hover:bg-jungle/10 transition-colors text-lg font-light"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium text-jungle min-w-10 text-center border-x border-jungle/20">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-4 py-2 text-jungle hover:bg-jungle/10 transition-colors text-lg font-light"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-jungle text-gold py-4 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-charcoal transition-colors rounded-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toggle(mapDbProductToUI(product))}
                className={`px-4 py-4 border-2 rounded-btn transition-all ${isWishlisted ? "border-red-400 text-red-500 bg-red-50" : "border-jungle/20 text-jungle hover:border-jungle"}`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { icon: Truck, title: "Free Shipping", desc: `On orders above ₹${shippingThreshold}` },
                { icon: RotateCcw, title: "Easy Returns", desc: "Within 7 days" },
                { icon: Shield, title: "Secure Payment", desc: "100% safe checkout" },
                { icon: Package, title: "Artisan Made", desc: "Handcrafted in India" },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-3 bg-cream rounded-lg border border-jungle/10"
                >
                  <Icon className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-jungle">{title}</p>
                    <p className="text-[11px] text-jungle/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <section className="mt-20 pt-12 border-t border-jungle/10">
            <h2 className="font-display text-2xl text-jungle mb-8">
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-cream rounded-xl p-6 border border-jungle/10"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-gold text-gold" : "text-jungle/20"}`}
                      />
                    ))}
                  </div>
                  <h4 className="font-sans font-bold text-sm text-jungle mb-1">
                    {review.title}
                  </h4>
                  <p className="text-sm text-jungle/70 leading-relaxed mb-3">
                    {review.body}
                  </p>
                  <div className="flex items-center justify-between text-xs text-jungle/40">
                    <span className="font-medium">- {review.author}</span>
                    {review.verified && (
                      <span className="text-emerald-600">Verified Purchase</span>
                    )}
                  </div>
                  <p className="text-[10px] text-jungle/30 mt-1 italic">
                    Demo review for illustrative purposes only
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-jungle/10">
            <h2 className="font-display text-2xl text-jungle mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {related.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={mapDbProductToUI(relatedProduct)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
