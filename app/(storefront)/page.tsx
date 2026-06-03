import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { BrandValueStrip } from "@/components/home/BrandValueStrip";
import { ExploreCollections } from "@/components/home/ExploreCollections";
import { WildlifeStoryBanner } from "@/components/home/WildlifeStoryBanner";
import { BestsellersCarousel } from "@/components/home/BestsellersCarousel";
import { TrustStrip } from "@/components/home/TrustStrip";

import { getPageContent } from "@/app/actions/content";

export default async function HomePage() {
  const heroContentStr = await getPageContent("home-hero");
  let heroProps = {};
  if (heroContentStr) heroProps = JSON.parse(heroContentStr);

  const aboutContentStr = await getPageContent("home-about");
  let aboutProps = {};
  if (aboutContentStr) aboutProps = JSON.parse(aboutContentStr);

  return (
    <>
      <HeroBanner {...heroProps} />
      <BrandValueStrip />
      <ExploreCollections />
      <WildlifeStoryBanner {...aboutProps} />
      <BestsellersCarousel />
      <div className="bg-jungle h-24" /> {/* Spacer for the bottom wave of TrustStrip */}
      <TrustStrip />
      <div className="bg-jungle h-12" /> {/* Spacer to blend into footer */}
    </>
  );
}
