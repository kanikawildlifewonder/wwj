import React from "react";
import { getPageContent } from "@/app/actions/content";

export type SiteThemeConfig = {
  jungle?: string;
  forest?: string;
  gold?: string;
  goldDark?: string;
  goldLight?: string;
  ivory?: string;
  cream?: string;
  charcoal?: string;
};

export async function DynamicThemeInjector() {
  const raw = await getPageContent("site-theme");
  if (!raw) return null;

  try {
    const t: SiteThemeConfig = JSON.parse(raw);
    const rules: string[] = [];

    if (t.jungle)    rules.push(`--wwj-jungle: ${t.jungle};`);
    if (t.forest)    rules.push(`--wwj-forest: ${t.forest};`);
    if (t.gold)      rules.push(`--wwj-gold: ${t.gold};`);
    if (t.goldDark)  rules.push(`--wwj-gold-dark: ${t.goldDark};`);
    if (t.goldLight) rules.push(`--wwj-gold-light: ${t.goldLight};`);
    if (t.ivory)     rules.push(`--wwj-ivory: ${t.ivory};`);
    if (t.cream)     rules.push(`--wwj-cream: ${t.cream};`);
    if (t.charcoal)  rules.push(`--wwj-charcoal: ${t.charcoal};`);

    if (rules.length === 0) return null;

    const cssString = `:root { ${rules.join(" ")} }`;

    return (
      <style
        id="wwj-dynamic-theme"
        dangerouslySetInnerHTML={{ __html: cssString }}
      />
    );
  } catch {
    return null;
  }
}
