'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'
import {
  CATEGORIES_CONTENT_ID,
  DEFAULT_GROUPED_CATEGORIES,
  DEFAULT_PRODUCT_CATEGORIES,
  normalizeCategory,
  categoriesMatch,
  flattenGrouped,
  rebuildGroupedFromFlat,
} from '@/lib/categories'

/* ─── internal helpers ─── */

async function readStoredGrouped(): Promise<Record<string, string[]> | null> {
  const row = await prisma.pageContent.findUnique({
    where: { id: CATEGORIES_CONTENT_ID },
  })
  if (!row?.content) return null

  try {
    const parsed = JSON.parse(row.content)

    // New format: { wwj: [...], wwa: [...], gift_cards: [...] }
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const result: Record<string, string[]> = {}
      for (const key of Object.keys(DEFAULT_GROUPED_CATEGORIES)) {
        result[key] = Array.isArray(parsed[key])
          ? (parsed[key] as string[]).map(normalizeCategory).filter(Boolean)
          : [...DEFAULT_GROUPED_CATEGORIES[key]]
      }
      return result
    }

    // Legacy flat list: migrate to grouped format
    if (Array.isArray(parsed) && parsed.every((c) => typeof c === 'string')) {
      const flat = parsed.map(normalizeCategory).filter(Boolean)
      return rebuildGroupedFromFlat(flat)
    }
  } catch {
    return null
  }
  return null
}

async function writeGrouped(grouped: Record<string, string[]>) {
  const payload = JSON.stringify(grouped)
  await prisma.pageContent.upsert({
    where: { id: CATEGORIES_CONTENT_ID },
    update: { content: payload },
    create: { id: CATEGORIES_CONTENT_ID, content: payload },
  })
}

/* ─── public server actions ─── */

/**
 * Returns categories grouped by collection key: { wwj, wwa, gift_cards }
 */
export async function getGroupedProductCategories(): Promise<Record<string, string[]>> {
  try {
    const stored = await readStoredGrouped()
    return stored ?? { ...DEFAULT_GROUPED_CATEGORIES }
  } catch (error) {
    console.error('Failed to get grouped categories:', error)
    return { ...DEFAULT_GROUPED_CATEGORIES }
  }
}

/**
 * Returns a flat list of all categories (union of all collections).
 * Used for backward-compatibility in existing product forms.
 */
export async function getProductCategories(): Promise<string[]> {
  try {
    const grouped = await getGroupedProductCategories()
    return flattenGrouped(grouped)
  } catch (error) {
    console.error('Failed to get categories:', error)
    return [...DEFAULT_PRODUCT_CATEGORIES]
  }
}

/**
 * Adds a category to the specified collection group.
 * @param name  Category display name
 * @param mainCategory  Collection key: 'wwj' | 'wwa' | 'gift_cards'
 */
export async function addProductCategory(name: string, mainCategory = 'wwj') {
  const label = normalizeCategory(name)
  if (!label) {
    return { success: false, error: 'Category name is required' }
  }

  const collectionKey = ['wwj', 'wwa', 'gift_cards'].includes(mainCategory)
    ? mainCategory
    : 'wwj'

  try {
    await requireAdmin()
    const grouped = await getGroupedProductCategories()
    const groupList = grouped[collectionKey] ?? []
    if (groupList.some((c) => categoriesMatch(c, label))) {
      return { success: false, error: 'Category already exists in this collection' }
    }

    grouped[collectionKey] = [...groupList, label]
    await writeGrouped(grouped)
    revalidatePath('/admin/settings')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to add category:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add category' }
  }
}

/**
 * Removes a category from the specified collection group.
 * @param name  Category display name
 * @param mainCategory  Collection key: 'wwj' | 'wwa' | 'gift_cards'
 */
export async function removeProductCategory(name: string, mainCategory = 'wwj') {
  const label = normalizeCategory(name)

  const collectionKey = ['wwj', 'wwa', 'gift_cards'].includes(mainCategory)
    ? mainCategory
    : 'wwj'

  try {
    await requireAdmin()
    const grouped = await getGroupedProductCategories()
    const groupList = grouped[collectionKey] ?? []
    const next = groupList.filter((c) => !categoriesMatch(c, label))

    if (next.length === groupList.length) {
      return { success: false, error: 'Category not found in this collection' }
    }

    const inUse = await prisma.product.count({
      where: {
        category: { equals: label, mode: 'insensitive' },
      },
    })

    if (inUse > 0) {
      return {
        success: false,
        error: `Cannot remove "${label}" — ${inUse} product(s) still use it`,
      }
    }

    grouped[collectionKey] = next
    await writeGrouped(grouped)
    revalidatePath('/admin/settings')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to remove category:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to remove category' }
  }
}
