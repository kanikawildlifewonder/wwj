"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, FileDown, Search } from "lucide-react";
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
  catalogPdfUrl?: string;
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
        <div className="space-y-1.5">
          {productCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block text-[11px] font-semibold uppercase tracking-wider w-full text-left py-2 px-3 border-l-2 transition-all duration-300 ${
                selectedCategory === cat
                  ? "text-gold bg-jungle border-gold font-bold pl-4 rounded-r-md"
                  : "text-jungle/70 hover:text-jungle border-transparent hover:border-jungle/20 pl-3"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-sans text-xs tracking-widest uppercase font-bold text-jungle mb-4">Max Price</h3>
        <div className="px-1">
          <input
            type="range"
            min={minPriceLimit}
            max={maxPriceLimit}
            step={Math.max(1, Math.round((maxPriceLimit - minPriceLimit) / 50))}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full h-1 bg-jungle/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
          />
          <div className="flex justify-between text-[10px] text-jungle/50 mt-2 font-medium">
            <span>Rs. {minPriceLimit.toLocaleString("en-IN")}</span>
            <span className="font-bold text-jungle">Rs. {priceMax.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 bg-white/40 border border-jungle/5 rounded-xl p-4">
        <h3 className="font-sans text-xs tracking-widest uppercase font-bold text-jungle mb-3">Status</h3>
        {[
          { label: "In Stock Only", state: showInStockOnly, set: setShowInStockOnly },
          { label: "Bestsellers", state: showBestsellers, set: setShowBestsellers },
          { label: "New Arrivals", state: showNewArrivals, set: setShowNewArrivals },
        ].map(({ label, state, set }) => (
          <div key={label} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0 border-b border-jungle/5 last:border-0">
            <span className="text-[11px] font-semibold text-jungle/70 uppercase tracking-wider">{label}</span>
            <button
              type="button"
              onClick={() => set(!state)}
              className={`w-9 h-5 rounded-full transition-colors shrink-0 relative focus:outline-none ${state ? "bg-jungle" : "bg-jungle/15"}`}
              aria-label={`Toggle ${label}`}
            >
              <span className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${state ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const ProductSkeleton = () => (
  <div className="bg-white/40 border border-jungle/5 rounded-xl p-3 flex flex-col h-full animate-pulse">
    <div className="relative aspect-square rounded-lg bg-jungle/5 mb-3" />
    <div className="space-y-2 flex-1">
      <div className="h-3 bg-jungle/5 rounded w-1/3" />
      <div className="h-4 bg-jungle/5 rounded w-3/4" />
      <div className="h-3 bg-jungle/5 rounded w-1/2 mt-auto" />
    </div>
  </div>
);

export default function ShopClientPage({
  initialProducts,
  initialCategories,
  initialTotalCount,
  dbMinPrice,
  dbMaxPrice,
  searchQuery = "",
  catalogPdfUrl = "",
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
          <span className="w-12 h-px bg-gold/40" />
          <span className="text-gold text-xs tracking-widest uppercase font-bold">WWJ Store</span>
          <span className="w-12 h-px bg-gold/40" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory">Shop All</h1>
        <p className="font-sans text-sm text-ivory/60 mt-3">Handcrafted Wildlife-Inspired Jewellery &amp; Accessories</p>
        {catalogPdfUrl && (
          <div className="mt-6 flex justify-center">
            <a
              href={catalogPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-gold hover:bg-gold-light text-jungle text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-gold/10 hover:shadow-gold/25 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <FileDown className="w-4 h-4 animate-bounce" style={{ animationDuration: "2s" }} />
              Download Lookbook (PDF)
            </a>
          </div>
        )}
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-60 shrink-0 sticky top-28 h-fit">
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
            {/* Search Input Bar */}
            <div className="mb-6">
              <div className="flex items-center gap-2 bg-white/80 border border-jungle/20 rounded-full px-4 py-2.5 max-w-md shadow-sm focus-within:border-gold transition-colors">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (!e.target.value) {
                      router.replace("/shop", { scroll: false });
                    }
                  }}
                  className="bg-transparent border-none outline-none text-sm text-jungle placeholder-jungle/40 w-full focus:ring-0 focus:outline-none"
                />
                {search ? (
                  <button
                    onClick={() => {
                      setSearch("");
                      router.replace("/shop", { scroll: false });
                    }}
                    aria-label="Clear search"
                    className="text-jungle/50 hover:text-jungle transition-colors mr-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
                <Search className="w-4 h-4 text-jungle/60" />
              </div>
            </div>

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

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
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
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
