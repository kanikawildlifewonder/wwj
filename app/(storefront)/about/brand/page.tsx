import React from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Globe, Shield, Heart, Star, Sparkles } from "lucide-react";
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

interface ParsedBrandStory {
  introduction: string[];
  mission: string;
  creationItems: { emoji: string; title: string; desc: string }[];
  coreValues: { title: string; desc: string }[];
  promise: string;
  tagline: string;
  brandPromise: string;
}

function parseBrandStory(text: string): ParsedBrandStory {
  const result: ParsedBrandStory = {
    introduction: [],
    mission: "",
    creationItems: [],
    coreValues: [],
    promise: "",
    tagline: "",
    brandPromise: "",
  };

  if (!text) return result;

  const idxMission = text.indexOf("Our Mission");
  const idxCreate = text.indexOf("What We Create");
  const idxValues = text.indexOf("Our Core Values");
  const idxPromise = text.indexOf("Our Promise");
  const idxTagline = text.indexOf("WWJ Tagline");
  const idxBrandPromise = text.indexOf("Brand Promise");

  const cleanParagraphs = (str: string) => {
    return str
      .split(/(?:\r?\n)+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  };

  // 1. Extract Introduction
  let introText = "";
  if (idxMission !== -1) {
    introText = text.substring(0, idxMission).trim();
  } else if (idxCreate !== -1) {
    introText = text.substring(0, idxCreate).trim();
  } else {
    introText = text;
  }
  result.introduction = cleanParagraphs(introText);

  // 2. Extract Mission
  if (idxMission !== -1) {
    const end = idxCreate !== -1 ? idxCreate : (idxValues !== -1 ? idxValues : text.length);
    result.mission = text.substring(idxMission + 11, end).trim();
  }

  // 3. Extract What We Create
  if (idxCreate !== -1) {
    const end = idxValues !== -1 ? idxValues : (idxPromise !== -1 ? idxPromise : text.length);
    const createBlock = text.substring(idxCreate + 14, end).trim();
    
    // Split into paragraphs/lines
    const lines = createBlock.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    let currentItem: { emoji: string; title: string; desc: string } | null = null;
    
    const knownTitles = [
      "Custom Pet Keepsakes",
      "Wildlife-Inspired Jewelry",
      "Artisan Animal-Themed Mugs",
      "Accessories & Gifts",
      "Lifestyle & Home Décor",
      "Lifestyle & Home Decor",
      "Lifestyle & Home"
    ];

    for (const line of lines) {
      // Check if line starts with emoji, number, or bullet, OR matches a known title
      const markerMatch = line.match(/^([🐾🦊🦋🔮☕🎁🏡🏡✨]|[1-9]\d*[\.\s]*|[•\-\*]\s*)(.+)$/i);
      
      let isTitle = false;
      let titleText = line;
      let marker = "";
      
      if (markerMatch) {
        marker = markerMatch[1].trim();
        titleText = markerMatch[2].trim();
        isTitle = true;
      } else {
        const matchedKnown = knownTitles.find(t => line.toLowerCase().startsWith(t.toLowerCase()));
        if (matchedKnown) {
          titleText = line.trim();
          isTitle = true;
        }
      }
      
      if (isTitle) {
        if (currentItem) {
          result.creationItems.push(currentItem);
        }
        currentItem = {
          emoji: marker || "✨",
          title: titleText,
          desc: ""
        };
      } else {
        if (currentItem) {
          currentItem.desc = currentItem.desc ? currentItem.desc + " " + line : line;
        }
      }
    }
    if (currentItem) {
      result.creationItems.push(currentItem);
    }
  }

  // 4. Extract Our Core Values
  if (idxValues !== -1) {
    const end = idxPromise !== -1 ? idxPromise : (idxTagline !== -1 ? idxTagline : text.length);
    const valuesBlock = text.substring(idxValues + 15, end).trim();
    const valTitles = ["Handmade with Love", "Love for Animals", "Creativity & Storytelling", "Sustainability", "Community & Compassion"];
    
    const appearances = valTitles
      .map(t => ({ title: t, index: valuesBlock.indexOf(t) }))
      .filter(a => a.index !== -1)
      .sort((a, b) => a.index - b.index);

    for (let i = 0; i < appearances.length; i++) {
      const current = appearances[i];
      const next = appearances[i + 1];
      const valText = next 
        ? valuesBlock.substring(current.index + current.title.length, next.index).trim()
        : valuesBlock.substring(current.index + current.title.length).trim();
      result.coreValues.push({ title: current.title, desc: valText });
    }
  }

  // 5. Extract Our Promise
  if (idxPromise !== -1) {
    const end = idxTagline !== -1 ? idxTagline : (idxBrandPromise !== -1 ? idxBrandPromise : text.length);
    result.promise = text.substring(idxPromise + 11, end).trim();
  }

  // 6. Extract Tagline
  if (idxTagline !== -1) {
    const end = idxBrandPromise !== -1 ? idxBrandPromise : text.length;
    result.tagline = text.substring(idxTagline + 11, end).trim().replace(/^["'\s]+|["'\s]+$/g, "");
  }

  // 7. Extract Brand Promise
  if (idxBrandPromise !== -1) {
    result.brandPromise = text.substring(idxBrandPromise + 13).trim().replace(/^["'\s]+|["'\s]+$/g, "");
  }

  return result;
}

export default async function AboutBrandPage() {
  let d = { ...DEFAULT };
  try {
    const raw = await getPageContent("about-brand");
    if (raw) {
      const saved = JSON.parse(raw);
      d = { ...DEFAULT, ...saved };
    }
  } catch { /* use defaults */ }

  const parsed = parseBrandStory(d.missionParagraph1 + "\n" + (d.missionParagraph2 || ""));
  
  const defaultValues = [
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="w-12 h-1 bg-gold" />
              <h2 className="font-display text-3xl md:text-4xl text-jungle">{d.missionTitle}</h2>
              
              {parsed.introduction.length > 0 ? (
                <div className="space-y-4 text-jungle/80 leading-relaxed">
                  {parsed.introduction.map((p, idx) => (
                    <p key={idx} className={idx === 0 ? "text-lg text-jungle font-medium" : "text-sm"}>
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-jungle/80 leading-relaxed">
                  <p className="text-lg text-jungle font-medium">{d.missionParagraph1}</p>
                </div>
              )}

              {parsed.mission && (
                <div className="bg-gold/5 border-l-4 border-gold p-5 rounded-r-xl space-y-2 mt-6">
                  <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase block">Our Mission</span>
                  <p className="text-jungle font-serif italic text-lg leading-relaxed">{parsed.mission}</p>
                </div>
              )}

              {d.missionParagraph2 && parsed.creationItems.length === 0 && (
                <p className="text-jungle/70 leading-relaxed text-sm pt-2">{d.missionParagraph2}</p>
              )}

              <div className="pt-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 bg-jungle text-gold px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-charcoal transition-colors rounded-btn"
                >
                  Explore Collections <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative h-[300px] sm:h-[400px] lg:h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-ivory/30 lg:sticky lg:top-28">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${d.missionImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jungle/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── What We Create ─── */}
      {parsed.creationItems.length > 0 && (
        <section className="py-20 bg-ivory border-t border-jungle/5">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold mb-3 block">Artisan Crafts</span>
              <h2 className="font-display text-3xl md:text-4xl text-jungle">What We Create</h2>
              <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsed.creationItems.map((item, i) => (
                <div 
                  key={i} 
                  className="bg-cream/20 border border-jungle/10 rounded-2xl p-6 hover:border-gold/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-base text-jungle font-semibold">{item.title}</h3>
                    <p className="text-jungle/70 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Values ─── */}
      <section className="py-20 bg-jungle">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-bold mb-3">What We Stand For</p>
            <h2 className="font-display text-3xl md:text-4xl text-ivory">Our Philosophy</h2>
            <div className="w-12 h-[1px] bg-gold/30 mx-auto mt-4" />
          </div>

          {parsed.coreValues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsed.coreValues.map((val, i) => {
                const Icon = [Heart, Leaf, Globe, Shield, Star][i % 5];
                return (
                  <div
                    key={i}
                    className="bg-forest/40 border border-gold/10 rounded-2xl p-6 space-y-4 hover:border-gold/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-display text-lg text-ivory">{val.title}</h3>
                    <p className="text-ivory/60 text-xs leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {defaultValues.map(({ icon: Icon, title, text }, i) => (
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
          )}
        </div>
      </section>

      {/* ─── Promise Callout ─── */}
      {parsed.promise && (
        <section className="py-24 bg-cream text-center px-4 relative overflow-hidden border-b border-jungle/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14rem] font-serif text-jungle/5 pointer-events-none select-none leading-none">“</div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold">Our Promise</span>
            <p className="font-display text-2xl md:text-3xl text-jungle leading-relaxed italic font-light">
              &quot;{parsed.promise}&quot;
            </p>
            {parsed.tagline && (
              <div className="pt-4">
                <span className="text-jungle/40 text-xs uppercase tracking-widest block mb-2">Tagline</span>
                <p className="text-gold text-lg tracking-[0.25em] uppercase font-bold font-display">{parsed.tagline}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Brand Promise Strip ─── */}
      {parsed.brandPromise && (
        <section className="py-12 bg-jungle text-center px-4 border-b border-gold/10">
          <div className="max-w-4xl mx-auto space-y-2">
            <span className="text-gold/50 text-[9px] tracking-[0.3em] uppercase font-bold">Brand Commitment</span>
            <p className="text-ivory/90 text-sm font-sans tracking-wide leading-relaxed italic">
              {parsed.brandPromise}
            </p>
          </div>
        </section>
      )}

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
