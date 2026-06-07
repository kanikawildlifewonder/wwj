"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, ChevronDown, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { getOrders } from "@/app/actions/orders";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  clerkUserId: string | null;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await getOrders();
        if (res.success && res.orders) {
          // Cast the DB orders to matches our interface
          setOrders(res.orders as unknown as Order[]);
        } else {
          toast.error(res.error || "Failed to load orders");
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("An unexpected error occurred while loading orders.");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "processing":
      case "pending":
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">{statusLower}</span>;
      case "shipped":
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">{statusLower}</span>;
      case "delivered":
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">{statusLower}</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">{statusLower}</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">{statusLower}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-jungle">Orders</h2>
        <p className="text-sm text-jungle/60">View and manage customer orders.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-cream/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jungle/40" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-sm text-jungle focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm text-jungle border border-border px-4 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 transition-colors">
              <Filter className="w-4 h-4" /> Status <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-jungle/60">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
            <p className="text-sm font-medium">Loading orders from database...</p>
          </div>
        ) : (
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
                {filteredOrders.map((order) => {
                  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  return (
                    <tr key={order.id} className="hover:bg-cream/20 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-jungle">
                        <span className="font-mono text-xs text-charcoal">#{order.id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-jungle/70">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-jungle">{order.customerName}</p>
                        <p className="text-xs text-jungle/50">{order.customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-jungle">
                        {formatINR(order.totalAmount)}
                        <span className="text-xs font-normal text-jungle/50 block">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            toast.info(`Order details: ${order.items.map(i => `${i.product?.name || 'Product'} (x${i.quantity})`).join(', ')}`);
                          }}
                          className="p-2 text-jungle hover:text-gold hover:bg-cream rounded-md transition-colors inline-flex items-center gap-1 text-xs font-medium"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-jungle/50 text-sm">
                      No orders found matching &quot;{searchTerm}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
