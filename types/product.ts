// Product type definitions
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  collection: string;
  animalInspiration: string;
  material: string;
  colors: string[];
  inStock: boolean;
  stockCount: number;
  sku: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  features: string[];
  careInstructions: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}
