'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

/**
 * Retrieve all coupons (Admin only)
 */
export async function getCoupons() {
  try {
    await requireAdmin()
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, coupons }
  } catch (error) {
    console.error('Failed to get coupons:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve coupons',
      coupons: []
    }
  }
}

/**
 * Create a new coupon (Admin only)
 */
export async function createCoupon(code: string, type: 'PERCENTAGE' | 'FIXED', value: number, isActive: boolean = true) {
  try {
    await requireAdmin()
    
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) {
      return { success: false, error: 'Coupon code cannot be empty' }
    }

    if (value <= 0) {
      return { success: false, error: 'Discount value must be greater than zero' }
    }

    if (type === 'PERCENTAGE' && value > 100) {
      return { success: false, error: 'Percentage discount cannot exceed 100%' }
    }

    // Check for duplicate code
    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode }
    })

    if (existing) {
      return { success: false, error: `Coupon code "${cleanCode}" already exists` }
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        type,
        value,
        isActive
      }
    })

    revalidatePath('/admin/coupons')
    return { success: true, coupon }
  } catch (error) {
    console.error('Failed to create coupon:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create coupon'
    }
  }
}

/**
 * Delete a coupon by ID (Admin only)
 */
export async function deleteCoupon(id: string) {
  try {
    await requireAdmin()

    await prisma.coupon.delete({
      where: { id }
    })

    revalidatePath('/admin/coupons')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete coupon:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete coupon'
    }
  }
}

/**
 * Validate a coupon code and calculate the discount (Public)
 */
export async function validateCoupon(code: string, subtotal: number) {
  try {
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) {
      return { success: false, error: 'Please enter a coupon code' }
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode }
    })

    if (!coupon) {
      return { success: false, error: 'Invalid coupon code' }
    }

    if (!coupon.isActive) {
      return { success: false, error: 'This coupon code has expired or is inactive' }
    }

    let discount = 0
    if (coupon.type === 'PERCENTAGE') {
      discount = subtotal * (coupon.value / 100)
    } else if (coupon.type === 'FIXED') {
      discount = Math.min(coupon.value, subtotal)
    } else {
      return { success: false, error: 'Unknown coupon type' }
    }

    return {
      success: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount
    }
  } catch (error) {
    console.error('Failed to validate coupon:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to validate coupon'
    }
  }
}
