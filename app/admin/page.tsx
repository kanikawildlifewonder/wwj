"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  PackageOpen,
  Calendar,
  AlertTriangle,
  Loader2,
  Package,
  Plus,
  FileEdit,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatINR } from "@/lib/utils/currency";
import { getDashboardStats } from "@/app/actions/orders";
import { getInventoryAlerts } from "@/app/actions/products";

type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  lowStock: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  chartData: Array<{
    name: string;
    total: number;
  }>;
};

type MetricCardProps = {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  href?: string;
};

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inventory, setInventory] = useState<{
    total: number;
    outOfStock: { id: string; name: string; category: string }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getInventoryAlerts()]).then(
      ([statsRes, invRes]) => {
        if (statsRes.success && statsRes.stats) setStats(statsRes.stats);
        setInventory(invRes);
        setIsLoading(false);
      }
    );
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-sm text-jungle/60 font-medium">Loading store metrics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h3 className="font-serif text-lg text-jungle font-semibold">Failed to load statistics</h3>
        <p className="text-sm text-jungle/50 max-w-sm">
          There was an error connecting to the database. Please check your Supabase connection and try refreshing.
        </p>
      </div>
    );
  }

  const outOfStock = inventory?.outOfStock ?? [];
  const totalProducts = inventory?.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-jungle">Dashboard Overview</h2>
          <p className="text-jungle/60">Live metrics from your store database.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/analytics"
            className="flex items-center gap-1.5 text-xs font-bold text-jungle/70 hover:text-gold border border-jungle/10 hover:border-gold/30 px-3 py-2 rounded-lg transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatINR(stats.totalRevenue)}
          trend="Real-time"
          isPositive={true}
          icon={<IndianRupee className="w-6 h-6 text-emerald-600" />}
          href="/admin/analytics"
        />
        <MetricCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          trend="In database"
          isPositive={true}
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          href="/admin/orders"
        />
        <MetricCard
          title="Active Customers"
          value={stats.activeCustomers.toLocaleString("en-IN")}
          trend="Unique customers"
          isPositive={true}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          href="/admin/customers"
        />
        <MetricCard
          title="Total Products"
          value={totalProducts.toString()}
          trend={outOfStock.length > 0 ? `${outOfStock.length} out of stock` : "All in stock ✓"}
          isPositive={outOfStock.length === 0}
          icon={<Package className={`w-6 h-6 ${outOfStock.length > 0 ? "text-amber-500" : "text-emerald-500"}`} />}
          href="/admin/products"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-gold" />
          <h3 className="font-display text-lg text-jungle">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin/products/new", icon: Plus, label: "Add Product", color: "bg-jungle text-gold hover:bg-charcoal" },
            { href: "/admin/orders", icon: ShoppingBag, label: "View Orders", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
            { href: "/admin/events/new", icon: Calendar, label: "New Event", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
            { href: "/admin/pages", icon: FileEdit, label: "Edit Content", color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-medium text-sm transition-colors text-center ${color}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Analytics Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-jungle">Revenue (Last 7 Days)</h3>
            <div className="flex items-center gap-1.5 text-xs text-jungle/50 font-medium">
              <Calendar className="w-4 h-4 text-gold/70" />
              <span>Weekly Trend</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            {stats.totalRevenue === 0 ? (
              <div className="w-full h-full flex items-center justify-center bg-cream/20 rounded border border-dashed border-border text-xs text-jungle/40">
                No revenue recorded in the last 7 days.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3B2F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1A3B2F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) => `Rs. ${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`Rs. ${value}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(11, 25, 23, 0.1)",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                      fontFamily: "sans-serif",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#1A3B2F"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg text-jungle mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {stats.recentOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-jungle/40 border border-dashed border-border rounded-xl">
                  No orders recorded yet.
                </div>
              ) : (
                stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-jungle truncate">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-jungle/40">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-jungle">
                        {formatINR(order.totalAmount)}
                      </p>
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          order.status.toLowerCase() === "delivered"
                            ? "text-emerald-700 bg-emerald-50"
                            : order.status.toLowerCase() === "processing"
                            ? "text-blue-700 bg-blue-50"
                            : order.status.toLowerCase() === "shipped"
                            ? "text-purple-700 bg-purple-50"
                            : "text-amber-700 bg-amber-50"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {stats.recentOrders.length > 0 && (
            <Link
              href="/admin/orders"
              className="w-full text-center bg-cream hover:bg-jungle hover:text-gold border border-jungle/10 hover:border-jungle py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all mt-6 block"
            >
              View All Orders
            </Link>
          )}
        </div>
      </div>

      {/* Inventory Alerts */}
      {outOfStock.length > 0 && (
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PackageOpen className="w-5 h-5 text-amber-500" />
              <h3 className="font-display text-lg text-jungle">
                Inventory Alerts
                <span className="ml-2 text-sm font-sans font-normal text-amber-600">
                  ({outOfStock.length} out of stock)
                </span>
              </h3>
            </div>
            <Link
              href="/admin/products?stock=out"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Manage Stock
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {outOfStock.slice(0, 9).map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}/edit`}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-amber-100 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-200 transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-jungle truncate group-hover:text-gold transition-colors">
                    {p.name}
                  </p>
                  <p className="text-xs text-jungle/40 capitalize">{p.category}</p>
                </div>
              </Link>
            ))}
            {outOfStock.length > 9 && (
              <div className="flex items-center justify-center p-2.5 rounded-lg border border-dashed border-amber-200 text-xs text-amber-600 font-medium">
                +{outOfStock.length - 9} more out of stock
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  trend,
  isPositive,
  icon,
  href,
}: MetricCardProps) {
  const inner = (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-start justify-between hover:border-gold/30 transition-colors">
      <div>
        <p className="text-sm text-jungle/60 mb-1">{title}</p>
        <h4 className="font-display text-2xl text-jungle mb-2">{value}</h4>
        <p className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-amber-600"}`}>
          {trend}
        </p>
      </div>
      <div className="p-3 bg-cream rounded-xl">{icon}</div>
    </div>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}
