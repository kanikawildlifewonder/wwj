"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Package, Heart, MapPin, Box, X, CreditCard, Calendar } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";

interface OrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  itemsCount: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2026-8942",
    date: "May 28, 2026",
    status: "Delivered",
    total: 3198,
    itemsCount: 2,
    paymentMethod: "UPI (Razorpay)",
    shippingAddress: {
      name: "Vinay Jawai",
      street: "123 Forest View Lane",
      city: "Dehradun",
      state: "Uttarakhand",
      zip: "248001",
      country: "India",
      phone: "+91 98765 43210",
    },
    items: [
      {
        name: "Lioness Queen Necklace",
        image: "/images/products/lioness_queen_necklace.png",
        price: 1899,
        quantity: 1,
      },
      {
        name: "Lioness Queen Ring",
        image: "/images/products/lioness_queen_ring.png",
        price: 1299,
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD-2026-7731",
    date: "April 15, 2026",
    status: "Processing",
    total: 1899,
    itemsCount: 1,
    paymentMethod: "Credit Card (Razorpay)",
    shippingAddress: {
      name: "Vinay Jawai",
      street: "123 Forest View Lane",
      city: "Dehradun",
      state: "Uttarakhand",
      zip: "248001",
      country: "India",
      phone: "+91 98765 43210",
    },
    items: [
      {
        name: "Leopard Pendant",
        image: "/images/products/leopard_pendant.png",
        price: 1899,
        quantity: 1,
      },
    ],
  },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-jungle py-8 sm:py-12 text-center border-b border-border">
        <h1 className="font-display text-3xl sm:text-4xl text-ivory">My Account</h1>
        <p className="font-sans text-sm text-ivory/60 mt-2">Manage your profile, orders & wishlist</p>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar — horizontal scroll on mobile, vertical on desktop */}
          <div className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <Link href="/account" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-3 bg-jungle text-gold rounded-lg transition-colors whitespace-nowrap text-sm font-medium flex-shrink-0">
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </Link>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-5 sm:p-8 rounded-xl border border-jungle/10 shadow-sm">
              <h2 className="font-display text-xl sm:text-2xl text-jungle mb-6">Order History</h2>

              {MOCK_ORDERS.length === 0 ? (
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
                  {/* Desktop View (Table) */}
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
                        {MOCK_ORDERS.map((order) => (
                          <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                            <td className="px-4 py-4 text-sm font-medium text-jungle">
                              {order.id}
                            </td>
                            <td className="px-4 py-4 text-sm text-jungle/70">
                              {order.date}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "Delivered" 
                                  ? "bg-emerald-100 text-emerald-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-jungle">
                              {formatINR(order.total)}
                              <span className="text-xs text-jungle/50 block font-normal">{order.itemsCount} items</span>
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

                  {/* Mobile View (Cards) */}
                  <div className="space-y-4 sm:hidden">
                    {MOCK_ORDERS.map((order) => (
                      <div key={order.id} className="bg-cream/30 border border-jungle/10 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-jungle">{order.id}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "Delivered" 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-jungle/70">
                          <div>
                            <span className="block text-gold/80 font-semibold uppercase tracking-wider">Date</span>
                            <span>{order.date}</span>
                          </div>
                          <div>
                            <span className="block text-gold/80 font-semibold uppercase tracking-wider">Total</span>
                            <span className="font-semibold text-jungle">{formatINR(order.total)} ({order.itemsCount} items)</span>
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
            {/* Modal Header */}
            <div className="bg-jungle p-4 flex justify-between items-center text-ivory">
              <div>
                <h3 className="font-display text-lg flex items-center gap-2">
                  Order Details
                </h3>
                <p className="text-xs text-ivory/60 mt-0.5">{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-ivory/60 hover:text-ivory transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Status & Date Info Banner */}
              <div className="bg-cream/40 border border-jungle/5 rounded-lg p-4 grid grid-cols-2 gap-4">
                <div className="flex gap-3 items-center">
                  <div className="bg-jungle/5 p-2 rounded-full">
                    <Calendar className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gold uppercase tracking-wider font-bold">Date Placed</span>
                    <span className="text-sm font-medium text-jungle">{selectedOrder.date}</span>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="bg-jungle/5 p-2 rounded-full">
                    <Package className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gold uppercase tracking-wider font-bold">Status</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedOrder.status === "Delivered" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gold uppercase tracking-wider border-b border-jungle/10 pb-2">Items Purchased</h4>
                <div className="divide-y divide-jungle/5">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-4 py-3 items-center">
                      <div className="relative w-16 h-16 bg-cream border border-jungle/5 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h5 className="font-serif text-jungle text-sm font-medium">{item.name}</h5>
                        <p className="text-xs text-jungle/60 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-sans text-sm font-bold text-jungle">{formatINR(item.price * item.quantity)}</span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-jungle/50 font-normal">{formatINR(item.price)} each</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-jungle/10">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" /> Shipping Address
                  </h4>
                  <div className="text-xs text-jungle/80 space-y-1 font-sans">
                    <p className="font-semibold text-jungle">{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                    <p className="text-[10px] text-jungle/50 pt-1">Phone: {selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-gold" /> Payment Method
                  </h4>
                  <p className="text-xs text-jungle/80 font-sans font-medium">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Order Total Breakdown */}
              <div className="pt-4 border-t border-jungle/10 bg-cream/20 p-4 rounded-lg space-y-2">
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

            {/* Modal Footer */}
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
