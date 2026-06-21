import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailClient from "./ProductDetailClient";
import { MOCK_REVIEWS } from "@/lib/mock-data";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 300;

const getAbsoluteUrl = (path: string, baseUrl: string) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return {
      title: "Product Not Found | WWJ",
      description: "The requested wildlife jewellery piece could not be found."
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wildlifewonderjewellery.com";
  const imageUrl = product.images?.[0] ? getAbsoluteUrl(product.images[0], baseUrl) : `${baseUrl}/og-image.png`;

  return {
    title: `${product.name} | Handcrafted Wildlife Jewellery | WWJ`,
    description: product.description || `Purchase the handcrafted ${product.name} from Wildlife Wonder Jewellery. Inspired by nature, supporting wildlife conservation.`,
    keywords: [
      product.name,
      product.category,
      "wildlife jewellery",
      "handcrafted jewelry India",
      "conservation fashion"
    ],
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | WWJ - Wildlife Wonder Jewellery`,
      description: product.description,
      url: `/products/${product.id}`,
      images: [{ url: imageUrl }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | WWJ - Wildlife Wonder Jewellery`,
      description: product.description,
      images: [imageUrl],
    }
  };
}

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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wildlifewonderjewellery.com";
  const productUrl = `${baseUrl}/products/${product.id}`;
  const imageAbsoluteUrls = (product.images || []).map((img) => getAbsoluteUrl(img, baseUrl));

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": imageAbsoluteUrls,
    "description": product.description,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "WWJ - Wildlife Wonder Jewellery"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2030-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "WWJ - Wildlife Wonder Jewellery"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} reviews={reviews} related={related} />
    </>
  );
}
