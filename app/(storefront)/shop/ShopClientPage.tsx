"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { categoriesMatch } from "@/lib/categories";
import { Product } from "@/types/product";
import { getShopProducts } from "@/app/actions/products";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";

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
  initialTotalCount: number;
  dbMinPrice: number;
  dbMaxPrice: number;
  searchQuery?: string;
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
        <h3 className="font-sans text-xs tracking-widest uppercase font-bold text-jungle mb-4">Max Range</h3>
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
  initialTotalCount,
  dbMinPrice,
  dbMaxPrice,
  searchQuery = "",
}: ShopClientPageProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [productCategories] = useState<string[]>(["All", ...initialCategories]);
  const [search, setSearch] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setSearch(searchQuery);
  }

  // Pagination states
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const minPriceLimit = dbMinPrice;
  const maxPriceLimit = dbMaxPrice;
  const [priceMax, setPriceMax] = useState(dbMaxPrice);
  const [debouncedPriceMax, setDebouncedPriceMax] = useState(dbMaxPrice);

  // Debounce price slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceMax(priceMax);
    }, 400);
    return () => clearTimeout(timer);
  }, [priceMax]);

  // Keep track of whether component is in its first render to skip initial fetch
  const isFirstRender = useRef(true);

  // Fetch products when filters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    async function loadFilteredProducts() {
      setLoading(true);
      const res = await getShopProducts({
        skip: 0,
        take: 12,
        category: selectedCategory,
        sortBy,
        inStockOnly: showInStockOnly,
        priceMax: debouncedPriceMax,
        showBestsellers,
        search,
      });
      if (res.success) {
        setProducts(res.products.map(mapDbProductToUI));
        setTotalCount(res.totalCount);
      }
      setLoading(false);
    }

    loadFilteredProducts();
  }, [selectedCategory, sortBy, showInStockOnly, showBestsellers, debouncedPriceMax, search]);

  // Fetch more products (load more pagination)
  const loadMore = async () => {
    if (loading || loadingMore) return;
    setLoadingMore(true);
    const nextSkip = products.length;
    const res = await getShopProducts({
      skip: nextSkip,
      take: 12,
      category: selectedCategory,
      sortBy,
      inStockOnly: showInStockOnly,
      priceMax: debouncedPriceMax,
      showBestsellers,
      search,
    });
    if (res.success) {
      setProducts((prev) => [...prev, ...res.products.map(mapDbProductToUI)]);
      setTotalCount(res.totalCount);
    }
    setLoadingMore(false);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    // Local client filtering in case of state mismatches
    if (selectedCategory !== "All") {
      result = result.filter((product) => categoriesMatch(product.category, selectedCategory));
    }

    if (showInStockOnly) {
      result = result.filter((product) => product.inStock);
    }

    if (showBestsellers) {
      result = result.filter((product) => product.isBestseller);
    }

    if (showNewArrivals) {
      result = result.filter((product) => product.isNewArrival);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q)
      );
    }

    result = result.filter((product) => product.price <= priceMax);

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }

    return result;
  }, [
    products,
    priceMax,
    selectedCategory,
    showBestsellers,
    showInStockOnly,
    showNewArrivals,
    sortBy,
    search,
  ]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setShowInStockOnly(false);
    setShowBestsellers(false);
    setShowNewArrivals(false);
    setPriceMax(maxPriceLimit);
    setSearch("");
    router.replace("/shop", { scroll: false });
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-jungle py-12 text-center border-b border-border">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="w-12 h-[1px] bg-gold/40" />
          <span className="text-gold text-xs tracking-widest uppercase font-bold">WWJ Store</span>
          <span className="w-12 h-[1px] bg-gold/40" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory">Shop All</h1>
        <p className="font-sans text-sm text-ivory/60 mt-3">Handcrafted Wildlife-Inspired Jewellery &amp; Accessories</p>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
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
            {search && (
              <div className="flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-btn px-4 py-2 mb-6 w-fit text-sm text-jungle animate-fadeIn">
                <span>Search results for: <span className="font-bold">&quot;{search}&quot;</span></span>
                <button
                  onClick={() => {
                    setSearch("");
                    router.replace("/shop", { scroll: false });
                  }}
                  className="hover:text-gold text-xs underline font-bold cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mb-8 gap-4">
              <p className="text-sm text-jungle/60">
                Showing <span className="font-bold text-jungle">{filtered.length}</span> of <span className="font-bold text-jungle">{totalCount}</span> products
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

            {filtered.length === 0 && !loading ? (
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
              <>
                <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {products.length < totalCount && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={loadMore}
                      disabled={loading || loadingMore}
                      className="bg-jungle text-gold border border-jungle px-8 py-3 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-gold hover:text-jungle transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {loadingMore ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </>
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
