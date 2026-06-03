"use client";

import React, { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { formatINR } from "@/lib/utils/currency";
import Image from "next/image";

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = MOCK_PRODUCTS.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-2xl text-jungle">Products</h2>
          <p className="text-sm text-jungle/60">Manage your catalogue and inventory.</p>
        </div>
        <button className="bg-jungle text-gold px-4 py-2 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-cream/30">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jungle/40" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-jungle border border-border px-4 py-2 rounded-lg bg-white hover:bg-cream transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory border-b border-border text-xs uppercase tracking-wider text-jungle/70">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Inventory</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-forest flex-shrink-0">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.images[0]})` }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-jungle">{product.name}</p>
                        <p className="text-xs text-jungle/50">ID: {product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-jungle/70 capitalize">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-jungle">
                    {formatINR(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stockCount > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-sm text-jungle">{product.stockCount} in stock</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-jungle/50 hover:text-jungle hover:bg-cream rounded-md transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-jungle/50 text-sm">
                    No products found matching "{searchTerm}"
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
