import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { DynamicFavicon } from "@/components/layout/DynamicFavicon";
import { DynamicThemeInjector } from "@/components/layout/DynamicThemeInjector";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#071D16",
};

export const metadata: Metadata = {
  title: {
    template: "%s | WWJ - Wildlife Wonder Jewellery",
    default: "WWJ - Wildlife Wonder Jewellery | Handcrafted Animal Jewelry India",
  },
  description:
    "Discover handcrafted, luxury wildlife-inspired jewellery and accessories supporting conservation. Shop unique animal rings, necklaces, and earrings in India.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wildlifewonderjewellery.com"),
  keywords: [
    "wildlife jewellery India",
    "handcrafted animal jewelry",
    "conservation jewelry",
    "nature inspired jewelry",
    "wildlife accessories",
    "sterling silver animal jewelry",
    "brass wildlife rings",
    "sustainable luxury jewelry India",
    "WWJ",
    "Wildlife Wonder"
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "yP0J4XJUrcVv3BAhQPdQwGKxvYpxOs7jQv_fk1aUDN4",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "WWJ - Wildlife Wonder Jewellery",
    description:
      "Discover handcrafted, luxury wildlife-inspired jewellery and accessories supporting conservation. Shop unique animal rings, necklaces, and earrings in India.",
    url: "/",
    siteName: "WWJ - Wildlife Wonder Jewellery",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WWJ - Wildlife Wonder Jewellery",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WWJ - Wildlife Wonder Jewellery",
    description:
      "Discover handcrafted, luxury wildlife-inspired jewellery and accessories supporting conservation. Shop unique animal rings, necklaces, and earrings in India.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="antialiased h-full scroll-smooth">
        <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
          <DynamicThemeInjector />
          <DynamicFavicon />
          <Toaster richColors position="top-center" />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
