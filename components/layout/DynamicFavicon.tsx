"use client";

import { useState, useEffect } from "react";
import { getPageContent } from "@/app/actions/content";

/**
 * Injects a dynamic favicon <link> tag using the URL stored in the DB.
 * Falls back to the static /favicon.ico if nothing is set.
 */
export function DynamicFavicon() {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    getPageContent("brand-favicon").then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.url) setFaviconUrl(parsed.url);
        } catch { /* keep static */ }
      }
    });
  }, []);

  useEffect(() => {
    if (!faviconUrl) return;
    // Remove existing favicon links
    document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = faviconUrl;
    link.type = faviconUrl.endsWith(".png") ? "image/png" : faviconUrl.endsWith(".svg") ? "image/svg+xml" : "image/x-icon";
    document.head.appendChild(link);
  }, [faviconUrl]);

  return null;
}
