import { getProductCategories } from "@/app/actions/categories";
import { getShopProducts, getProductPriceLimits } from "@/app/actions/products";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";
import ShopClientPage from "./ShopClientPage";

export const revalidate = 300;

export default async function ShopPage() {
  const [shopData, categories, priceLimits] = await Promise.all([
    getShopProducts({ skip: 0, take: 12 }),
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
    />
  );
}
