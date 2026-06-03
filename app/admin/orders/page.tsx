"use client";

import React, { useState } from "react";
import { Search, Filter, Eye, ChevronDown } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";

const MOCK_ORDERS = [
  { id: "ORD-2026-8942", customer: "Rahul Sharma", email: "rahul@example.com", date: "2026-06-03T10:30:00Z", total: 3198, status: "Processing", items: 2 },
  { id: "ORD-2026-7731", customer: "Priya Patel", email: "priya@example.com", date: "2026-06-02T14:15:00Z", total: 1899, status: "Shipped", items: 1 },
  { id: "ORD-2026-6520", customer: "Amit Kumar", email: "amit@example.com", date: "2026-06-01T09:45:00Z", total: 4500, status: "Delivered", items: 3 },
  { id: "ORD-2026-5319", customer: "Sneha Reddy", email: "sneha@example.com", date: "2026-05-30T16:20:00Z", total: 950, status: "Delivered", items: 1 },
  { id: "ORD-2026-4108", customer: "Vikram Singh", email: "vikram@example.com", date: "2026-05-29T11:10:00Z", total: 2750, status: "Cancelled", items: 2 },
];

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = MOCK_ORDERS.filter((o) => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Processing</span>;
      case "Shipped":
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Shipped</span>;
      case "Delivered":
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Delivered</span>;
      case "Cancelled":
        return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-jungle">Orders</h2>
        <p className="text-sm text-jungle/60">View and manage customer orders.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-cream/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jungle/40" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm text-jungle border border-border px-4 py-2 rounded-lg bg-white hover:bg-cream transition-colors">
              <Filter className="w-4 h-4" /> Status <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory border-b border-border text-xs uppercase tracking-wider text-jungle/70">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-jungle">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-jungle/70">
                    {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-jungle">{order.customer}</p>
                    <p className="text-xs text-jungle/50">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-jungle">
                    {formatINR(order.total)}
                    <span className="text-xs font-normal text-jungle/50 block">{order.items} items</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-jungle hover:text-gold hover:bg-cream rounded-md transition-colors inline-flex items-center gap-1 text-xs font-medium">
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-jungle/50 text-sm">
                    No orders found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
