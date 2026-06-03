import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WWJ — Wildlife Wonder Jewellery",
  description:
    "Handcrafted wildlife-inspired jewellery and accessories that tell a story of beauty, strength, and the wild.",
  metadataBase: new URL("https://wwj.vercel.app"),
  openGraph: {
    title: "WWJ — Wildlife Wonder Jewellery",
    description: "Handcrafted wildlife-inspired jewellery and accessories that tell a story of beauty, strength, and the wild.",
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
    title: "WWJ — Wildlife Wonder Jewellery",
    description: "Handcrafted wildlife-inspired jewellery and accessories that tell a story of beauty, strength, and the wild.",
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
      <html
        lang="en"
        className={`${playfair.variable} ${cormorant.variable} ${inter.variable} antialiased h-full scroll-smooth`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
          <Toaster richColors position="top-center" />
          {/* Clerk auth controls are surfaced inside the per-route Header component */}
          {/* ClerkProvider makes auth state available to all Server & Client components */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

