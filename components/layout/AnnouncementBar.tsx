import React from "react";
import { Truck, Sparkles, PawPrint, Gem } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-jungle text-gold py-2 px-4 text-xs tracking-wider flex items-center justify-between border-b border-border font-medium">
      <div className="hidden md:flex items-center gap-2">
        <Truck className="w-3.5 h-3.5" />
        <span>FREE SHIPPING ON ORDERS ABOVE ₹1499</span>
      </div>
      
      <div className="flex items-center justify-center gap-4 md:gap-8 mx-auto md:mx-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          <span>HANDCRAFTED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <PawPrint className="w-3 h-3" />
          <span>ANIMAL INSPIRED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Gem className="w-3 h-3" />
          <span>PREMIUM QUALITY</span>
        </div>
      </div>
    </div>
  );
}
