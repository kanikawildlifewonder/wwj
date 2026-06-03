"use client";

import React from "react";
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  PackageOpen
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { formatINR } from "@/lib/utils/currency";

const revenueData = [
  { name: "Mon", total: 12000 },
  { name: "Tue", total: 18000 },
  { name: "Wed", total: 15000 },
  { name: "Thu", total: 22000 },
  { name: "Fri", total: 28000 },
  { name: "Sat", total: 35000 },
  { name: "Sun", total: 42000 },
];

export default function AdminDashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-jungle">Dashboard Overview</h2>
        <p className="text-jungle/60">Here is what's happening with your store today.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value={formatINR(172000)} 
          trend="+12.5%" 
          isPositive={true}
          icon={<IndianRupee className="w-6 h-6 text-emerald-600" />}
        />
        <MetricCard 
          title="Total Orders" 
          value="156" 
          trend="+8.2%" 
          isPositive={true}
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
        />
        <MetricCard 
          title="Active Customers" 
          value="2,405" 
          trend="+2.4%" 
          isPositive={true}
          icon={<Users className="w-6 h-6 text-purple-600" />}
        />
        <MetricCard 
          title="Low Stock Alerts" 
          value="3" 
          trend="Needs Attention" 
          isPositive={false}
          icon={<PackageOpen className="w-6 h-6 text-red-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-jungle">Revenue (Last 7 Days)</h3>
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              <TrendingUp className="w-4 h-4" /> <span>+14%</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A3B2F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1A3B2F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip 
                  formatter={(value: any) => [formatINR(value as number), "Revenue"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#1A3B2F" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-display text-lg text-jungle mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-jungle">ORD-2026-00{i}</p>
                  <p className="text-xs text-jungle/60">Just now</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-jungle">{formatINR(1200 * i + 999)}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Processing</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  trend, 
  isPositive,
  icon 
}: { 
  title: string, 
  value: string, 
  trend: string,
  isPositive: boolean,
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm text-jungle/60 mb-1">{title}</p>
        <h4 className="font-display text-2xl text-jungle mb-2">{value}</h4>
        <p className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend}
        </p>
      </div>
      <div className="p-3 bg-cream rounded-lg">
        {icon}
      </div>
    </div>
  )
}
