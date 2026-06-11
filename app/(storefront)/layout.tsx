import React from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppWidget } from "@/components/common/WhatsAppWidget";
import { getPageContent } from "@/app/actions/content";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logoRaw, storeRaw] = await Promise.all([
    getPageContent("brand-logo"),
    getPageContent("store-settings"),
  ]);

  let logoProps: { imageUrl?: string; text?: string; tagline?: string } = {};
  if (logoRaw) {
    try { logoProps = JSON.parse(logoRaw); } catch { /* use defaults */ }
  }

  let shippingThreshold = 1499;
  if (storeRaw) {
    try {
      const s = JSON.parse(storeRaw);
      if (typeof s.shippingThreshold === "number") shippingThreshold = s.shippingThreshold;
    } catch { /* use default */ }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header logoImageUrl={logoProps.imageUrl} logoText={logoProps.text} logoTagline={logoProps.tagline} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CartDrawer threshold={shippingThreshold} />
      <WhatsAppWidget />
    </div>
  );
}
