"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { UserButton, SignInButton, Show } from "@clerk/nextjs";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { cn } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/cartStore";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "STYLING TIPS", href: "/faq" },
  { label: "EVENTS & COLLABORATIONS", href: "/events" },
  { label: "ABOUT BRAND", href: "/about/brand" },
  { label: "FOUNDER", href: "/about/founder" },
  { label: "CONTACT US", href: "/contact" },
];

type HeaderProps = {
  logoImageUrl?: string;
  logoText?: string;
  logoTagline?: string;
};

export function Header({
  logoImageUrl,
  logoText = "WWJ",
  logoTagline = "Wildlife Wonder Jewellery",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const isHydrated = useHydrated();
  const cartCount = totalItems();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-jungle/95 backdrop-blur-md border-border shadow-lg"
          : "bg-jungle border-transparent"
      )}
    >
      <div
        className={cn(
          "container mx-auto px-3 sm:px-4 lg:px-8 flex items-center justify-between transition-all duration-300",
          isScrolled
            ? "h-[60px] md:h-[70px]"
            : "h-[80px] md:h-[120px] lg:h-[140px]"
        )}
      >

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-ivory p-2 -ml-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex flex-col items-center justify-center -space-y-1 group">
          {logoImageUrl ? (
            <div
              className={cn(
                "w-auto flex items-center justify-center transition-all duration-300",
                isScrolled ? "h-[44px] md:h-[54px]" : "h-[56px] md:h-[90px] lg:h-[120px]"
              )}
            >
              <Image
                src={logoImageUrl}
                alt={logoText ?? "WWJ"}
                width={512}
                height={512}
                className={cn(
                  "w-auto object-contain group-hover:opacity-90 transition-all duration-300",
                  isScrolled ? "h-[44px] md:h-[54px]" : "h-[56px] md:h-[90px] lg:h-[120px]"
                )}
                unoptimized
              />
            </div>
          ) : (
            <>
              <span className={cn(
                "font-display font-bold text-ivory tracking-widest group-hover:text-gold transition-colors transition-all duration-300",
                isScrolled ? "text-xl md:text-2xl" : "text-3xl md:text-4xl lg:text-5xl"
              )}>
                {logoText}
              </span>
              <span className={cn(
                "font-sans tracking-[0.2em] text-gold uppercase whitespace-nowrap transition-all duration-300 hidden sm:block",
                isScrolled ? "text-[0.45rem] md:text-[0.5rem]" : "text-[0.55rem] md:text-[0.7rem]"
              )}>
                {logoTagline}
              </span>
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ivory/80 hover:text-gold transition-colors tracking-widest"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-3 text-ivory">
          <button aria-label="Search" className="hover:text-gold transition-colors p-1">
            <Search className="w-5 h-5" />
          </button>

          <Link href="/account" aria-label="Account" className="hover:text-gold transition-colors p-1 hidden sm:block">
            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: { userButtonAvatarBox: "w-6 h-6" },
                }}
              />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hover:text-gold transition-colors" aria-label="Sign in">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
              </SignInButton>
            </Show>
          </Link>

          <Link href="/account/wishlist" aria-label="Wishlist" className="hover:text-gold transition-colors p-1 relative hidden sm:block">
            <Heart className="w-5 h-5" />
            {isHydrated && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-jungle text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            aria-label="Cart"
            onClick={openCart}
            className="hover:text-gold transition-colors p-1 relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {isHydrated && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-jungle text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "lg:hidden absolute top-full left-0 w-full bg-jungle/95 backdrop-blur-md border-b border-border shadow-xl flex flex-col z-50 transition-all duration-300 overflow-hidden",
          mobileMenuOpen ? "max-h-[80vh] py-4 opacity-100" : "max-h-0 py-0 opacity-0 border-b-0"
        )}
      >
        <div className="overflow-y-auto max-h-[70vh]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-6 py-3.5 text-sm font-medium text-ivory/80 hover:text-gold hover:bg-forest/50 transition-colors tracking-widest block"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile-only: Wishlist & Account links */}
          <div className="border-t border-border mt-2 pt-2 px-6 pb-2 flex items-center gap-6">
            <Link href="/account" className="text-ivory/60 hover:text-gold text-xs tracking-widest uppercase py-2" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
            <Link href="/account/wishlist" className="text-ivory/60 hover:text-gold text-xs tracking-widest uppercase py-2" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
