"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Database } from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import { getProducts, deleteProduct, seedMockProducts, addProduct } from "@/app/actions/products";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // New Product Form State
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCat, setNewCat] = useState("necklaces");
  const [newImage, setNewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    const res = await seedMockProducts();
    if (res.success) {
      toast.success("Database seeded!");
      loadProducts();
    } else {
      toast.error("Failed to seed database.");
    }
    setIsSeeding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Product deleted");
      loadProducts();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await addProduct({
      name: newName,
      description: newDesc,
      price: parseFloat(newPrice),
      category: newCat,
      images: [newImage || "/images/products/placeholder.png"],
      inStock: true
    });
    
    if (res.success) {
      toast.success("Product added successfully!");
      setIsModalOpen(false);
      // Reset form
      setNewName(""); setNewDesc(""); setNewPrice(""); setNewImage("");
      loadProducts();
    } else {
      toast.error("Failed to add product");
    }
    setIsSubmitting(false);
  };

  const filteredProducts = products.filter((p) => 
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
        <div className="flex gap-2">
          {products.length === 0 && !isLoading && (
            <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="bg-ivory border border-gold text-gold px-4 py-2 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-gold/10 transition-colors"
            >
              <Database className="w-4 h-4" /> {isSeeding ? "Seeding..." : "Seed Mock Data"}
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-jungle text-gold px-4 py-2 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-jungle/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="font-display text-2xl text-jungle mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-jungle mb-1">Name</label>
                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-jungle mb-1">Description</label>
                <textarea required value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full px-3 py-2 border rounded-lg resize-none" rows={3}></textarea>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-jungle mb-1">Price (₹)</label>
                  <input required type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-jungle mb-1">Category</label>
                  <select value={newCat} onChange={e => setNewCat(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="rings">Rings</option>
                    <option value="bracelets">Bracelets</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-jungle mb-1">Image URL</label>
                <input type="text" placeholder="/images/products/..." value={newImage} onChange={e => setNewImage(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-jungle hover:bg-cream rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gold text-jungle rounded-lg font-medium">{isSubmitting ? "Saving..." : "Save Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-jungle/50 text-sm">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-jungle/50 text-sm">
                    No products found.
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-forest flex-shrink-0">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${product.images?.[0]})` }} />
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
                      <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-jungle">{product.inStock ? 'In stock' : 'Out of stock'}</span>
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
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
