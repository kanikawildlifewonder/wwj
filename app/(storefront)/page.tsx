import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { BrandValueStrip } from "@/components/home/BrandValueStrip";
import { ExploreCollections } from "@/components/home/ExploreCollections";
import { WildlifeStoryBanner } from "@/components/home/WildlifeStoryBanner";
import { BestsellersCarousel } from "@/components/home/BestsellersCarousel";
import { TrustStrip } from "@/components/home/TrustStrip";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <BrandValueStrip />
      <ExploreCollections />
      <WildlifeStoryBanner />
      <BestsellersCarousel />
      <div className="bg-jungle h-24" /> {/* Spacer for the bottom wave of TrustStrip */}
      <TrustStrip />
      <div className="bg-jungle h-12" /> {/* Spacer to blend into footer */}
    </>
  );
}
