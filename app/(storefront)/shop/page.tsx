import { getProductCategories } from "@/app/actions/categories";
import { getShopProducts, getProductPriceLimits } from "@/app/actions/products";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";
import ShopClientPage from "./ShopClientPage";

export const revalidate = 300;

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sortBy?: string;
    inStockOnly?: string;
    priceMax?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const search = params.search;

  const [shopData, categories, priceLimits] = await Promise.all([
    getShopProducts({ skip: 0, take: 12, search }),
    getProductCategories(),
    getProductPriceLimits(),
  ]);

  const initialProducts = shopData.success ? shopData.products.map(mapDbProductToUI) : [];
  const totalCount = shopData.success ? shopData.totalCount : 0;
  const minPrice = priceLimits.min;
  const maxPrice = priceLimits.max;

  return (
    <ShopClientPage
      initialProducts={initialProducts}
      initialCategories={categories}
      initialTotalCount={totalCount}
      dbMinPrice={minPrice}
      dbMaxPrice={maxPrice}
      searchQuery={search}
    />
  );
}

