import React from "react";
import Link from "next/link";
import { User, Package, Heart, MapPin, Box } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";

const MOCK_ORDERS = [
  {
    id: "ORD-2026-8942",
    date: "May 28, 2026",
    status: "Delivered",
    total: 3198,
    items: 2,
  },
  {
    id: "ORD-2026-7731",
    date: "April 15, 2026",
    status: "Processing",
    total: 1899,
    items: 1,
  },
];

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-serif text-jungle mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <Link href="/account" className="flex items-center gap-3 p-3 hover:bg-ivory/50 rounded-md transition-colors text-jungle/80">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
          <Link href="/account/orders" className="flex items-center gap-3 p-3 bg-jungle text-ivory rounded-md transition-colors">
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
        <div className="md:col-span-3">
          <h2 className="text-2xl font-serif text-jungle mb-6">Order History</h2>

          {MOCK_ORDERS.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-lg border border-border shadow-sm flex flex-col items-center">
              <Box className="w-12 h-12 text-jungle/20 mb-4" />
              <p className="text-lg font-serif text-jungle">No orders yet</p>
              <p className="text-jungle/60 mb-6">You haven&apos;t placed any orders.</p>
              <Link href="/shop" className="bg-jungle text-gold px-6 py-2 text-sm font-bold tracking-widest uppercase rounded-btn hover:bg-charcoal transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-ivory border-b border-border text-sm text-jungle/70">
                    <tr>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Total</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_ORDERS.map((order) => (
                      <tr key={order.id} className="hover:bg-ivory/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-jungle">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-jungle/70">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Delivered" 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-jungle">
                          {formatINR(order.total)}
                          <span className="text-xs text-jungle/50 block font-normal">{order.items} items</span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-gold font-medium hover:text-jungle transition-colors underline">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
