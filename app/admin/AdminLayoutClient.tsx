"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu,
  X,
  BarChart2,
  Tag,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  userFirstName: string;
  userFullName: string;
}

const NAV_LINKS = [
  { href: "/admin",           icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products",  icon: Package,         label: "Products" },
  { href: "/admin/orders",    icon: ShoppingBag,     label: "Orders" },
  { href: "/admin/analytics", icon: BarChart2,        label: "Analytics" },
  { href: "/admin/events",    icon: Calendar,        label: "Events & Collabs" },
  { href: "/admin/customers", icon: Users,           label: "Customers" },
  { href: "/admin/pages",     icon: FileEdit,        label: "Site Content" },
  { href: "/admin/coupons",   icon: Tag,             label: "Coupons" },
  { href: "/admin/settings",  icon: Settings,        label: "Settings" },
];

export default function AdminLayoutClient({
  children,
  userFirstName,
  userFullName,
}: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-cream flex">
      {/* ── Mobile Sidebar Backdrop Overlay ── */}
      {isSidebarOpen && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 bg-jungle/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ── Sidebar ── */}
      <aside 
        className={`w-64 bg-jungle text-ivory flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Logo / Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-ivory/10">
          <Link href="/admin" onClick={closeSidebar} className="font-display text-xl text-gold tracking-widest">
            WWJ ADMIN
          </Link>
          <button 
            onClick={closeSidebar}
            className="text-ivory/60 hover:text-ivory p-1 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors group text-sm font-medium ${
                  isActive 
                    ? "bg-ivory/10 text-gold" 
                    : "text-ivory/80 hover:text-ivory hover:bg-ivory/5"
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors shrink-0 ${
                  isActive ? "text-gold" : "text-gold/70 group-hover:text-gold"
                }`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
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

      {/* ── Main Content Area ── */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Topbar Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button 
              onClick={toggleSidebar}
              className="text-jungle hover:text-gold p-1.5 rounded-lg border border-jungle/10 hover:border-gold/30 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif text-sm sm:text-base text-jungle">
              Welcome back, <span className="font-bold">{userFirstName}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-jungle leading-none mb-0.5">{userFullName}</p>
              <p className="text-[10px] text-jungle/50 uppercase font-bold tracking-wider">Administrator</p>
            </div>
            <UserButton />
          </div>
        </header>

        {/* Page Content Panel */}
        <div className="flex-1 p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
