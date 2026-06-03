import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export const metadata = {
  title: "Admin Dashboard | WWJ",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // Role-based access control checking publicMetadata
  if (!user || user.publicMetadata.role !== "admin") {
    // Redirect non-admins to the homepage
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-jungle text-ivory flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-ivory/10">
          <Link href="/admin" className="font-display text-xl text-gold tracking-widest">
            WWJ ADMIN
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-ivory/10 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gold" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-ivory/10 transition-colors">
            <Package className="w-5 h-5 text-gold" />
            <span className="font-medium">Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-ivory/10 transition-colors">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <span className="font-medium">Orders</span>
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-ivory/10 transition-colors">
            <Users className="w-5 h-5 text-gold" />
            <span className="font-medium">Customers</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-ivory/10 transition-colors">
            <Settings className="w-5 h-5 text-gold" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-ivory/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-ivory/10 transition-colors text-ivory/70 hover:text-ivory">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="font-serif text-lg text-jungle">Welcome back, {user.firstName}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-jungle">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-jungle/60">Administrator</p>
            </div>
            <UserButton />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
