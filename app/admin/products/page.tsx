"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Filter, Edit, Trash2, Database,
  ChevronDown, X, CheckSquare, Square, Minus,
  Tag, Package, Star, AlertCircle, RefreshCw,
} from "lucide-react";
import { formatINR } from "@/lib/utils/currency";
import {
  getProducts,
  deleteProduct,
  seedMockProducts,
  bulkUpdateProducts,
  bulkDeleteProducts,
  getDistinctProductCategories,
  type BulkUpdatePayload,
} from "@/app/actions/products";
import { toast } from "sonner";

type AdminProduct = Awaited<ReturnType<typeof getProducts>>[number];

/* ─────────────────────────────────────────── filter state ─── */
type StockFilter    = "all" | "in" | "out";
type FeaturedFilter = "all" | "yes" | "no";

interface Filters {
  category: string;
  stock:    StockFilter;
  featured: FeaturedFilter;
}

const DEFAULT_FILTERS: Filters = { category: "all", stock: "all", featured: "all" };

/* ──────────────────────────────── bulk-edit modal state ─── */
interface BulkEditState {
  field: "stock" | "featured" | "price" | "category" | "";
  inStock:   boolean;
  featured:  boolean;
  price:     string;
  category:  string;
}

const DEFAULT_BULK: BulkEditState = {
  field: "", inStock: true, featured: false, price: "", category: "",
};

