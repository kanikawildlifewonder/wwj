import { Product } from "@/types/product";

export function mapDbProductToUI(p: {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  featured?: boolean;
  mainCategory?: string;
}): Product {
  return {
    id: p.id,
    slug: p.id,
    name: p.name,
    description: p.description,
    longDescription: p.description,
    price: p.price,
    images: p.images,
    category: p.category,
    collection: p.mainCategory?.toUpperCase() ?? "WWJ",
    animalInspiration: "Wildlife",
    material: "Handcrafted",
    colors: [],
    inStock: p.inStock,
    stockCount: p.inStock ? 10 : 0,
    sku: p.id.slice(0, 8).toUpperCase(),
    isBestseller: p.featured ?? false,
    isNewArrival: false,
    rating: 5,
    reviewCount: 12,
    features: [],
    careInstructions: "",
    tags: [],
  };
}
