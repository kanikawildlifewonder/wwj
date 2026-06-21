import { getProductCategories } from "@/app/actions/categories";
import { getShopProducts, getProductPriceLimits } from "@/app/actions/products";
import { mapDbProductToUI } from "@/lib/utils/product-mapper";
import { getPageContent } from "@/app/actions/content";
import ShopClientPage from "./ShopClientPage";

export const revalidate = 300;

export const metadata = {
  title: "Shop Handcrafted Wildlife Jewelry Online | WWJ",
  description: "Browse the complete Wildlife Wonder Jewellery catalog. Discover handcrafted rings, earrings, necklaces, and accessories inspired by nature and wild animals.",
  alternates: {
    canonical: "/shop",
  },
};

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

  const [shopData, categories, priceLimits, catalogContent] = await Promise.all([
    getShopProducts({ skip: 0, take: 12, search }),
    getProductCategories(),
    getProductPriceLimits(),
    getPageContent("shop-catalog"),
  ]);

  let catalogPdfUrl = "";
  if (catalogContent) {
    try {
      const parsed = JSON.parse(catalogContent);
      if (parsed.pdfUrl && parsed.showDownloadButton !== false) {
        catalogPdfUrl = parsed.pdfUrl;
      }
    } catch (e) {
      console.error("Failed to parse catalogContent JSON", e);
    }
  }

  const initialProducts = shopData.success ? shopData.products.map(mapDbProductToUI) : [];
  const totalCount = shopData.success ? shopData.totalCount : 0;
  const minPrice = priceLimits.min;
  const maxPrice = priceLimits.max;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wildlifewonderjewellery.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Shop Handcrafted Wildlife Jewelry Online | WWJ",
    "description": "Browse the complete Wildlife Wonder Jewellery catalog. Discover handcrafted rings, earrings, necklaces, and accessories inspired by nature and wild animals.",
    "url": `${baseUrl}/shop`,
    "about": {
      "@type": "Thing",
      "name": "Wildlife Inspired Jewellery"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ShopClientPage
        initialProducts={initialProducts}
        initialCategories={categories}
        initialTotalCount={totalCount}
        dbMinPrice={minPrice}
        dbMaxPrice={maxPrice}
        searchQuery={search}
        catalogPdfUrl={catalogPdfUrl}
      />
    </>
  );
}

