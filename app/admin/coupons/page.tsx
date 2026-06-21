"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Loader2, RefreshCw } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { getCoupons, createCoupon, deleteCoupon } from "@/app/actions/coupons";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  isActive: boolean;
  createdAt: Date | string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function loadCoupons() {
    setIsLoading(true);
    try {
      const res = await getCoupons();
      if (res.success && res.coupons) {
        setCoupons(res.coupons as unknown as Coupon[]);
      } else {
        toast.error(res.error || "Failed to load coupons");
      }
    } catch (error) {
      console.error("Error loading coupons:", error);
      toast.error("Failed to load coupons");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      toast.error("Please enter a valid positive discount value");
      return;
    }

    if (type === "PERCENTAGE" && numericValue > 100) {
      toast.error("Percentage discount cannot exceed 100%");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCoupon(cleanCode, type, numericValue, isActive);
      if (res.success && res.coupon) {
        toast.success(`Coupon "${cleanCode}" created successfully!`);
        // Reset form
        setCode("");
        setValue("");
        setIsActive(true);
        // Reload list
        await loadCoupons();
      } else {
        toast.error(res.error || "Failed to create coupon");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("An error occurred while creating coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;

    try {
      const res = await deleteCoupon(id);
      if (res.success) {
        toast.success(`Coupon "${couponCode}" deleted successfully`);
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(res.error || "Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  const INPUT_CLS =
    "w-full border border-border px-3 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all text-sm";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-jungle">Coupons</h2>
        <p className="text-sm text-jungle/60">Create and manage customer discount codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Create Coupon Form */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-6 lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Tag className="w-5 h-5 text-gold" />
            <h3 className="font-display text-lg text-jungle">Create Coupon</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-jungle/80 mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. WILD15"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={INPUT_CLS}
              />
              <p className="text-[10px] text-jungle/40 mt-1">Codes will be automatically converted to uppercase.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-jungle/80 mb-1">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "PERCENTAGE" | "FIXED")}
                  className={INPUT_CLS}
                >
                  <option value="PERCENTAGE">Percent (%)</option>
                  <option value="FIXED">Fixed (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-jungle/80 mb-1">Value</label>
                <input
                  type="number"
                  placeholder={type === "PERCENTAGE" ? "15" : "150"}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  min="0"
                  step="0.01"
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-gold border-border focus:ring-gold rounded bg-cream"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-jungle/80 cursor-pointer select-none">
                Active &amp; Redeemable
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-jungle text-gold py-2.5 rounded-btn flex items-center justify-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Creating…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Create Coupon
                </>
              )}
            </button>
          </form>
        </div>

        {/* Coupon List Table */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-border flex items-center justify-between bg-cream/30">
            <h3 className="font-display text-sm font-bold text-jungle">All Discount Codes</h3>
            <button
              onClick={loadCoupons}
              className="p-1.5 hover:bg-cream rounded text-jungle/60 hover:text-jungle transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-jungle/60">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
              <p className="text-sm font-medium">Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20 text-jungle/40 text-sm">No coupons found. Create one to get started!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-ivory border-b border-border text-xs uppercase tracking-wider text-jungle/70">
                  <tr>
                    <th className="px-6 py-4 font-medium">Code</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Value</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-cream/20 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-jungle">
                        <span className="font-mono bg-cream px-2 py-1 rounded text-gold border border-gold/20">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-jungle/70">
                        {coupon.type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-jungle">
                        {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : formatINR(coupon.value)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            coupon.isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-jungle/50">
                        {new Date(coupon.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          className="p-1 text-jungle/30 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
