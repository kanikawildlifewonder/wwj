import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { DynamicFavicon } from "@/components/layout/DynamicFavicon";
import "./globals.css";

export const metadata: Metadata = {
  title: "WWJ - Wildlife Wonder Jewellery",
  description:
    "Handcrafted wildlife-inspired jewellery and accessories that tell a story of beauty, strength, and the wild.",
  metadataBase: new URL("https://wwj.vercel.app"),
  openGraph: {
    title: "WWJ - Wildlife Wonder Jewellery",
    description:
      "Handcrafted wildlife-inspired jewellery and accessories that tell a story of beauty, strength, and the wild.",
    url: "https://wwj.vercel.app",
    siteName: "WWJ",
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
      "Handcrafted wildlife-inspired jewellery and accessories that tell a story of beauty, strength, and the wild.",
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
          <DynamicFavicon />
          <Toaster richColors position="top-center" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
