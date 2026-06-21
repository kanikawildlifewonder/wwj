"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/utils/currency";
import { Lock, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sendOrderConfirmationEmail } from "@/app/actions/emails";
import { useUser } from "@clerk/nextjs";
import { createRazorpayOrder, createOrder } from "@/app/actions/orders";
import { getPageContent } from "@/app/actions/content";
import { validateCoupon } from "@/app/actions/coupons";

interface RazorpayOptions {
  key: string;
  amount: number | string;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: {
      new(options: RazorpayOptions): { open: () => void };
    };
  }
}

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
  const { user } = useUser();
  const { items, subtotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [shippingThreshold, setShippingThreshold] = useState(1499);
  const [shippingFeeConfig, setShippingFeeConfig] = useState(99);

  useEffect(() => {
    getPageContent("store-settings").then((raw) => {
      if (raw) {
        try {
          const s = JSON.parse(raw);
          if (typeof s.shippingThreshold === "number") setShippingThreshold(s.shippingThreshold);
          if (typeof s.shippingFee === "number") setShippingFeeConfig(s.shippingFee);
        } catch { /* keep default */ }
      }
    });

    getPageContent("brand-logo").then((raw) => {
      if (raw) {
        try {
          const l = JSON.parse(raw);
          if (l.imageUrl) setLogoUrl(l.imageUrl);
        } catch { /* keep default */ }
      }
    });
  }, []);

  const applyCoupon = async () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const res = await validateCoupon(code, subtotal());
      if (res.success && res.discount !== undefined) {
        setAppliedCoupon(res.code ?? code);
        setAppliedDiscount(res.discount);
        toast.success(`Coupon "${res.code ?? code}" applied successfully!`);
      } else {
        setCouponError(res.error ?? "Invalid coupon code");
      }
    } catch {
      setCouponError("Failed to validate coupon. Please try again.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon("");
    setAppliedDiscount(0);
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon code removed");
  };

  const shippingFee = subtotal() >= shippingThreshold ? 0 : shippingFeeConfig;
  const total = Math.max(0, subtotal() + shippingFee - appliedDiscount);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    setIsProcessing(true);

    // 1. Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
      setIsProcessing(false);
      return;
    }

    // 2. Create Razorpay order on server
    const rzpOrderRes = await createRazorpayOrder(total);
    if (!rzpOrderRes.success || !rzpOrderRes.id) {
      toast.error(rzpOrderRes.error || "Failed to create payment order. Try again.");
      setIsProcessing(false);
      return;
    }

    // 3. Open Razorpay payment modal
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast.error("Razorpay key not configured. Please contact support.");
      setIsProcessing(false);
      return;
    }

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: Number(rzpOrderRes.amount),
      currency: rzpOrderRes.currency,
      name: "WWJ",
      description: "Wildlife Wonder Jewellery",
      image: logoUrl || `${window.location.origin}/og-image.png`,
      order_id: rzpOrderRes.id,
      handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
        try {
          // On payment success:
          // Call server action to create the order in the database
          const dbOrderItems = items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          }));

          const orderRes = await createOrder(
            {
              clerkUserId: user?.id || null,
              customerName: `${values.firstName} ${values.lastName}`,
              customerEmail: values.email,
              totalAmount: total,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            },
            dbOrderItems
          );

          if (!orderRes.success || !orderRes.order) {
            throw new Error(orderRes.error || "Failed to save order to database.");
          }

          // Send confirmation email (already styled/working in app)
          const orderItems = items.map(item => ({
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            category: item.product.category,
          }));
          await sendOrderConfirmationEmail({
            customerName: `${values.firstName} ${values.lastName}`,
            customerEmail: values.email,
            customerPhone: values.phone,
            customerAddress: values.address,
            customerCity: values.city,
            customerState: values.state,
            customerPincode: values.pincode,
            items: orderItems,
            subtotal: subtotal(),
            shippingFee: shippingFee,
            total: total,
            discount: appliedDiscount,
          });

          // Generate and open WhatsApp message automatically
          const orderItemsText = items
            .map((item) => `• *${item.product.name}* x ${item.quantity} (${formatINR(item.product.price * item.quantity)})`)
            .join("\n");

          const shippingAddressText = `${values.address}, ${values.city}, ${values.state} - ${values.pincode}`;

          const whatsappMsg =
            `🛍️ *NEW ORDER ON WWJ* 🛍️\n\n` +
            `*Order ID:* #${orderRes.order.id}\n` +
            `*Customer:* ${values.firstName} ${values.lastName}\n` +
            `*Phone:* ${values.phone}\n` +
            `*Email:* ${values.email}\n\n` +
            `*Shipping Address:*\n${shippingAddressText}\n\n` +
            `*Items Ordered:*\n${orderItemsText}\n\n` +
            `*Subtotal:* ${formatINR(subtotal())}\n` +
            (appliedDiscount > 0 ? `*Discount:* -${formatINR(appliedDiscount)} (${appliedCoupon})\n` : "") +
            `*Shipping:* ${shippingFee === 0 ? "FREE" : formatINR(shippingFee)}\n` +
            `*Total Paid:* ${formatINR(total)}\n\n` +
            `_Payment processed successfully via Razorpay._`;

          const finalWhatsappUrl = `https://wa.me/919849077246?text=${encodeURIComponent(whatsappMsg)}`;
          setWhatsappUrl(finalWhatsappUrl);

          // Clear Cart and set confirmation view
          clearCart();
          setOrderPlaced(true);
          toast.success("Payment successful! Order placed.");

          // Automatically redirect to WhatsApp (avoid popup blocking)
          window.location.href = finalWhatsappUrl;
        } catch (error) {
          console.error("Order completion failed:", error);
          toast.error("Failed to complete order. Please contact support with payment receipt.");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        contact: values.phone,
      },
      theme: {
        color: "#071D16",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

        {/* WhatsApp Business Integration */}
        <div className="bg-emerald-50/50 border border-emerald-500/10 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
          <h3 className="font-display text-lg text-jungle mb-1.5 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#25D366] fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order Updates via WhatsApp
          </h3>
          <p className="text-jungle/60 text-xs mb-4">
            Chat with us directly to receive real-time updates and notifications regarding your order.
          </p>
          <a
            href={whatsappUrl || "https://wa.me/919849077246"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-btn font-bold text-xs uppercase tracking-wider hover:bg-[#20ba59] transition-colors shadow-sm"
          >
            Chat on WhatsApp
          </a>
        </div>

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
    <div className="bg-cream min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-6xl">
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
                    <input {...register("email")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream text-jungle focus:outline-none focus:border-gold" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">First Name</label>
                    <input {...register("firstName")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream text-jungle focus:outline-none focus:border-gold" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">Last Name</label>
                    <input {...register("lastName")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream text-jungle focus:outline-none focus:border-gold" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-jungle/70 mb-1">Phone Number</label>
                    <input {...register("phone")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream text-jungle focus:outline-none focus:border-gold" />
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
                    <input {...register("address")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream text-jungle focus:outline-none focus:border-gold" />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">City</label>
                    <input {...register("city")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream text-jungle focus:outline-none focus:border-gold" />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">State / Province</label>
                    <input {...register("state")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream text-jungle focus:outline-none focus:border-gold" />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-jungle/70 mb-1">PIN Code / ZIP</label>
                    <input {...register("pincode")} className="w-full border border-border px-4 py-3 rounded-btn bg-cream text-jungle focus:outline-none focus:border-gold" />
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
            <div className="bg-jungle text-ivory rounded-xl p-5 sm:p-6 md:p-8 sticky top-28">
              <h2 className="font-display text-xl mb-6 text-gold">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded bg-forest shrink-0 relative overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
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
                {/* Coupon Code Input */}
                <div className="pb-4 border-b border-ivory/10">
                  <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-2">Discount Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      placeholder="e.g. WILD15"
                      className="grow bg-cream/10 border border-ivory/20 px-3 py-1.5 rounded-lg text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold uppercase"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={isValidatingCoupon}
                      className="bg-gold text-jungle px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-60 flex items-center gap-1"
                    >
                      {isValidatingCoupon ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                      {isValidatingCoupon ? "Checking…" : "Apply"}
                    </button>
                  </div>
                  {couponError && <p className="text-red-400 text-[11px] mt-1.5 font-medium">{couponError}</p>}
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between items-center bg-gold/10 text-gold rounded-lg p-2.5 mt-3 text-xs border border-gold/20">
                      <span className="font-semibold">Applied: {appliedCoupon} (-{formatINR(appliedDiscount)})</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-ivory hover:text-gold transition-colors font-bold underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-ivory/70 pt-2">
                  <span>Subtotal</span>
                  <span className="text-ivory">{formatINR(subtotal())}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-{formatINR(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ivory/70">
                  <span>Shipping</span>
                  <span className="text-ivory">{shippingFee === 0 ? "FREE" : formatINR(shippingFee)}</span>
                </div>
                <div className="border-t border-ivory/10 pt-3 flex justify-between items-end">
                  <div>
                    <span className="font-bold text-lg">Total</span>
                    <p className="text-xs text-ivory/40">Including GST</p>
                  </div>
                  <span className="font-display text-2xl sm:text-3xl text-gold">{formatINR(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
