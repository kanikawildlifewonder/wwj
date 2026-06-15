'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guard'

/**
 * Update page content in the database.
 * If the content ID doesn't exist, it creates it.
 */
export async function updatePageContent(id: string, content: string) {
  try {
    await requireAdmin()
    await prisma.pageContent.upsert({
      where: { id },
      update: { content },
      create: { id, content },
    })

    // Revalidate the frontend paths so they show the new content immediately
    revalidatePath('/')
    revalidatePath('/about')
    revalidatePath('/impact')
    revalidatePath('/collections')

    return { success: true }
  } catch (error) {
    console.error('Failed to update page content:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update content' }
  }
}

/**
 * Fetch page content from the database.
 * Returns null if not found.
 */
export async function getPageContent(id: string) {
  try {
    const data = await prisma.pageContent.findUnique({
      where: { id }
    })
    return data ? data.content : null
  } catch (error) {
    console.error('Failed to fetch page content:', error)
    return null
  }
}
