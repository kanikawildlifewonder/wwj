import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { BrandValueStrip } from "@/components/home/BrandValueStrip";
import { ExploreCollections } from "@/components/home/ExploreCollections";
import { WildlifeStoryBanner } from "@/components/home/WildlifeStoryBanner";
import { BestsellersCarousel } from "@/components/home/BestsellersCarousel";
import { EventsSection } from "@/components/home/EventsSection";
import { TrustStrip } from "@/components/home/TrustStrip";

import { getPageContent } from "@/app/actions/content";
import { getGroupedProductCategories } from "@/app/actions/categories";

export const revalidate = 300;

export default async function HomePage() {
  const [heroContentStr, aboutContentStr, collectionsStr, groupedCategories] = await Promise.all([
    getPageContent("home-hero"),
    getPageContent("home-about"),
    getPageContent("home-collections"),
    getGroupedProductCategories(),
  ]);

  let heroProps = {};
  if (heroContentStr) heroProps = JSON.parse(heroContentStr);

  let aboutProps = {};
  if (aboutContentStr) aboutProps = JSON.parse(aboutContentStr);

  let collectionsData = undefined;
  if (collectionsStr) {
    try { collectionsData = JSON.parse(collectionsStr); } catch { /* keep default */ }
  }

  return (
    <>
      <HeroBanner {...heroProps} />
      <BrandValueStrip />
      <ExploreCollections collections={collectionsData} groupedCategories={groupedCategories} />
      <WildlifeStoryBanner {...aboutProps} />
      <BestsellersCarousel />
      <EventsSection />
      <div className="bg-jungle h-24" />
      <TrustStrip />
      <div className="bg-jungle h-12" />
    </>
  );
}