/* ═══════════════════════════════════════════════════════════ */
export default function AdminProductsPage() {
  const [products,    setProducts]    = useState<AdminProduct[]>([]);
  const [categories,  setCategories]  = useState<string[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isSeeding,   setIsSeeding]   = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Filter panel
  const [showFilter, setShowFilter] = useState(false);
  const [filters,    setFilters]    = useState<Filters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<Filters>(DEFAULT_FILTERS);

  // Multi-select
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Bulk-edit modal
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [bulkEdit,     setBulkEdit]     = useState<BulkEditState>(DEFAULT_BULK);
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  /* ── load ── */
  const loadProducts = useCallback(async () => {
    const [data, cats] = await Promise.all([getProducts(), getDistinctProductCategories()]);
    setProducts(data);
    setCategories(cats);
    setSelected(new Set());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setIsLoading(true);
      const [data, cats] = await Promise.all([getProducts(), getDistinctProductCategories()]);
      if (mounted) {
        setProducts(data);
        setCategories(cats);
        setSelected(new Set());
        setIsLoading(false);
      }
    };
    fetchProducts();
    return () => { mounted = false; };
  }, [loadProducts]);

  /* ── filter + search ── */
  const filteredProducts = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      if (filters.category !== "all" && p.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.stock === "in"  && !p.inStock)  return false;
      if (filters.stock === "out" &&  p.inStock)  return false;
      if (filters.featured === "yes" && !p.featured) return false;
      if (filters.featured === "no"  &&  p.featured) return false;
      return true;
    });
  }, [products, searchTerm, filters]);

  const activeFilterCount = [
    filters.category !== "all",
    filters.stock    !== "all",
    filters.featured !== "all",
  ].filter(Boolean).length;

  /* ── selection helpers ── */
  const allVisibleIds   = filteredProducts.map((p) => p.id);
  const allSelected     = allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id));
  const someSelected    = allVisibleIds.some((id) => selected.has(id)) && !allSelected;
  const selectedCount   = selected.size;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allVisibleIds));
    }
  };

  /* ── delete single ── */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const res = await deleteProduct(id);
    if (res.success) { toast.success("Product deleted"); loadProducts(); }
    else              toast.error("Failed to delete");
  };

  /* ── bulk delete ── */
  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedCount} product(s)? This cannot be undone.`)) return;
    const res = await bulkDeleteProducts([...selected]);
    if (res.success) { toast.success(`${selectedCount} product(s) deleted`); loadProducts(); }
    else              toast.error("Bulk delete failed");
  };

  /* ── bulk edit save ── */
  const handleBulkSave = async () => {
    if (!bulkEdit.field) { toast.error("Choose a field to update"); return; }
    setIsBulkSaving(true);
    const payload: BulkUpdatePayload = {};
    if (bulkEdit.field === "stock")    payload.inStock   = bulkEdit.inStock;
    if (bulkEdit.field === "featured") payload.featured  = bulkEdit.featured;
    if (bulkEdit.field === "price") {
      const num = parseFloat(bulkEdit.price);
      if (isNaN(num) || num < 0) { toast.error("Enter a valid price"); setIsBulkSaving(false); return; }
      payload.price = num;
    }
    if (bulkEdit.field === "category") {
      if (!bulkEdit.category) { toast.error("Choose a category"); setIsBulkSaving(false); return; }
      payload.category = bulkEdit.category;
    }
    const res = await bulkUpdateProducts([...selected], payload);
    setIsBulkSaving(false);
    if (res.success) {
      toast.success(`${selectedCount} product(s) updated`);
      setShowBulkEdit(false);
      setBulkEdit(DEFAULT_BULK);
      loadProducts();
    } else {
      toast.error("Bulk update failed");
    }
  };

  /* ── seed ── */
  const handleSeed = async () => {
    setIsSeeding(true);
    const res = await seedMockProducts();
    if (res.success) { toast.success("Database seeded!"); loadProducts(); }
    else              toast.error("Failed to seed database.");
    setIsSeeding(false);
  };

  /* ════════════════════════════════════════════ RENDER ══════ */
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-2xl text-jungle">Products</h2>
          <p className="text-sm text-jungle/60">Manage your catalogue and inventory.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {products.length === 0 && !isLoading && (
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="bg-ivory border border-gold text-gold px-4 py-2 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-gold/10 transition-colors"
            >
              <Database className="w-4 h-4" /> {isSeeding ? "Seeding…" : "Seed Mock Data"}
            </button>
          )}
          <Link
            href="/admin/products/new"
            className="bg-jungle text-gold px-4 py-2 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* ── Main Card ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-cream/30">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jungle/40" />
            <input
              type="text"
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Right-side actions */}
          <div className="flex gap-2 flex-wrap">
            {/* Refresh */}
            <button
              onClick={loadProducts}
              className="p-2 text-jungle/50 hover:text-jungle border border-border rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Filter button */}
            <button
              onClick={() => { setPendingFilters(filters); setShowFilter((v) => !v); }}
              className={`flex items-center gap-2 text-sm border px-4 py-2 rounded-lg transition-colors ${
                activeFilterCount > 0
                  ? "bg-gold/10 border-gold text-gold"
                  : "text-jungle border-border bg-cream/40 hover:bg-cream/60 focus:bg-cream/80"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gold text-white text-[10px] font-bold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Filter Panel ── */}
        {showFilter && (
          <div className="border-b border-border bg-ivory/50 p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap gap-4 items-end">

              {/* Category */}
              <div className="flex flex-col gap-1 min-w-[160px]">
                <label className="text-xs font-semibold text-jungle/60 uppercase tracking-wider">Category</label>
                <div className="relative">
                  <select
                    value={pendingFilters.category}
                    onChange={(e) => setPendingFilters((f) => ({ ...f, category: e.target.value }))}
                    className="w-full appearance-none border border-border rounded-lg px-3 py-2 text-sm bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold pr-8 transition-colors"
                  >
                    <option value="all">All categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jungle/40" />
                </div>
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1 min-w-[140px]">
                <label className="text-xs font-semibold text-jungle/60 uppercase tracking-wider">Stock</label>
                <div className="relative">
                  <select
                    value={pendingFilters.stock}
                    onChange={(e) => setPendingFilters((f) => ({ ...f, stock: e.target.value as StockFilter }))}
                    className="w-full appearance-none border border-border rounded-lg px-3 py-2 text-sm bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold pr-8 transition-colors"
                  >
                    <option value="all">All</option>
                    <option value="in">In stock</option>
                    <option value="out">Out of stock</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jungle/40" />
                </div>
              </div>

              {/* Featured */}
              <div className="flex flex-col gap-1 min-w-[140px]">
                <label className="text-xs font-semibold text-jungle/60 uppercase tracking-wider">Featured</label>
                <div className="relative">
                  <select
                    value={pendingFilters.featured}
                    onChange={(e) => setPendingFilters((f) => ({ ...f, featured: e.target.value as FeaturedFilter }))}
                    className="w-full appearance-none border border-border rounded-lg px-3 py-2 text-sm bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold pr-8 transition-colors"
                  >
                    <option value="all">All</option>
                    <option value="yes">Featured</option>
                    <option value="no">Not featured</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jungle/40" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 ml-auto pt-5">
                <button
                  onClick={() => { setPendingFilters(DEFAULT_FILTERS); setFilters(DEFAULT_FILTERS); }}
                  className="px-3 py-2 text-sm border border-border rounded-lg text-jungle/60 bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => { setFilters(pendingFilters); setShowFilter(false); }}
                  className="px-4 py-2 text-sm bg-jungle text-gold rounded-lg hover:bg-charcoal transition-colors font-medium"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {filters.category !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gold/10 text-gold border border-gold/30 font-medium">
                    <Tag className="w-3 h-3" /> {filters.category}
                    <button onClick={() => setFilters((f) => ({ ...f, category: "all" }))}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filters.stock !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gold/10 text-gold border border-gold/30 font-medium">
                    <Package className="w-3 h-3" /> {filters.stock === "in" ? "In stock" : "Out of stock"}
                    <button onClick={() => setFilters((f) => ({ ...f, stock: "all" }))}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {filters.featured !== "all" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gold/10 text-gold border border-gold/30 font-medium">
                    <Star className="w-3 h-3" /> {filters.featured === "yes" ? "Featured" : "Not featured"}
                    <button onClick={() => setFilters((f) => ({ ...f, featured: "all" }))}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Bulk Action Bar ── */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-3 px-6 py-3 bg-jungle/5 border-b border-jungle/10 animate-in slide-in-from-top-1 duration-150">
            <span className="text-sm font-semibold text-jungle">
              {selectedCount} selected
            </span>
            <div className="h-4 w-px bg-jungle/20" />
            <button
              onClick={() => { setBulkEdit(DEFAULT_BULK); setShowBulkEdit(true); }}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-jungle text-gold rounded-lg hover:bg-charcoal transition-colors font-medium"
            >
              <Edit className="w-3.5 h-3.5" /> Bulk Edit
            </button>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="ml-auto text-jungle/40 hover:text-jungle p-1 rounded transition-colors"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-ivory border-b border-border text-xs uppercase tracking-wider text-jungle/70">
              <tr>
                {/* Select-all checkbox */}
                <th className="pl-6 py-4 w-10">
                  <button
                    onClick={toggleAll}
                    className="text-jungle/40 hover:text-jungle transition-colors"
                    title={allSelected ? "Deselect all" : "Select all"}
                  >
                    {allSelected  ? <CheckSquare className="w-4 h-4 text-jungle" /> :
                     someSelected ? <Minus       className="w-4 h-4 text-jungle/60" /> :
                                    <Square      className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-4 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Inventory</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-jungle/50 text-sm">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-jungle/30" />
                    Loading products…
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-jungle/20" />
                    <p className="text-sm text-jungle/50">No products found.</p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => setFilters(DEFAULT_FILTERS)}
                        className="mt-2 text-xs text-gold hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isChecked = selected.has(product.id);
                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors ${isChecked ? "bg-gold/5" : "hover:bg-cream/20"}`}
                    >
                      {/* Checkbox */}
                      <td className="pl-6 py-4">
                        <button
                          onClick={() => toggleSelect(product.id)}
                          className="text-jungle/40 hover:text-jungle transition-colors"
                        >
                          {isChecked
                            ? <CheckSquare className="w-4 h-4 text-jungle" />
                            : <Square      className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-forest flex-shrink-0">
                            <div
                              className="w-full h-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${product.images?.[0]})` }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-jungle">{product.name}</p>
                            <p className="text-xs text-jungle/40">ID: {product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-sm text-jungle/70 capitalize">
                        {product.mainCategory ? `${product.mainCategory.toUpperCase()} / ` : ""}{product.category}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-medium text-jungle">
                        {formatINR(product.price)}
                      </td>

                      {/* Inventory */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-500"}`} />
                          <span className="text-sm text-jungle">{product.inStock ? "In stock" : "Out of stock"}</span>
                        </div>
                      </td>

                      {/* Featured */}
                      <td className="px-6 py-4">
                        {product.featured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Featured
                          </span>
                        ) : (
                          <span className="text-xs text-jungle/30">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-jungle/50 hover:text-jungle hover:bg-cream rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!isLoading && (
          <div className="px-6 py-3 border-t border-border bg-cream/20 flex items-center justify-between text-xs text-jungle/50">
            <span>
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
              {activeFilterCount > 0 && " (filtered)"}
            </span>
            {selectedCount > 0 && (
              <span><strong>{selectedCount}</strong> selected</span>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════ Bulk-Edit Modal ══════════════════ */}
      {showBulkEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowBulkEdit(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-ivory/60">
              <div>
                <h3 className="text-base font-semibold text-jungle">Bulk Edit</h3>
                <p className="text-xs text-jungle/50 mt-0.5">Editing <strong>{selectedCount}</strong> product(s)</p>
              </div>
              <button
                onClick={() => setShowBulkEdit(false)}
                className="p-2 text-jungle/40 hover:text-jungle rounded-lg hover:bg-cream transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">

              {/* Field picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-jungle/60 uppercase tracking-wider">Field to update</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["stock", "featured", "price", "category"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setBulkEdit((s) => ({ ...s, field: f }))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        bulkEdit.field === f
                          ? "bg-jungle text-gold border-jungle"
                          : "border-border text-jungle/70 hover:border-gold hover:text-jungle"
                      }`}
                    >
                      {f === "stock"    && <Package   className="w-3.5 h-3.5" />}
                      {f === "featured" && <Star      className="w-3.5 h-3.5" />}
                      {f === "price"    && <Tag       className="w-3.5 h-3.5" />}
                      {f === "category" && <Filter    className="w-3.5 h-3.5" />}
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic value picker */}
              {bulkEdit.field === "stock" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-jungle/60 uppercase tracking-wider">Stock status</label>
                  <div className="flex gap-2">
                    {([true, false] as const).map((v) => (
                      <button
                        key={String(v)}
                        onClick={() => setBulkEdit((s) => ({ ...s, inStock: v }))}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          bulkEdit.inStock === v
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "border-border text-jungle/70 hover:border-emerald-400"
                        }`}
                      >
                        {v ? "In Stock" : "Out of Stock"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {bulkEdit.field === "featured" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-jungle/60 uppercase tracking-wider">Featured status</label>
                  <div className="flex gap-2">
                    {([true, false] as const).map((v) => (
                      <button
                        key={String(v)}
                        onClick={() => setBulkEdit((s) => ({ ...s, featured: v }))}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          bulkEdit.featured === v
                            ? "bg-amber-500 text-white border-amber-500"
                            : "border-border text-jungle/70 hover:border-amber-400"
                        }`}
                      >
                        {v ? "⭐ Featured" : "Not Featured"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {bulkEdit.field === "price" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-jungle/60 uppercase tracking-wider">New price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-jungle/50 font-medium text-sm">₹</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="e.g. 1200"
                      value={bulkEdit.price}
                      onChange={(e) => setBulkEdit((s) => ({ ...s, price: e.target.value }))}
                      className="w-full pl-7 pr-4 py-2.5 border border-border rounded-lg text-sm bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all"
                    />
                  </div>
                </div>
              )}

              {bulkEdit.field === "category" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-jungle/60 uppercase tracking-wider">New category</label>
                  <div className="relative">
                    <select
                      value={bulkEdit.category}
                      onChange={(e) => setBulkEdit((s) => ({ ...s, category: e.target.value }))}
                      className="w-full appearance-none border border-border rounded-lg px-3 py-2.5 text-sm bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold pr-8 transition-colors"
                    >
                      <option value="">— Select category —</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jungle/40" />
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-border bg-ivory/40">
              <button
                onClick={() => setShowBulkEdit(false)}
                className="flex-1 py-2.5 border border-border rounded-lg text-sm text-jungle/70 hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSave}
                disabled={isBulkSaving || !bulkEdit.field}
                className="flex-1 py-2.5 bg-jungle text-gold rounded-lg text-sm font-semibold hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBulkSaving ? "Saving…" : `Update ${selectedCount} Product${selectedCount !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
