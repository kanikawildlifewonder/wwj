'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

export async function addProduct(data: {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
}) {
  try {
    await prisma.product.create({
      data
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to add product:', error)
    return { success: false, error: 'Failed to add product' }
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await prisma.product.update({
      where: { id },
      data
    })
    revalidatePath('/admin/products')
    revalidatePath('/collections')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to update product:', error)
    return { success: false, error: 'Failed to update product' }
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
          featured: p.badge === 'Bestseller'
        }
      })
    }
    revalidatePath('/admin/products')
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}
