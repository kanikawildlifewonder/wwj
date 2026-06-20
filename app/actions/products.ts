'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

type ProductInput = {
  name: string
  description: string
  price: number
  category: string
  mainCategory: string
  images: string[]
  video?: string | null
  inStock: boolean
  featured?: boolean
}

type ProductUpdateInput = Partial<ProductInput>

export async function getProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get products:', error)
    return []
  }
}

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true },
      orderBy: { updatedAt: 'desc' },
      take: 12,
    })
  } catch (error) {
    console.error('Failed to get featured products:', error)
    return []
  }
}

export async function addProduct(data: ProductInput) {
  try {
    await requireAdmin()
    await prisma.product.create({
      data
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    revalidatePath('/shop')
    return { success: true }
  } catch (error) {
    console.error('Failed to add product:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add product' }
  }
}

export async function updateProduct(id: string, data: ProductUpdateInput) {
  try {
    await requireAdmin()
    await prisma.product.update({
      where: { id },
      data
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    revalidatePath('/shop')
    return { success: true }
  } catch (error) {
    console.error('Failed to update product:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update product' }
  }
}

export type BulkUpdatePayload = {
  inStock?: boolean
  featured?: boolean
  price?: number
  category?: string
}

export async function bulkUpdateProducts(ids: string[], data: BulkUpdatePayload) {
  try {
    await requireAdmin()
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data,
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    revalidatePath('/shop')
    return { success: true }
  } catch (error) {
    console.error('Failed to bulk update products:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to bulk update' }
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  try {
    await requireAdmin()
    await prisma.product.deleteMany({
      where: { id: { in: ids } },
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to bulk delete products:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to bulk delete' }
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin()
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete product:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete product' }
  }
}

// Helper to seed initial mock data
export async function seedMockProducts() {
  try {
    await requireAdmin()
    const { MOCK_PRODUCTS } = await import('@/lib/mock-data');
    for (const p of MOCK_PRODUCTS) {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          images: p.images,
          inStock: p.stockCount > 0,
          featured: p.isBestseller
        }
      })
    }
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to seed' }
  }
}

export async function getShopProducts(options: {
  skip?: number
  take?: number
  category?: string
  sortBy?: string
  inStockOnly?: boolean
  priceMax?: number
  showBestsellers?: boolean
  search?: string
}) {
  try {
    const skip = options.skip ?? 0
    const take = options.take ?? 12
    const { category, sortBy, inStockOnly, priceMax, showBestsellers, search } = options

    const where: Prisma.ProductWhereInput = {}

    if (category && category !== 'All') {
      where.category = { equals: category.trim(), mode: 'insensitive' }
    }

    if (inStockOnly) {
      where.inStock = true
    }

    if (showBestsellers) {
      where.featured = true
    }

    if (priceMax !== undefined) {
      where.price = { lte: priceMax }
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } }
      ]
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = []
    if (sortBy === 'price_asc') {
      orderBy.push({ price: 'asc' })
    } else if (sortBy === 'price_desc') {
      orderBy.push({ price: 'desc' })
    } else {
      orderBy.push({ createdAt: 'desc' })
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
    })

    const totalCount = await prisma.product.count({ where })

    return {
      success: true,
      products,
      totalCount,
    }
  } catch (error) {
    console.error('Failed to get shop products:', error)
    return {
      success: false,
      error: 'Failed to fetch products',
      products: [],
      totalCount: 0,
    }
  }
}

export async function getProductPriceLimits() {
  try {
    const agg = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true }
    })
    return {
      success: true,
      min: agg._min.price ?? 0,
      max: agg._max.price ?? 5000
    }
  } catch (error) {
    console.error('Failed to get price limits:', error)
    return { success: false, min: 0, max: 5000 }
  }
}

/**
 * Returns ALL distinct category values actually used in the products table,
 * merged with the stored settings category list. This ensures custom /
 * legacy tags not present in Settings always appear in admin filters.
 *
 * Uses a case-insensitive Map keyed on lowercased+trimmed value so that
 * "Combo", " Combo", and "combo" all collapse to one entry.
 */
export async function getDistinctProductCategories(): Promise<string[]> {
  try {
    const rows = await prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    })
    const dbCats = rows.map((r) => r.category.trim()).filter(Boolean)

    // Also pull the stored settings list so we include configured-but-unused categories
    const { getProductCategories } = await import('@/app/actions/categories')
    const storedCats = (await getProductCategories()).map((c) => c.trim()).filter(Boolean)

    // Case-insensitive dedup: first-seen casing wins
    const seen = new Map<string, string>()
    for (const cat of [...dbCats, ...storedCats]) {
      const key = cat.toLowerCase()
      if (!seen.has(key)) seen.set(key, cat)
    }

    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b))
  } catch (error) {
    console.error('Failed to get distinct product categories:', error)
    return []
  }
}


/**
 * Returns a count of all products plus a breakdown of out-of-stock product names.
 * Used by the admin dashboard inventory alerts widget.
 */
export async function getInventoryAlerts(): Promise<{
  total: number
  outOfStock: { id: string; name: string; category: string }[]
}> {
  try {
    const [total, outOfStock] = await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({
        where: { inStock: false },
        select: { id: true, name: true, category: true },
        orderBy: { updatedAt: 'desc' },
      }),
    ])
    return { total, outOfStock }
  } catch (error) {
    console.error('Failed to get inventory alerts:', error)
    return { total: 0, outOfStock: [] }
  }
}

