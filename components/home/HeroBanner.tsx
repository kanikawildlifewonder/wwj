"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export function HeroBanner({
  title = "WEAR <br /> THE WILD",
  subtitle = "Celebrate Nature. Inspire Change.",
  buttonText = "Shop Collection",
  bgImage = "/images/hero_leopard.webp",
}: {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  bgImage?: string;
}) {
  const imageSrc = bgImage || "/images/hero_leopard.webp";

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] min-h-125 sm:min-h-150 flex items-center justify-center overflow-hidden bg-jungle">
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt="Hero Banner Background"
        fill
        priority
        className="absolute inset-0 z-0 opacity-60 object-cover object-center transition-transform duration-[10s] ease-out hover:scale-105"
        unoptimized={imageSrc.startsWith("http")}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-0 bg-linear-to-t from-jungle via-jungle/40 to-transparent" />
      <div className="absolute inset-0 z-0 bg-linear-to-r from-jungle/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-4 lg:px-8 flex flex-col items-start pt-12 sm:pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-px bg-gold" />
            <span className="font-sans text-gold text-sm tracking-[0.2em] uppercase font-bold">WWJ</span>
            <span className="w-12 h-px bg-gold" />
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-ivory mb-2 tracking-tight" dangerouslySetInnerHTML={{ __html: title }} />
          
          <p className="font-serif text-xl sm:text-2xl md:text-3xl text-ivory/90 italic mb-4 sm:mb-6">
            {subtitle}
          </p>
          
          <p className="font-sans text-sm md:text-base text-ivory/80 max-w-md mb-6 sm:mb-10 leading-relaxed">
            Handcrafted wildlife-inspired jewellery and accessories that tell a story of beauty, strength and the wild.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/collections" 
              className="bg-gold text-jungle px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-gold-light transition-colors text-center"
            >
              {buttonText}
            </Link>
            <Link 
              href="/about" 
              className="border border-gold text-gold px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-gold/10 transition-colors text-center"
            >
              Explore Our Story
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Conservation Badge */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-10 hidden sm:flex items-center justify-center w-24 h-24 md:w-36 md:h-36 rounded-full border border-gold/30 bg-jungle/60 backdrop-blur-sm p-3 md:p-4 text-center"
      >
        <p className="text-[10px] text-ivory/80 uppercase tracking-widest leading-relaxed">
          A portion of selected sales supports wildlife conservation
        </p>
      </motion.div>
    </section>
  );
}
