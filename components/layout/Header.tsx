"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, Heart, User, LayoutDashboard } from "lucide-react";
import { UserButton, SignInButton, Show, useUser } from "@clerk/nextjs";
import { useHydrated } from "@/lib/hooks/useHydrated";
import { cn } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/cartStore";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "LOOKBOOK", href: "/lookbook" },
  { label: "WELFARE & AWARENESS", href: "/welfare" },
  { label: "EVENTS & COLLABS", href: "/events" },
  { label: "ABOUT BRAND", href: "/about/brand" },
  { label: "FOUNDER", href: "/about/founder" },
  { label: "CONTACT US", href: "/contact" },
];

const NAV_LINKS_SHORT = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "LOOKBOOK", href: "/lookbook" },
  { label: "WELFARE & AWARENESS", href: "/welfare" },
  { label: "EVENTS", href: "/events" },
  { label: "ABOUT", href: "/about/brand" },
  { label: "FOUNDER", href: "/about/founder" },
  { label: "CONTACT", href: "/contact" },
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname() || "";
  const { openCart, totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const isHydrated = useHydrated();
  const { user } = useUser();
  const isAdmin = isHydrated && !!user;
  const cartCount = totalItems();
  const wishlistCount = wishlistItems.length;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

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
          : pathname === "/welfare"
            ? "bg-transparent border-transparent"
            : "bg-jungle border-transparent"
      )}
    >
      <div
        className={cn(
          "container mx-auto px-3 sm:px-4 lg:px-8 flex items-center justify-between transition-all duration-300",
          isScrolled
            ? "h-15 md:h-17.5"
            : "h-20 md:h-30 lg:h-35"
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
                isScrolled ? "h-11 md:h-13.5" : "h-14 md:h-22.5 lg:h-30"
              )}
            >
              <Image
                src={logoImageUrl}
                alt={logoText ?? "WWJ"}
                width={512}
                height={512}
                className={cn(
                  "w-auto object-contain group-hover:opacity-90 transition-all duration-300",
                  isScrolled ? "h-11 md:h-13.5" : "h-14 md:h-22.5 lg:h-30"
                )}
                unoptimized
              />
            </div>
          ) : (
            <>
              <span className={cn(
                "font-display font-bold text-ivory tracking-widest group-hover:text-gold transition-all duration-300",
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
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {NAV_LINKS_SHORT.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-xs font-medium tracking-widest whitespace-nowrap transition-colors nav-link-underline pb-1",
                  active ? "text-gold active font-semibold" : "text-ivory/80 hover:text-gold"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "text-xs font-bold tracking-widest border px-2.5 py-1 rounded-full transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-gold text-jungle border-gold"
                  : "text-gold/80 hover:text-gold border-gold/30 hover:border-gold"
              )}
            >
              ADMIN
            </Link>
          )}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-3 text-ivory">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-forest/80 border border-border/30 rounded-full px-3 py-1 shadow-inner">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-ivory placeholder-ivory/50 w-24 sm:w-36 focus:ring-0 focus:outline-none"
                autoFocus
              />
              <button type="submit" aria-label="Submit search" className="text-ivory hover:text-gold transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setIsSearchOpen(false)} aria-label="Close search" className="text-ivory/60 hover:text-ivory transition-colors">
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-gold transition-colors p-1"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* My Account */}
          <Show when="signed-in">
            <Link
              href="/account"
              aria-label="My Account"
              className="hidden sm:flex items-center gap-1.5 hover:text-gold transition-colors p-1 text-xs font-medium tracking-wider"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">MY ACCOUNT</span>
            </Link>
            <div className="hidden sm:block">
              <UserButton
                appearance={{
                  elements: { userButtonAvatarBox: "w-6 h-6" },
                }}
              />
            </div>
            {isAdmin && (
              <Link
                href="/admin"
                aria-label="Admin Dashboard"
                className="hidden sm:flex items-center gap-1 hover:text-gold transition-colors p-1 text-gold/70"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
              </Link>
            )}
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="hover:text-gold transition-colors p-1" aria-label="Sign in">
                <User className="w-5 h-5" />
              </button>
            </SignInButton>
          </Show>

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
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "py-3.5 text-sm font-medium transition-all tracking-widest block border-l-2",
                  active
                    ? "text-gold bg-forest/40 border-gold pl-6 font-semibold"
                    : "text-ivory/80 hover:text-gold hover:bg-forest/20 border-transparent pl-6"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile-only: Wishlist, Account & Admin links */}
          <div className="border-t border-border mt-2 pt-2 px-6 pb-2 flex items-center gap-6 flex-wrap">
            <Link href="/account" className="text-ivory/60 hover:text-gold text-xs tracking-widest uppercase py-2" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
            <Link href="/account/wishlist" className="text-ivory/60 hover:text-gold text-xs tracking-widest uppercase py-2" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
            {isAdmin && (
              <Link href="/admin" className="text-gold/80 hover:text-gold text-xs tracking-widest uppercase py-2 font-bold border border-gold/30 px-2 rounded" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
