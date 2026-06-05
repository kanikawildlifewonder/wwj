import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditProductForm from "./EditProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id }
  });
  
  if (!product) notFound();

  // Convert Decimal/Float values if Prisma returns it differently, here Float is standard number
  return <EditProductForm product={product} />;
}
