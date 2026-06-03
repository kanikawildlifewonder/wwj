import React from "react";
import { Lock, RefreshCcw, Globe, HeadphonesIcon } from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: Lock,
    title: "SECURE PAYMENT",
    description: "100% Secure & Safe Transactions",
  },
  {
    icon: RefreshCcw,
    title: "EASY RETURNS",
    description: "Hassle-free Returns within 7 days",
  },
  {
    icon: Globe,
    title: "WORLDWIDE SHIPPING",
    description: "Delivering Happiness Across the Globe",
  },
  {
    icon: HeadphonesIcon,
    title: "SUPPORT",
    description: "We're Here For You 24x7",
  },
];

export function TrustStrip() {
  return (
    <section className="bg-ivory py-12 relative">
      {/* Top Wave Decorator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 text-jungle translate-y-[-99%]">
        <svg className="relative block w-[calc(100%+1.3px)] h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_FEATURES.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 text-jungle">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <feature.icon className="w-8 h-8 opacity-80" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <h4 className="font-sans text-xs tracking-widest uppercase font-bold">{feature.title}</h4>
                <p className="font-sans text-xs text-jungle/70 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Decorator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none text-jungle translate-y-[99%] z-20">
        <svg className="relative block w-[calc(100%+1.3px)] h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
        </svg>
      </div>
    </section>
  );
}
