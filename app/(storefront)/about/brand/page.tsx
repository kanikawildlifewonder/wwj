import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Globe, Shield, Heart } from "lucide-react";
import { getPageContent } from "@/app/actions/content";

export const metadata = {
  title: "About the Brand | WWJ — Wildlife Wonder Jewellery",
  description:
    "Learn the story behind WWJ — Wildlife Wonder Jewellery. Our mission, values, and commitment to wildlife conservation through handcrafted jewellery.",
};

const DEFAULT = {
  heroTitle: "Our Story",
  heroSubtitle:
    "Where high-end craftsmanship meets untamed beauty. Born from a passion for wildlife and a dedication to exquisite design.",
  heroImage: "/images/hero_leopard.png",
  missionTitle: "A Brand Born From the Wild",
  missionParagraph1:
    "Wildlife Wonder Jewellery (WWJ) was founded with a singular vision: to capture the fierce, delicate, and awe-inspiring essence of nature in wearable art. Every collection begins not in a design studio, but in the wild — inspired by the creatures that share our planet.",
  missionParagraph2:
    "We believe jewellery should tell a story. Not just of beauty, but of purpose. Each piece in the WWJ family is a pledge — a promise to the animals that inspired it, and to the world they inhabit.",
  missionImage: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&auto=format&fit=crop",
  value1Title: "Artisanal Craftsmanship",
  value1Text:
    "Every curve, texture, and gemstone is placed with intention by skilled artisans using techniques passed down through generations. We believe in slow fashion.",
  value2Title: "Ethical Sourcing",
  value2Text:
    "Our materials are procured with deep respect for the earth. We use conflict-free gemstones and recycled precious metals wherever possible.",
  value3Title: "Wildlife Conservation",
  value3Text:
    "Nature gives us our inspiration, and we give back. A portion of every purchase goes directly to verified wildlife sanctuaries and conservation funds.",
  value4Title: "Community First",
  value4Text:
    "We work with local artisan communities across India, ensuring fair wages, safe working conditions, and a livelihood that honours traditional craft.",
  ctaTitle: "Wear Your Wild Side",
  ctaText:
    "Explore our collections and find the spirit animal that resonates with your unique style.",
};

export default async function AboutBrandPage() {
  let d = { ...DEFAULT };
  try {
    const raw = await getPageContent("about-brand");
    if (raw) {
      const saved = JSON.parse(raw);
      d = { ...DEFAULT, ...saved };
    }
  } catch { /* use defaults */ }

  const values = [
    { icon: Heart,  title: d.value1Title, text: d.value1Text },
    { icon: Globe,  title: d.value2Title, text: d.value2Text },
    { icon: Leaf,   title: d.value3Title, text: d.value3Text },
    { icon: Shield, title: d.value4Title, text: d.value4Text },
  ];

  return (
    <div className="bg-cream min-h-screen">

      {/* ─── Hero ─── */}
      <section className="relative h-[55vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: `url('${d.heroImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/60 to-jungle/20" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto mt-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-bold mb-4">About the Brand</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory mb-6 tracking-wide">
            {d.heroTitle}
          </h1>
          <p className="text-lg text-ivory/80 font-light leading-relaxed max-w-2xl mx-auto">
            {d.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ─── Mission ─── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="w-12 h-1 bg-gold" />
              <h2 className="font-display text-3xl md:text-4xl text-jungle">{d.missionTitle}</h2>
              <p className="text-jungle/70 leading-relaxed text-lg">{d.missionParagraph1}</p>
              <p className="text-jungle/70 leading-relaxed">{d.missionParagraph2}</p>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-jungle text-gold px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-charcoal transition-colors rounded-btn"
              >
                Explore Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl border-4 border-ivory/30">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${d.missionImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jungle/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="py-20 bg-jungle">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-bold mb-3">What We Stand For</p>
            <h2 className="font-display text-3xl md:text-4xl text-ivory">Our Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, text }, i) => (
              <div
                key={i}
                className="bg-forest/40 border border-gold/10 rounded-2xl p-6 space-y-4 hover:border-gold/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-lg text-ivory">{title}</h3>
                <p className="text-ivory/60 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Conservation Banner ─── */}
      <section className="py-20 bg-ivory border-y border-jungle/5">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <Leaf className="w-10 h-10 text-gold mx-auto" />
          <h2 className="font-display text-3xl md:text-4xl text-jungle">
            Every Purchase Protects a Species
          </h2>
          <p className="text-jungle/70 leading-relaxed max-w-2xl mx-auto">
            A percentage of every sale is donated to our partner wildlife sanctuaries and conservation programmes across India. When you wear WWJ, you wear a promise.
          </p>
          <Link
            href="/impact"
            className="inline-flex items-center gap-2 border border-jungle text-jungle px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-jungle hover:text-gold transition-colors rounded-btn"
          >
            See Our Impact <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 text-center px-4">
        <h2 className="font-display text-3xl md:text-4xl text-jungle mb-6">{d.ctaTitle}</h2>
        <p className="text-jungle/60 mb-8 max-w-xl mx-auto">{d.ctaText}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-jungle text-gold px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-charcoal transition-colors rounded-btn"
          >
            Shop Collections <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about/founder"
            className="inline-flex items-center gap-2 border border-jungle text-jungle px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-jungle hover:text-gold transition-colors rounded-btn"
          >
            Meet the Founder <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
