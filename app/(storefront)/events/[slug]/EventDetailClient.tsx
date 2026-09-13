"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Share2, ArrowLeft, ExternalLink, Globe, Play, X } from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils/currency";

type EventDetails = {
  id: string;
  title: string;
  slug: string;
  category: string;
  featuredImage: string;
  galleryImages: string[];
  shortDescription: string;
  fullDescription: string;
  eventDate: string; // ISO String
  location: string | null;
  partnerName: string | null;
  partnerLogo: string | null;
  partnerWebsite: string | null;
  videoUrl: string | null;
};

type RelatedProduct = {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
};

export default function EventDetailClient({
  event,
  relatedProducts,
}: {
  event: EventDetails;
  relatedProducts: RelatedProduct[];
}) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = `Check out "${event.title}" by Wildlife Wonder Jewellery!`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
  };

  const shareOnPinterest = () => {
    const url = window.location.href;
    const desc = event.shortDescription;
    const img = event.featuredImage;
    window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(img)}&description=${encodeURIComponent(desc)}`, "_blank");
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Video embed url generator
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com(?:\/video|\/channels\/[^\/]+|\/groups\/[^\/]+\/videos)?\/([0-9]+)/i);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return null;
  };

  const embedUrl = event.videoUrl ? getEmbedUrl(event.videoUrl) : null;
  const isDirectVideo = event.videoUrl && !embedUrl;

  const allGalleryImages = [event.featuredImage, ...event.galleryImages].filter(Boolean);

  return (
    <div className="bg-ivory min-h-screen pb-24 text-jungle">
      {/* Dynamic Header / Back navigation */}
      <div className="bg-cream border-b border-jungle/10 py-3 sm:py-4">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 flex items-center justify-between">
          <NextLink
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-jungle/60 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back To Events
          </NextLink>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-jungle/90 text-gold uppercase tracking-wider">
            {event.category}
          </span>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] w-full overflow-hidden bg-jungle">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-100"
          style={{ backgroundImage: `url(${event.featuredImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 md:p-12 text-ivory">
          <div className="container mx-auto px-4 lg:px-8 space-y-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm text-gold">
              <span className="flex items-center gap-2 font-bold tracking-wider uppercase">
                <Calendar className="w-4 h-4" />
                {new Date(event.eventDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
              {event.location && (
                <span className="flex items-center gap-2 font-bold tracking-wider uppercase">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight max-w-4xl">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16">
          
          {/* Left Columns - Rich Text and Media details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Short Snippet Box */}
            <div className="bg-cream/40 border-l-4 border-gold p-6 rounded-r-2xl">
              <p className="font-sans italic text-base md:text-lg text-jungle/80 leading-relaxed font-medium">
                &ldquo;{event.shortDescription}&rdquo;
              </p>
            </div>

            {/* Full description */}
            <article className="prose prose-jungle max-w-none text-jungle/80 leading-relaxed">
              <div 
                className="whitespace-pre-line font-sans text-sm md:text-base space-y-6"
                dangerouslySetInnerHTML={{ __html: event.fullDescription }}
              />
            </article>

            {/* Gallery Section */}
            {allGalleryImages.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-jungle/10">
                <h3 className="font-serif text-2xl text-jungle">Media Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {allGalleryImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-cream border border-jungle/5 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
                    >
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${image})` }}
                      />
                      <div className="absolute inset-0 bg-jungle/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] text-white font-bold tracking-widest uppercase border border-white/30 px-3 py-1.5 rounded bg-jungle/50">
                          Zoom Image
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Showcase Player */}
            {event.videoUrl && (
              <div className="space-y-6 pt-6 border-t border-jungle/10">
                <h3 className="font-serif text-2xl text-jungle">Video Coverage</h3>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-jungle/10 shadow-lg relative">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title="Video Coverage"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : isDirectVideo ? (
                    <video
                      src={event.videoUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-ivory/60 p-6">
                      <Play className="w-12 h-12 text-gold mb-3 animate-pulse" />
                      <p className="text-sm font-medium">Link Available</p>
                      <a
                        href={event.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold hover:underline mt-2 font-bold tracking-wider"
                      >
                        WATCH ON EXTERNAL HOST <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social sharing widget */}
            <div className="pt-8 border-t border-jungle/10 flex flex-wrap items-center justify-between gap-6">
              <span className="text-xs font-bold tracking-widest uppercase text-jungle/50">
                Share this Story
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={shareOnTwitter}
                  className="px-4 py-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/20 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  Twitter
                </button>
                <button
                  onClick={shareOnFacebook}
                  className="px-4 py-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/20 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  Facebook
                </button>
                <button
                  onClick={shareOnPinterest}
                  className="px-4 py-2 bg-[#BD081C]/10 hover:bg-[#BD081C]/20 text-[#BD081C] border border-[#BD081C]/20 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  Pinterest
                </button>
                <button
                  onClick={copyLinkToClipboard}
                  className="flex items-center gap-1.5 px-4 py-2 bg-jungle/5 hover:bg-jungle/10 text-jungle border border-jungle/10 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-8">
            
            {/* Collaborator / Partner Card */}
            {event.partnerName && (
              <div className="bg-white rounded-2xl border border-jungle/10 p-6 shadow-xs space-y-6">
                <h4 className="font-serif text-lg text-jungle border-b border-jungle/5 pb-3">
                  Collaboration Partner
                </h4>
                <div className="flex items-center gap-4">
                  {event.partnerLogo ? (
                    <div
                      className="w-16 h-16 rounded-xl bg-cream border border-jungle/5 bg-contain bg-center bg-no-repeat flex-shrink-0"
                      style={{ backgroundImage: `url(${event.partnerLogo})` }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-cream border border-jungle/5 flex items-center justify-center text-jungle/30 flex-shrink-0">
                      <Globe className="w-8 h-8" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-jungle truncate">{event.partnerName}</p>
                    <p className="text-xs text-jungle/50">Official Partner</p>
                  </div>
                </div>

                {event.partnerWebsite && (
                  <a
                    href={event.partnerWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center bg-jungle text-gold hover:bg-charcoal py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all block flex items-center justify-center gap-2"
                  >
                    Visit Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Related Products widget */}
            {relatedProducts.length > 0 && (
              <div className="bg-white rounded-2xl border border-jungle/10 p-6 shadow-xs space-y-6">
                <h4 className="font-serif text-lg text-jungle border-b border-jungle/5 pb-3">
                  Related Products
                </h4>
                <div className="space-y-4">
                  {relatedProducts.map((p) => (
                    <NextLink
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="flex items-center gap-4 group hover:bg-cream/10 p-1.5 rounded-xl transition-all"
                    >
                      <div
                        className="w-16 h-16 rounded-xl bg-cream border border-jungle/5 bg-cover bg-center flex-shrink-0 overflow-hidden"
                        style={{ backgroundImage: `url(${p.images[0] || "/images/products/placeholder.png"})` }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-jungle group-hover:text-gold transition-colors truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-jungle/40 uppercase tracking-wider">{p.category}</p>
                        <p className="text-xs font-bold text-gold mt-1">{formatINR(p.price)}</p>
                      </div>
                    </NextLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Popup zoom Modal */}
      {activeImageIndex !== null && (
        <div
          onClick={() => setActiveImageIndex(null)}
          className="fixed inset-0 bg-jungle/95 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 cursor-zoom-out animate-fade-in"
        >
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 text-ivory/60 hover:text-ivory bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[85vh] aspect-auto relative"
          >
            <Image
              src={allGalleryImages[activeImageIndex]}
              alt="Gallery Preview Zoomed"
              fill
              className="object-contain rounded-xl shadow-2xl border border-white/10"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
