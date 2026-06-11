'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type EventInput = {
  title: string
  slug: string
  category: string
  status: string
  featuredImage: string
  galleryImages: string[]
  shortDescription: string
  fullDescription: string
  eventDate: Date | string
  location?: string | null
  partnerName?: string | null
  partnerLogo?: string | null
  partnerWebsite?: string | null
  videoUrl?: string | null
  relatedProducts: string[]
  seoTitle?: string | null
  seoDescription?: string | null
}

export type EventUpdateInput = Partial<EventInput>

export async function getEvents() {
  try {
    return await prisma.event.findMany({
      orderBy: { eventDate: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get events:', error)
    return []
  }
}

export async function getPublishedEvents(category?: string) {
  try {
    const whereClause: { status: string; category?: { equals: string; mode: 'insensitive' } } = { status: 'PUBLISHED' };
    if (category && category !== 'all') {
      whereClause.category = {
        equals: category,
        mode: 'insensitive'
      };
    }
    return await prisma.event.findMany({
      where: whereClause,
      orderBy: { eventDate: 'desc' }
    })
  } catch (error) {
    console.error('Failed to get published events:', error)
    return []
  }
}

export async function getEventBySlug(slug: string) {
  try {
    return await prisma.event.findUnique({
      where: { slug }
    })
  } catch (error) {
    console.error('Failed to get event by slug:', error)
    return null
  }
}

export async function getEventById(id: string) {
  try {
    return await prisma.event.findUnique({
      where: { id }
    })
  } catch (error) {
    console.error('Failed to get event by id:', error)
    return null
  }
}

export async function addEvent(data: EventInput) {
  try {
    const eventDateFormatted = new Date(data.eventDate);
    const result = await prisma.event.create({
      data: {
        ...data,
        eventDate: eventDateFormatted,
      }
    });
    revalidatePath('/admin/events')
    revalidatePath('/events')
    revalidatePath(`/events/${data.slug}`)
    revalidatePath('/')
    return { success: true, event: result }
  } catch (error) {
    console.error('Failed to add event:', error)
    return { success: false, error: 'Failed to add event' }
  }
}

export async function updateEvent(id: string, data: EventUpdateInput) {
  try {
    const updateData: EventUpdateInput = { ...data };
    if (data.eventDate) {
      updateData.eventDate = new Date(data.eventDate);
    }
    const result = await prisma.event.update({
      where: { id },
      data: updateData
    });
    revalidatePath('/admin/events')
    revalidatePath('/events')
    revalidatePath(`/events/${result.slug}`)
    revalidatePath('/')
    return { success: true, event: result }
  } catch (error) {
    console.error('Failed to update event:', error)
    return { success: false, error: 'Failed to update event' }
  }
}

export async function deleteEvent(id: string) {
  try {
    const event = await prisma.event.delete({
      where: { id }
    })
    revalidatePath('/admin/events')
    revalidatePath('/events')
    revalidatePath(`/events/${event.slug}`)
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete event:', error)
    return { success: false, error: 'Failed to delete event' }
  }
}
