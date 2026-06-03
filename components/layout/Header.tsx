"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { UserButton, SignInButton, Show } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/cartStore";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "CATALOG", href: "/catalogue" },
  { label: "STYLING TIPS", href: "/styling-tips" },
  { label: "ABOUT US", href: "/about" },
  { label: "FOUNDER", href: "/founder" },
  { label: "CONTACT US", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const cartCount = totalItems();
  const wishlistCount = wishlistItems.length;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
      <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        
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
          <span className="font-display text-3xl font-bold text-ivory tracking-widest group-hover:text-gold transition-colors">
            WWJ
          </span>
          <span className="font-sans text-[0.55rem] tracking-[0.2em] text-gold uppercase whitespace-nowrap">
            Wildlife Wonder Jewellery
          </span>
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
                  elements: {
                    userButtonAvatarBox: "w-6 h-6",
                  },
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
            {isMounted && wishlistCount > 0 && (
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
            {isMounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-jungle text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-jungle/95 backdrop-blur-md border-b border-border shadow-xl py-4 flex flex-col z-50">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-6 py-3 text-sm font-medium text-ivory/80 hover:text-gold hover:bg-forest/50 transition-colors tracking-widest"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
