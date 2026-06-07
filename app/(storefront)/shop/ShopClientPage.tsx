"use client";

import React, { useMemo, useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { categoriesMatch } from "@/lib/categories";
import { Product } from "@/types/product";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Top Rated", value: "rating" },
];

type FilterPanelProps = {
  maxPriceLimit: number;
  minPriceLimit: number;
  priceMax: number;
  productCategories: string[];
  selectedCategory: string;
  setPriceMax: (value: number) => void;
  setSelectedCategory: (value: string) => void;
  showBestsellers: boolean;
  setShowBestsellers: (value: boolean) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (value: boolean) => void;
  showNewArrivals: boolean;
  setShowNewArrivals: (value: boolean) => void;
};

type ShopClientPageProps = {
  initialProducts: Product[];
  initialCategories: string[];
};

function FilterPanel({
  maxPriceLimit,
  minPriceLimit,
  priceMax,
  productCategories,
  selectedCategory,
  setPriceMax,
  setSelectedCategory,
  showBestsellers,
  setShowBestsellers,
  showInStockOnly,
  setShowInStockOnly,
  showNewArrivals,
  setShowNewArrivals,
}: FilterPanelProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-sans text-xs tracking-widest uppercase font-bold text-jungle mb-4">Category</h3>
        <div className="space-y-2">
          {productCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block text-sm w-full text-left py-1 transition-colors ${selectedCategory === cat ? "text-gold-dark font-bold" : "text-jungle/70 hover:text-jungle"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-sans text-xs tracking-widest uppercase font-bold text-jungle mb-4">Max Price</h3>
        <input
          type="range"
          min={minPriceLimit}
          max={maxPriceLimit}
          step={Math.max(1, Math.round((maxPriceLimit - minPriceLimit) / 50))}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-gold"
        />
        <div className="flex justify-between text-xs text-jungle/60 mt-1">
          <span>Rs. {minPriceLimit.toLocaleString("en-IN")}</span>
          <span className="font-bold text-jungle">Rs. {priceMax.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: "In Stock Only", state: showInStockOnly, set: setShowInStockOnly },
          { label: "Bestsellers Only", state: showBestsellers, set: setShowBestsellers },
          { label: "New Arrivals Only", state: showNewArrivals, set: setShowNewArrivals },
        ].map(({ label, state, set }) => (
          <label key={label} className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set(!state)}
              className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 ${state ? "bg-gold" : "bg-jungle/20"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white mt-0.5 mx-0.5 shadow transition-transform ${state ? "translate-x-4" : "translate-x-0"}`} />
            </div>
            <span className="text-sm text-jungle/80 group-hover:text-jungle">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ShopClientPage({
  initialProducts,
  initialCategories,
}: ShopClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [allProducts] = useState<Product[]>(initialProducts);
  const [productCategories] = useState<string[]>(["All", ...initialCategories]);

  const { minPriceLimit, maxPriceLimit } = useMemo(() => {
    if (allProducts.length === 0) {
      return { minPriceLimit: 0, maxPriceLimit: 5000 };
    }

    const prices = allProducts.map((product) => product.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const minLimit = Math.max(0, Math.floor(min / 100) * 100);
    const maxLimit = Math.max(minLimit + 100, Math.ceil(max / 100) * 100);

    return { minPriceLimit: minLimit, maxPriceLimit: maxLimit };
  }, [allProducts]);

  const [priceMax, setPriceMax] = useState(() => {
    if (initialProducts.length === 0) return 5000;
    const max = Math.max(...initialProducts.map((product) => product.price));
    return Math.ceil(max / 100) * 100;
  });

  const filtered = useMemo(() => {
    let products = [...allProducts];

    if (selectedCategory !== "All") {
      products = products.filter((product) => categoriesMatch(product.category, selectedCategory));
    }

    if (showInStockOnly) {
      products = products.filter((product) => product.inStock);
    }

    if (showBestsellers) {
      products = products.filter((product) => product.isBestseller);
    }

    if (showNewArrivals) {
      products = products.filter((product) => product.isNewArrival);
    }

    products = products.filter((product) => product.price <= priceMax);

    switch (sortBy) {
      case "price_asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        products.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;
      case "rating":
        products.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }

    return products;
  }, [
    allProducts,
    priceMax,
    selectedCategory,
    showBestsellers,
    showInStockOnly,
    showNewArrivals,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setShowInStockOnly(false);
    setShowBestsellers(false);
    setShowNewArrivals(false);
    setPriceMax(maxPriceLimit);
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-jungle py-12 text-center border-b border-border">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="w-12 h-[1px] bg-gold/40" />
          <span className="text-gold text-xs tracking-widest uppercase font-bold">WWJ Store</span>
          <span className="w-12 h-[1px] bg-gold/40" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-ivory">Shop All</h1>
        <p className="font-sans text-sm text-ivory/60 mt-3">Handcrafted Wildlife-Inspired Jewellery &amp; Accessories</p>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-28 h-fit">
            <h2 className="font-sans text-xs tracking-widest uppercase font-bold text-jungle mb-6 border-b border-jungle/10 pb-3">Filters</h2>
            <FilterPanel
              maxPriceLimit={maxPriceLimit}
              minPriceLimit={minPriceLimit}
              priceMax={priceMax}
              productCategories={productCategories}
              selectedCategory={selectedCategory}
              setPriceMax={setPriceMax}
              setSelectedCategory={setSelectedCategory}
              setShowBestsellers={setShowBestsellers}
              setShowInStockOnly={setShowInStockOnly}
              setShowNewArrivals={setShowNewArrivals}
              showBestsellers={showBestsellers}
              showInStockOnly={showInStockOnly}
              showNewArrivals={showNewArrivals}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8 gap-4">
              <p className="text-sm text-jungle/60">
                <span className="font-bold text-jungle">{filtered.length}</span> products
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-jungle/20 px-4 py-2 text-xs font-bold tracking-wider text-jungle rounded-btn"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none border border-jungle/20 bg-ivory px-4 py-2 pr-8 text-xs font-medium text-jungle rounded-btn focus:outline-none focus:border-gold cursor-pointer"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-jungle/50 pointer-events-none" />
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-2xl text-jungle/40">No products found</p>
                <p className="text-sm text-jungle/30 mt-2">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="mt-6 border border-jungle/30 text-jungle px-6 py-2 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-jungle hover:text-ivory transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-ivory overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sans text-sm tracking-widest uppercase font-bold text-jungle">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5 text-jungle" />
              </button>
            </div>
            <FilterPanel
              maxPriceLimit={maxPriceLimit}
              minPriceLimit={minPriceLimit}
              priceMax={priceMax}
              productCategories={productCategories}
              selectedCategory={selectedCategory}
              setPriceMax={setPriceMax}
              setSelectedCategory={setSelectedCategory}
              setShowBestsellers={setShowBestsellers}
              setShowInStockOnly={setShowInStockOnly}
              setShowNewArrivals={setShowNewArrivals}
              showBestsellers={showBestsellers}
              showInStockOnly={showInStockOnly}
              showNewArrivals={showNewArrivals}
            />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full bg-jungle text-gold py-3 text-xs font-bold tracking-widest uppercase rounded-btn"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
