"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Loader2,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatINR } from "@/lib/utils/currency";
import { getDashboardStats } from "@/app/actions/orders";
import { getProducts } from "@/app/actions/products";

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
};

const STATUS_COLORS: Record<string, string> = {
  processing: "#3b82f6",
  shipped: "#a855f7",
  delivered: "#22c55e",
  pending: "#f59e0b",
  cancelled: "#ef4444",
};

const CHART_COLORS = ["#1A3B2F", "#C5A028", "#3b82f6", "#a855f7", "#22c55e", "#f59e0b"];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    activeCustomers: number;
    chartData: { name: string; total: number }[];
    recentOrders: Order[];
  } | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getProducts()]).then(([statsRes, products]) => {
      if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
      setAllProducts(
        products.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
        }))
      );
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-sm text-jungle/60 font-medium">Loading analytics…</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-sm text-jungle/50 max-w-sm">Failed to load analytics data.</p>
      </div>
    );
  }

  // Category distribution from products
  const categoryCount: Record<string, number> = {};
  allProducts.forEach((p) => {
    const cat = p.category || "Uncategorised";
    categoryCount[cat] = (categoryCount[cat] ?? 0) + 1;
  });
  const categoryData = Object.entries(categoryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Price distribution buckets
  const priceBuckets = [
    { label: "< ₹500", min: 0, max: 500 },
    { label: "₹500–1k", min: 500, max: 1000 },
    { label: "₹1k–2k", min: 1000, max: 2000 },
    { label: "₹2k–5k", min: 2000, max: 5000 },
    { label: "> ₹5k", min: 5000, max: Infinity },
  ];
  const priceDistData = priceBuckets.map((bucket) => ({
    label: bucket.label,
    count: allProducts.filter((p) => p.price >= bucket.min && p.price < bucket.max).length,
  }));

  // Order status breakdown
  const statusCount: Record<string, number> = {};
  stats.recentOrders.forEach((o) => {
    const s = o.status.toLowerCase();
    statusCount[s] = (statusCount[s] ?? 0) + 1;
  });
  const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  // Summary metrics
  const avgOrderValue = stats.totalOrders > 0
    ? stats.totalRevenue / stats.totalOrders
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/admin"
          className="p-2 rounded-lg border border-border hover:border-gold/30 text-jungle/50 hover:text-gold transition-colors mt-0.5"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-gold" />
            <h2 className="font-display text-2xl text-jungle">Analytics</h2>
          </div>
          <p className="text-jungle/60 text-sm">Store performance and product insights.</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatINR(stats.totalRevenue), icon: <IndianRupee className="w-5 h-5 text-emerald-600" />, sub: "All time" },
          { label: "Total Orders", value: stats.totalOrders.toString(), icon: <ShoppingBag className="w-5 h-5 text-blue-600" />, sub: "Completed" },
          { label: "Avg. Order Value", value: formatINR(avgOrderValue), icon: <TrendingUp className="w-5 h-5 text-purple-600" />, sub: "Per transaction" },
          { label: "Customers", value: stats.activeCustomers.toLocaleString("en-IN"), icon: <Users className="w-5 h-5 text-gold" />, sub: "Unique buyers" },
        ].map(({ label, value, icon, sub }) => (
          <div key={label} className="bg-white rounded-xl border border-border shadow-sm p-5 flex items-start justify-between">
            <div>
              <p className="text-xs text-jungle/50 mb-1 uppercase tracking-wider font-medium">{label}</p>
              <p className="font-display text-xl text-jungle">{value}</p>
              <p className="text-xs text-jungle/40 mt-1">{sub}</p>
            </div>
            <div className="p-2.5 bg-cream rounded-lg">{icon}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart + Product count */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-display text-lg text-jungle mb-5">Revenue — Last 7 Days</h3>
          <div className="h-[280px]">
            {stats.totalRevenue === 0 ? (
              <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded text-xs text-jungle/40">
                No revenue data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3B2F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1A3B2F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v) => [`₹${v}`, "Revenue"]} contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb" }} />
                  <Area type="monotone" dataKey="total" stroke="#1A3B2F" strokeWidth={2.5} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Package className="w-4 h-4 text-gold" />
            <h3 className="font-display text-lg text-jungle">Catalogue</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-jungle/60">Total Products</span>
              <span className="font-bold text-jungle text-lg">{allProducts.length}</span>
            </div>
            {categoryData.slice(0, 6).map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-jungle/70 capitalize truncate max-w-[140px]">{c.name}</span>
                  <span className="font-medium text-jungle">{c.value}</span>
                </div>
                <div className="h-1.5 bg-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${Math.round((c.value / allProducts.length) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category distribution + Price buckets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-display text-lg text-jungle mb-5">Products by Category</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => {
                    const n = name ?? "";
                    return `${n.length > 12 ? n.slice(0, 11) + "…" : n} ${Math.round((percent ?? 0) * 100)}%`;
                  }}
                  labelLine={false}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} products`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-display text-lg text-jungle mb-5">Price Distribution</h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceDistData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip formatter={(v) => [`${v} products`]} contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb" }} />
                <Bar dataKey="count" fill="#1A3B2F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      {stats.recentOrders.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-display text-lg text-jungle mb-5">Order Status Breakdown</h3>
          {statusData.length === 0 ? (
            <p className="text-sm text-jungle/40 text-center py-8">No orders yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {statusData.map(({ name, value }) => (
                <div key={name} className="text-center p-4 rounded-xl border border-border">
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: STATUS_COLORS[name] ?? "#6b7280" }}
                  >
                    {value}
                  </div>
                  <p className="text-xs font-medium text-jungle capitalize">{name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
