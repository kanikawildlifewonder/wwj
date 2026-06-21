"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Package, Heart, MapPin, Box, X, CreditCard, Calendar, Loader2,
} from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { getMyOrders } from "@/app/actions/account";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;        // ISO string from DB
  status: string;
  total: number;
  itemsCount: number;
  items: OrderItem[];
  paymentMethod: string;
}

function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === "delivered") return "bg-emerald-100 text-emerald-800";
  if (s === "shipped") return "bg-purple-100 text-purple-800";
  if (s === "processing") return "bg-blue-100 text-blue-800";
  if (s === "cancelled") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    getMyOrders().then((res) => {
      if (res.success) setOrders(res.orders as Order[]);
      setIsLoading(false);
    });
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatShortId = (id: string) =>
    `#${id.slice(-8).toUpperCase()}`;

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-jungle py-8 sm:py-12 text-center border-b border-border">
        <h1 className="font-display text-3xl sm:text-4xl text-ivory">My Account</h1>
        <p className="font-sans text-sm text-ivory/60 mt-2">Manage your profile, orders &amp; wishlist</p>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <Link href="/account" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium shrink-0">
              <User className="w-4 h-4" /><span>Profile</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-3 bg-jungle text-gold rounded-lg whitespace-nowrap text-sm font-medium shrink-0">
              <Package className="w-4 h-4" /><span>Orders</span>
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium shrink-0">
              <Heart className="w-4 h-4" /><span>Wishlist</span>
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium shrink-0">
              <MapPin className="w-4 h-4" /><span>Addresses</span>
            </Link>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-5 sm:p-8 rounded-xl border border-jungle/10 shadow-sm">
              <h2 className="font-display text-xl sm:text-2xl text-jungle mb-6">Order History</h2>

              {isLoading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  <p className="text-sm text-jungle/50">Loading your orders…</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <Box className="w-12 h-12 text-jungle/20 mb-4" />
                  <p className="text-lg font-serif text-jungle">No orders yet</p>
                  <p className="text-jungle/60 mb-6">You haven&apos;t placed any orders yet.</p>
                  <Link href="/shop" className="bg-jungle text-gold px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-charcoal transition-colors">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-cream border-b border-jungle/10 text-sm text-jungle/70">
                        <tr>
                          <th className="px-4 py-3 font-medium">Order ID</th>
                          <th className="px-4 py-3 font-medium">Date</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Total</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-jungle/10">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                            <td className="px-4 py-4 text-sm font-medium text-jungle">
                              {formatShortId(order.id)}
                            </td>
                            <td className="px-4 py-4 text-sm text-jungle/70">
                              {formatDate(order.date)}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-jungle">
                              {formatINR(order.total)}
                              <span className="text-xs text-jungle/50 block font-normal">{order.itemsCount} item{order.itemsCount !== 1 ? "s" : ""}</span>
                            </td>
                            <td className="px-4 py-4 text-sm text-right">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-gold font-medium hover:text-jungle transition-colors underline"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="space-y-4 sm:hidden">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-cream/30 border border-jungle/10 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-jungle">{formatShortId(order.id)}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-jungle/70">
                          <div>
                            <span className="block text-gold/80 font-semibold uppercase tracking-wider">Date</span>
                            <span>{formatDate(order.date)}</span>
                          </div>
                          <div>
                            <span className="block text-gold/80 font-semibold uppercase tracking-wider">Total</span>
                            <span className="font-semibold text-jungle">{formatINR(order.total)} ({order.itemsCount} item{order.itemsCount !== 1 ? "s" : ""})</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-jungle/5 flex justify-end">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-gold text-xs font-bold hover:text-jungle transition-colors underline"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-jungle/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-xl border border-jungle/10 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
            <div className="bg-jungle p-4 flex justify-between items-center text-ivory">
              <div>
                <h3 className="font-display text-lg">Order Details</h3>
                <p className="text-xs text-ivory/60 mt-0.5">{formatShortId(selectedOrder.id)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-ivory/60 hover:text-ivory transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Status & Date Banner */}
              <div className="bg-cream/40 border border-jungle/5 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div className="flex gap-3 items-center">
                  <div className="bg-jungle/5 p-2 rounded-full">
                    <Calendar className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gold uppercase tracking-wider font-bold">Date Placed</span>
                    <span className="text-sm font-medium text-jungle">{formatDate(selectedOrder.date)}</span>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="bg-jungle/5 p-2 rounded-full">
                    <Package className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gold uppercase tracking-wider font-bold">Status</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadgeClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gold uppercase tracking-wider border-b border-jungle/10 pb-2">Items Purchased</h4>
                <div className="divide-y divide-jungle/5">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-4 py-3 items-center">
                      <div className="relative w-16 h-16 bg-cream border border-jungle/5 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        ) : (
                          <Package className="w-6 h-6 text-jungle/20" />
                        )}
                      </div>
                      <div className="grow min-w-0">
                        <h5 className="font-serif text-jungle text-sm font-medium truncate">{item.name}</h5>
                        <p className="text-xs text-jungle/60 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-sans text-sm font-bold text-jungle">{formatINR(item.price * item.quantity)}</span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-jungle/50">{formatINR(item.price)} each</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment + Total */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-jungle/10">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Payment
                  </h4>
                  <p className="text-xs text-jungle/80 font-sans font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="bg-cream/20 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-xs text-jungle/70">
                    <span>Subtotal</span>
                    <span>{formatINR(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-jungle/70">
                    <span>Shipping</span>
                    <span className="text-emerald-700 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-jungle font-bold border-t border-jungle/5 pt-2">
                    <span>Total</span>
                    <span>{formatINR(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cream/40 p-4 border-t border-jungle/10 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-jungle text-gold hover:bg-charcoal rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
