import React from "react";
import { getPageContent } from "@/app/actions/content";
import { Truck, Sparkles, PawPrint, Gem } from "lucide-react";

export async function AnnouncementBar() {
  const raw = await getPageContent("announcement-bar");
  let shippingText = "FREE SHIPPING ON ORDERS ABOVE ₹1499";
  let enabled = true;
  let linkUrl = "";
  let badge1 = "HANDCRAFTED";
  let badge2 = "ANIMAL INSPIRED";
  let badge3 = "PREMIUM QUALITY";

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.text !== undefined) shippingText = parsed.text;
      if (parsed.enabled !== undefined) enabled = Boolean(parsed.enabled);
      if (parsed.linkUrl !== undefined) linkUrl = parsed.linkUrl;
      if (parsed.badge1) badge1 = parsed.badge1;
      if (parsed.badge2) badge2 = parsed.badge2;
      if (parsed.badge3) badge3 = parsed.badge3;
    } catch { /* keep default */ }
  }

  if (!enabled) return null;

  const content = (
    <div className="bg-jungle text-gold py-2 px-3 sm:px-4 text-[10px] sm:text-xs tracking-wider flex items-center justify-between border-b border-border font-medium overflow-x-auto hide-scrollbar">
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <Truck className="w-3.5 h-3.5" />
        <span>{shippingText}</span>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-8 mx-auto md:mx-0 shrink-0">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span className="whitespace-nowrap">{badge1}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <PawPrint className="w-3 h-3 shrink-0" />
          <span className="whitespace-nowrap">{badge2}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Gem className="w-3 h-3 shrink-0" />
          <span className="whitespace-nowrap">{badge3}</span>
        </div>
      </div>
    </div>
  );

  if (linkUrl) {
    return (
      <a href={linkUrl} className="block hover:opacity-95 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
}
