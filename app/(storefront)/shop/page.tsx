import { getProductCategories } from "@/app/actions/categories";
import { getProducts } from "@/app/actions/products";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";
import ShopClientPage from "./ShopClientPage";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);

  return (
    <ShopClientPage
      initialProducts={products.map(mapDbProductToUI)}
      initialCategories={categories}
    />
  );
}
