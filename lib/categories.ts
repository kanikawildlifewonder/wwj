export const CATEGORIES_CONTENT_ID = "product-categories";

/** Default catalogue categories (Necklace / Combo / Sets replace old combined names). */
export const DEFAULT_PRODUCT_CATEGORIES = [
  "Necklace",
  "Combo",
  "Sets",
  "Rings",
  "Earrings",
  "Bracelets",
  "Hair Accessories",
  "Keychains",
  "Gift Boxes",
  "Magnets",
  "Festive Collections",
  "Floral Collection",
] as const;

export function normalizeCategory(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function categoriesMatch(a: string, b: string): boolean {
  return normalizeCategory(a).toLowerCase() === normalizeCategory(b).toLowerCase();
}
