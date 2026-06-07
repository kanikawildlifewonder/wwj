'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import {
  CATEGORIES_CONTENT_ID,
  DEFAULT_PRODUCT_CATEGORIES,
  normalizeCategory,
  categoriesMatch,
} from '@/lib/categories'

async function readStoredCategories(): Promise<string[] | null> {
  const row = await prisma.pageContent.findUnique({
    where: { id: CATEGORIES_CONTENT_ID },
  })
  if (!row?.content) return null
  try {
    const parsed = JSON.parse(row.content)
    if (Array.isArray(parsed) && parsed.every((c) => typeof c === 'string')) {
      return parsed.map(normalizeCategory).filter(Boolean)
    }
  } catch {
    return null
  }
  return null
}

async function writeCategories(categories: string[]) {
  const payload = JSON.stringify(categories)
  await prisma.pageContent.upsert({
    where: { id: CATEGORIES_CONTENT_ID },
    update: { content: payload },
    create: { id: CATEGORIES_CONTENT_ID, content: payload },
  })
}

export async function getProductCategories(): Promise<string[]> {
  try {
    const stored = await readStoredCategories()
    return stored ?? [...DEFAULT_PRODUCT_CATEGORIES]
  } catch (error) {
    console.error('Failed to get categories:', error)
    return [...DEFAULT_PRODUCT_CATEGORIES]
  }
}

export async function addProductCategory(name: string) {
  const label = normalizeCategory(name)
  if (!label) {
    return { success: false, error: 'Category name is required' }
  }

  try {
    const categories = await getProductCategories()
    if (categories.some((c) => categoriesMatch(c, label))) {
      return { success: false, error: 'Category already exists' }
    }

    await writeCategories([...categories, label])
    revalidatePath('/admin/settings')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to add category:', error)
    return { success: false, error: 'Failed to add category' }
  }
}

export async function removeProductCategory(name: string) {
  const label = normalizeCategory(name)

  try {
    const categories = await getProductCategories()
    const next = categories.filter((c) => !categoriesMatch(c, label))

    if (next.length === categories.length) {
      return { success: false, error: 'Category not found' }
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

    await writeCategories(next)
    revalidatePath('/admin/settings')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to remove category:', error)
    return { success: false, error: 'Failed to remove category' }
  }
}
