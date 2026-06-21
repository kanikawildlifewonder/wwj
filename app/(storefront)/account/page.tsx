import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Heart, User, MapPin, ChevronRight } from "lucide-react";

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-jungle py-8 sm:py-12 text-center border-b border-border">
        <h1 className="font-display text-3xl sm:text-4xl text-ivory">My Account</h1>
        <p className="font-sans text-sm text-ivory/60 mt-2">Manage your profile, orders & wishlist</p>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar — horizontal scroll on mobile, vertical on desktop */}
          <div className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <Link href="/account" className="flex items-center gap-2.5 px-4 py-3 bg-jungle text-gold rounded-lg transition-colors whitespace-nowrap text-sm font-medium shrink-0">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium shrink-0">
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium shrink-0">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium shrink-0">
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </Link>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-5 sm:p-8 rounded-xl border border-jungle/10 shadow-sm">
              <h2 className="font-display text-xl sm:text-2xl text-jungle mb-6">Profile Details</h2>
              
              <div className="space-y-5 max-w-md">
                <div className="bg-cream/50 rounded-lg p-4 border border-jungle/5">
                  <p className="text-xs text-gold uppercase tracking-widest font-bold mb-1">Name</p>
                  <p className="font-medium text-jungle">{user.firstName} {user.lastName}</p>
                </div>
                <div className="bg-cream/50 rounded-lg p-4 border border-jungle/5">
                  <p className="text-xs text-gold uppercase tracking-widest font-bold mb-1">Email</p>
                  <p className="font-medium text-jungle text-sm sm:text-base break-all">{user.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div className="pt-4 border-t border-jungle/10">
                  <p className="text-sm text-jungle/60">To update your password or authentication methods, use the profile manager.</p>
                </div>
              </div>
            </div>

            {/* Quick Links on Mobile */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
              <Link href="/account/orders" className="flex items-center justify-between p-4 bg-white rounded-xl border border-jungle/10 shadow-sm hover:border-gold/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-jungle">My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-jungle/30 group-hover:text-gold transition-colors" />
              </Link>
              <Link href="/account/wishlist" className="flex items-center justify-between p-4 bg-white rounded-xl border border-jungle/10 shadow-sm hover:border-gold/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gold" />
                  <span className="text-sm font-medium text-jungle">My Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-jungle/30 group-hover:text-gold transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
