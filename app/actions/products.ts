'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
    return { success: false, error: 'Failed to add product' }
  }
}

export async function updateProduct(id: string, data: ProductUpdateInput) {
  try {
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
    return { success: false, error: 'Failed to update product' }
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
    return { success: false, error: 'Failed to bulk update' }
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  try {
    await prisma.product.deleteMany({
      where: { id: { in: ids } },
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to bulk delete products:', error)
    return { success: false, error: 'Failed to bulk delete' }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete product:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

// Helper to seed initial mock data
export async function seedMockProducts() {
  const { MOCK_PRODUCTS } = await import('@/lib/mock-data');
  try {
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
  } catch {
    return { success: false }
  }
}
