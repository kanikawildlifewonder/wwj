import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";
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
          {/* Clerk auth controls are surfaced inside the per-route Header component */}
          {/* ClerkProvider makes auth state available to all Server & Client components */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

