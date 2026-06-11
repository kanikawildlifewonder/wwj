export const CATEGORIES_CONTENT_ID = "product-categories";

/** Categories grouped by mainCategory collection key */
export const DEFAULT_GROUPED_CATEGORIES: Record<string, string[]> = {
  wwj: [
    "Necklace",
    "Rings",
    "Earrings",
    "Bracelets",
    "Combo",
    "Sets",
    "Floral Collection",
    "Marine Wonders",
  ],
  wwa: [
    "Keychains",
    "Hair Accessories",
    "Magnets",
    "Coffee Mugs",
    "Customise your own pet",
    "Bookmarks",
  ],
  gift_cards: [
    "Gift Boxes",
    "Festive Collections",
  ],
};

/** Flat list of all default categories (union across all collections) */
export const DEFAULT_PRODUCT_CATEGORIES: string[] = Object.values(
  DEFAULT_GROUPED_CATEGORIES
).flat();

export function normalizeCategory(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function categoriesMatch(a: string, b: string): boolean {
  return normalizeCategory(a).toLowerCase() === normalizeCategory(b).toLowerCase();
}

/**
 * Given a grouped record (or null), returns a flat array of all categories.
 */
export function flattenGrouped(grouped: Record<string, string[]>): string[] {
  return Object.values(grouped).flat();
}

/**
 * Given a flat string[] from an older DB entry, tries to bucket each category
 * into the correct collection group using the default mapping as reference.
 */
export function rebuildGroupedFromFlat(flat: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = { wwj: [], wwa: [], gift_cards: [] };
  for (const cat of flat) {
    let placed = false;
    for (const [key, defaults] of Object.entries(DEFAULT_GROUPED_CATEGORIES)) {
      if (defaults.some((d) => categoriesMatch(d, cat))) {
        result[key].push(normalizeCategory(cat));
        placed = true;
        break;
      }
    }
    // If not found in defaults, put under wwj as a fallback
    if (!placed) {
      result.wwj.push(normalizeCategory(cat));
    }
  }
  return result;
}
