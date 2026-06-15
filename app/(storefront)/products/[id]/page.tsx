import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";
import { MOCK_REVIEWS } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 300;

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) notFound();

  const reviews = MOCK_REVIEWS.filter((r) => r.productId === product.id);
  const related = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      category: product.category
    },
    take: 4
  });

  return <ProductDetailClient product={product} reviews={reviews} related={related} />;
}
