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
  LogOut,
  FileEdit,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export const metadata = {
  title: "Admin Dashboard | WWJ",
};

const NAV_LINKS = [
  { href: "/admin",           icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products",  icon: Package,         label: "Products" },
  { href: "/admin/orders",    icon: ShoppingBag,     label: "Orders" },
  { href: "/admin/events",    icon: Calendar,        label: "Events & Collabs" },
  { href: "/admin/customers", icon: Users,           label: "Customers" },
  { href: "/admin/pages",     icon: FileEdit,        label: "Site Content" },
  { href: "/admin/settings",  icon: Settings,        label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-jungle text-ivory flex flex-col fixed inset-y-0 left-0 z-50">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-ivory/10">
          <Link href="/admin" className="font-display text-xl text-gold tracking-widest">
            WWJ ADMIN
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-ivory/10 transition-colors group text-ivory/80 hover:text-ivory"
            >
              <Icon className="w-4 h-4 text-gold/70 group-hover:text-gold transition-colors flex-shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-ivory/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-ivory/10 transition-colors text-ivory/50 hover:text-ivory text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            View Site
          </a>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-ivory/10 transition-colors text-ivory/50 hover:text-ivory text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <h1 className="font-serif text-base text-jungle">
            Welcome back, <span className="font-bold">{user.firstName}</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-jungle">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-jungle/50">Administrator</p>
            </div>
            <UserButton />
          </div>
        </header>

        {/* Page */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
