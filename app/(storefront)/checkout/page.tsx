"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/utils/currency";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid PIN code is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingFee = subtotal() >= 1499 ? 0 : 99;
  const total = subtotal() + shippingFee;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    // Simulate API call for payment/order creation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setOrderPlaced(true);
    clearCart();
    toast.success("Order placed successfully!");
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-jungle mb-4">Checkout</h1>
        <p className="text-jungle/60 mb-8">Your cart is empty. Add items to checkout.</p>
        <Link href="/shop" className="bg-jungle text-gold px-8 py-3 rounded-btn font-bold tracking-widest uppercase hover:bg-charcoal transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <CheckCircle2 className="w-20 h-20 text-emerald-600 mx-auto mb-6" />
        <h1 className="font-display text-4xl text-jungle mb-4">Order Confirmed!</h1>
        <p className="text-jungle/70 mb-8">
          Thank you for choosing WWJ. Your wildlife-inspired pieces are being prepared for shipping.
          You will receive an email confirmation shortly.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/account/orders" className="border border-jungle text-jungle px-8 py-3 rounded-btn font-bold uppercase tracking-widest hover:bg-jungle/5 transition-colors">
            View Orders
          </Link>
          <Link href="/shop" className="bg-jungle text-gold px-8 py-3 rounded-btn font-bold uppercase tracking-widest hover:bg-charcoal transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <h1 className="font-display text-3xl text-jungle mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Info */}
              <div className="bg-ivory p-6 md:p-8 rounded-xl border border-jungle/10">
                <h2 className="font-display text-xl text-jungle mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-jungle/70 mb-1">Email</label>
                    <input {...register("email")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">First Name</label>
                    <input {...register("firstName")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">Last Name</label>
                    <input {...register("lastName")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-jungle/70 mb-1">Phone Number</label>
                    <input {...register("phone")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-ivory p-6 md:p-8 rounded-xl border border-jungle/10">
                <h2 className="font-display text-xl text-jungle mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-jungle/70 mb-1">Full Address</label>
                    <input {...register("address")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">City</label>
                    <input {...register("city")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">State / Province</label>
                    <input {...register("state")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold" />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">PIN Code / ZIP</label>
                    <input {...register("pincode")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream focus:outline-none focus:border-gold" />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">Country</label>
                    <input value="India" disabled className="w-full border border-border px-4 py-3 rounded-btn bg-cream/50 text-jungle/50" />
                  </div>
                </div>
              </div>

              {/* Payment Section (Simulated) */}
              <div className="bg-ivory p-6 md:p-8 rounded-xl border border-jungle/10">
                <h2 className="font-display text-xl text-jungle mb-6">Payment</h2>
                <div className="border border-gold bg-gold/5 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-gold bg-white" />
                  <span className="font-medium text-jungle">Razorpay Secure Checkout</span>
                </div>
                <p className="text-xs text-jungle/50 mt-4 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure payment gateway simulation
                </p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-jungle text-gold py-4 rounded-btn font-bold tracking-widest uppercase hover:bg-charcoal transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? "Processing..." : `Pay ${formatINR(total)}`}
                {!isProcessing && <ArrowRight className="ml-2 w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-jungle text-ivory rounded-xl p-6 md:p-8 sticky top-28">
              <h2 className="font-display text-xl mb-6 text-gold">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded bg-forest flex-shrink-0 relative overflow-hidden">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.product.images[0]})` }} />
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-jungle text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                      <p className="text-xs text-ivory/60">{item.product.category}</p>
                      <p className="text-sm text-gold mt-1">{formatINR(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-ivory/10 pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-ivory/70">
                  <span>Subtotal</span>
                  <span className="text-ivory">{formatINR(subtotal())}</span>
                </div>
                <div className="flex justify-between text-ivory/70">
                  <span>Shipping</span>
                  <span className="text-ivory">{shippingFee === 0 ? "FREE" : formatINR(shippingFee)}</span>
                </div>
                <div className="border-t border-ivory/10 pt-3 flex justify-between items-end">
                  <div>
                    <span className="font-bold text-lg">Total</span>
                    <p className="text-xs text-ivory/40">Including GST</p>
                  </div>
                  <span className="font-display text-3xl text-gold">{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
