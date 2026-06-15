'use server'

import prisma from '@/lib/prisma'
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
}) {
  try {
    const skip = options.skip ?? 0
    const take = options.take ?? 12
    const { category, sortBy, inStockOnly, priceMax, showBestsellers } = options

    const where: any = {}

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

    const orderBy: any = []
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
