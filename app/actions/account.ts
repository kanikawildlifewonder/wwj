'use server'

import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

// ──────────────────────────────────────────
// Orders
// ──────────────────────────────────────────

/**
 * Fetches all orders placed by the currently signed-in user.
 * Matches on clerkUserId OR customerEmail (for legacy/guest orders).
 */
export async function getMyOrders() {
  const user = await currentUser()
  if (!user) redirect('/login')

  try {
    const email = user.emailAddresses[0]?.emailAddress ?? ''

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { clerkUserId: user.id },
          // fallback: match by email for orders placed before auth was tied
          { customerEmail: { equals: email, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    return {
      success: true,
      orders: orders.map((o) => ({
        id: o.id,
        date: o.createdAt.toISOString(),
        status: o.status,
        total: o.totalAmount,
        paymentMethod: o.razorpayPaymentId ? 'Razorpay' : 'Online Payment',
        items: o.items.map((i) => ({
          name: i.product?.name ?? 'Product',
          image: i.product?.images?.[0] ?? '',
          price: i.price,
          quantity: i.quantity,
          category: i.product?.category ?? '',
        })),
        itemsCount: o.items.reduce((s, i) => s + i.quantity, 0),
      })),
    }
  } catch (error) {
    console.error('Failed to fetch user orders:', error)
    return { success: false, orders: [] }
  }
}

// ──────────────────────────────────────────
// Addresses  (stored in PageContent as JSON)
// ──────────────────────────────────────────

export interface SavedAddress {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
}

function addressKey(userId: string) {
  return `user-addresses-${userId}`
}

export async function getMyAddresses(): Promise<SavedAddress[]> {
  const user = await currentUser()
  if (!user) return []

  try {
    const row = await prisma.pageContent.findUnique({
      where: { id: addressKey(user.id) },
    })
    if (!row?.content) return []
    return JSON.parse(row.content) as SavedAddress[]
  } catch {
    return []
  }
}

export async function saveMyAddresses(addresses: SavedAddress[]) {
  const user = await currentUser()
  if (!user) throw new Error('Not authenticated')

  const key = addressKey(user.id)
  await prisma.pageContent.upsert({
    where: { id: key },
    update: { content: JSON.stringify(addresses) },
    create: { id: key, content: JSON.stringify(addresses) },
  })
  return { success: true }
}
