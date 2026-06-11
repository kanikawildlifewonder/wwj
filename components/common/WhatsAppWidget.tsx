"use client";

import { useState, useEffect } from "react";

export function WhatsAppWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show widget after a short delay for a premium feel
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Briefly trigger tooltip to catch user's attention
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    const hideTooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
      clearTimeout(hideTooltipTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 font-sans">
      {/* Tooltip Badge */}
      <div
        className={`bg-white text-jungle border border-jungle/10 px-4 py-2 rounded-xl shadow-xl text-xs font-semibold tracking-wide transition-all duration-500 transform ${
          showTooltip
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="relative">
          Chat with us!
          <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-r border-b border-jungle/10 rotate-[-45deg]" />
        </div>
      </div>

      {/* Floating Button */}
      <a
        href="https://wa.me/919849077246?text=Hi!%20I%20have%20an%20inquiry%20regarding%20Wildlife%20Wonder%20Jewelry."
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba5a] transition-all duration-300 transform hover:scale-110 hover:rotate-6 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulsing Outer Rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping opacity-75 group-hover:opacity-0 transition-opacity duration-300" />
        <span className="absolute -inset-2 rounded-full bg-[#25D366]/10 animate-pulse" />

        {/* Custom SVG WhatsApp Icon */}
        <svg
          className="w-7 h-7 fill-current transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
