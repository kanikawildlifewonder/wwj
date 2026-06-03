import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Heart, User, MapPin } from "lucide-react";

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-serif text-jungle mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <Link href="/account" className="flex items-center gap-3 p-3 bg-jungle text-ivory rounded-md transition-colors">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link href="/account/orders" className="flex items-center gap-3 p-3 hover:bg-ivory/50 rounded-md transition-colors text-jungle/80">
            <Package className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          <Link href="/account/wishlist" className="flex items-center gap-3 p-3 hover:bg-ivory/50 rounded-md transition-colors text-jungle/80">
            <Heart className="w-5 h-5" />
            <span>Wishlist</span>
          </Link>
          <Link href="/account/addresses" className="flex items-center gap-3 p-3 hover:bg-ivory/50 rounded-md transition-colors text-jungle/80">
            <MapPin className="w-5 h-5" />
            <span>Addresses</span>
          </Link>
        </div>

        {/* Content */}
        <div className="md:col-span-3 bg-white p-8 rounded-lg border border-border shadow-sm">
          <h2 className="text-2xl font-serif text-jungle mb-6">Profile Details</h2>
          
          <div className="space-y-4 max-w-md">
            <div>
              <p className="text-sm text-jungle/60 mb-1">Name</p>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-jungle/60 mb-1">Email</p>
              <p className="font-medium">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-jungle/60 mb-4">To update your password or authentication methods, use the profile manager.</p>
              {/* Clerk's built-in <UserProfile /> could go here, or just link to it */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
