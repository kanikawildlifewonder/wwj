import React from "react";
import { HandHeart, Leaf, PackageOpen, ShieldCheck } from "lucide-react";

const VALUES = [
  { icon: HandHeart, title: "HANDMADE", subtitle: "WITH LOVE" },
  { icon: Leaf, title: "INSPIRED BY", subtitle: "WILDLIFE" },
  { icon: PackageOpen, title: "SUSTAINABLE", subtitle: "PACKAGING" },
  { icon: ShieldCheck, title: "SUPPORTS", subtitle: "CONSERVATION" },
];

export function BrandValueStrip() {
  return (
    <section className="bg-jungle border-b border-border py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x-0 md:divide-x divide-border">
          {VALUES.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center px-4 space-y-3">
              <val.icon className="w-8 h-8 text-gold" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="font-sans text-xs tracking-widest text-ivory/80 uppercase font-bold">{val.title}</span>
                <span className="font-sans text-xs tracking-widest text-ivory/60 uppercase">{val.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
