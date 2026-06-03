"use client";

import React from "react";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl text-jungle">Settings</h2>
        <p className="text-sm text-jungle/60">Manage your store preferences and configuration.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-8">
        
        {/* General Settings */}
        <section>
          <h3 className="font-display text-lg text-jungle mb-4 border-b border-border pb-2">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Store Name</label>
              <input type="text" defaultValue="WWJ Wildlife Jewellery" className="w-full border border-border px-3 py-2 rounded-lg bg-cream/30 focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Contact Email</label>
              <input type="email" defaultValue="hello@wwj.com" className="w-full border border-border px-3 py-2 rounded-lg bg-cream/30 focus:outline-none focus:border-gold" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-jungle/80 mb-1">Store Description</label>
              <textarea rows={3} defaultValue="Premium handcrafted wildlife-inspired jewellery for a cause." className="w-full border border-border px-3 py-2 rounded-lg bg-cream/30 focus:outline-none focus:border-gold" />
            </div>
          </div>
        </section>

        {/* Shipping Settings */}
        <section>
          <h3 className="font-display text-lg text-jungle mb-4 border-b border-border pb-2">Shipping & Currency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Primary Currency</label>
              <select className="w-full border border-border px-3 py-2 rounded-lg bg-cream/30 focus:outline-none focus:border-gold">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Free Shipping Threshold</label>
              <input type="number" defaultValue="1499" className="w-full border border-border px-3 py-2 rounded-lg bg-cream/30 focus:outline-none focus:border-gold" />
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <button className="bg-jungle text-gold px-6 py-2 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
