import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getEventBySlug } from "@/app/actions/events";
import EventDetailClient from "./EventDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | WWJ",
      description: "The requested brand event or collaboration could not be found."
    };
  }

  return {
    title: `${event.seoTitle || event.title} | WWJ - Wildlife Wonder Jewellery`,
    description: event.seoDescription || event.shortDescription,
    openGraph: {
      title: `${event.seoTitle || event.title} | WWJ`,
      description: event.seoDescription || event.shortDescription,
      images: [{ url: event.featuredImage }],
      type: "article",
    }
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.status !== "PUBLISHED") {
    notFound();
  }

  // Query database for related products mapped in the array of IDs
  const relatedDbProducts = await prisma.product.findMany({
    where: {
      id: { in: event.relatedProducts }
    }
  });

  const relatedProducts = relatedDbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    images: p.images,
    category: p.category,
    inStock: p.inStock,
  }));

  const serializedEvent = {
    id: event.id,
    title: event.title,
    slug: event.slug,
    category: event.category,
    featuredImage: event.featuredImage,
    galleryImages: event.galleryImages,
    shortDescription: event.shortDescription,
    fullDescription: event.fullDescription,
    eventDate: event.eventDate.toISOString(),
    location: event.location,
    partnerName: event.partnerName,
    partnerLogo: event.partnerLogo,
    partnerWebsite: event.partnerWebsite,
    videoUrl: event.videoUrl,
  };

  return <EventDetailClient event={serializedEvent} relatedProducts={relatedProducts} />;
}
