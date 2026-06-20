import React from "react";
import Link from "next/link";
import { ArrowRight, Quote, Star, Mail, AtSign } from "lucide-react";
import { getPageContent } from "@/app/actions/content";

export const metadata = {
  title: "Meet the Founder | WWJ — Wildlife Wonder Jewellery",
  description:
    "Meet Kanika — the founder of WWJ Wildlife Wonder Jewellery. Her story of passion for wildlife, artisanal craftsmanship and building a brand with purpose.",
};

const DEFAULT = {
  heroTitle: "Meet the Founder",
  heroSubtitle: "A story of passion, purpose, and the wild.",
  heroImage: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=800&auto=format&fit=crop",
  founderName: "Kanika",
  founderRole: "Founder & Creative Director, WWJ",
  founderImage: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=800&auto=format&fit=crop",
  quote:
    "I founded WWJ with a singular vision: to capture the fierce, delicate, and awe-inspiring essence of nature in wearable art. Every piece is a conversation between the wild and the one who wears it.",
  bio1:
    "Growing up surrounded by the rich biodiversity of India, Kanika developed a deep reverence for wildlife from a very young age. Weekend trips to sanctuaries and countless hours spent sketching animals in her notebook planted the seeds of what would eventually become WWJ.",
  bio2:
    "After completing formal training in fine jewellery design, she spent years working with master artisans across Rajasthan and Mumbai — learning traditional metalworking, stone-setting, and the art of translating nature into gold. In 2019, she launched Wildlife Wonder Jewellery with a small capsule collection of six animal-inspired pieces.",
  bio3:
    "Today, WWJ has grown into a beloved brand worn by thousands across India and beyond. But Kanika's mission remains the same: create beautiful things that remind us why the wild is worth protecting.",
  instagramHandle: "@wildlifewonderjewellery",
  email: "kanika@wwj.com",
  milestone1Number: "5+",
  milestone1Label: "Years of Craft",
  milestone2Number: "200+",
  milestone2Label: "Unique Designs",
  milestone3Number: "10K+",
  milestone3Label: "Happy Customers",
  milestone4Number: "15+",
  milestone4Label: "Artisan Partners",
};

interface ParsedFounderStory {
  introduction: string[];
  achievements: string[];
  vision: string;
  mission: string;
  coreValues: string[];
  message: string;
  motto: string;
}

function parseFounderStory(text: string): ParsedFounderStory {
  const result: ParsedFounderStory = {
    introduction: [],
    achievements: [],
    vision: "",
    mission: "",
    coreValues: [],
    message: "",
    motto: "",
  };

  if (!text) return result;

  const idxAchievements = text.indexOf("Achievements");
  const idxVision = text.indexOf("Vision");
  const idxMission = text.indexOf("Mission");
  const idxValues = text.indexOf("Core Values");
  const idxMessage = text.indexOf("Founder's Message");
  const idxMotto = text.indexOf("Motto");

  const cleanParagraphs = (str: string) => {
    return str
      .split(/(?:\r?\n)+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  };

  // 1. Introduction
  let introText = "";
  if (idxAchievements !== -1) {
    introText = text.substring(0, idxAchievements).trim();
  } else if (idxVision !== -1) {
    introText = text.substring(0, idxVision).trim();
  } else {
    introText = text;
  }
  
  if (introText.startsWith("FOUNDER:")) {
    introText = introText.substring(8).trim();
  } else if (introText.startsWith("FOUNDER")) {
    introText = introText.substring(7).trim();
  }
  result.introduction = cleanParagraphs(introText);

  // 2. Achievements
  if (idxAchievements !== -1) {
    const end = idxVision !== -1 ? idxVision : (idxMission !== -1 ? idxMission : text.length);
    let achText = text.substring(idxAchievements + 12, end).trim();
    if (achText.startsWith(":") || achText.startsWith("-")) {
      achText = achText.substring(1).trim();
    }
    result.achievements = cleanParagraphs(achText);
  }

  // 3. Vision
  if (idxVision !== -1) {
    const end = idxMission !== -1 ? idxMission : (idxValues !== -1 ? idxValues : text.length);
    let visText = text.substring(idxVision + 6, end).trim();
    if (visText.startsWith(":") || visText.startsWith("-")) {
      visText = visText.substring(1).trim();
    }
    result.vision = visText;
  }

  // 4. Mission
  if (idxMission !== -1) {
    const end = idxValues !== -1 ? idxValues : (idxMessage !== -1 ? idxMessage : text.length);
    let misText = text.substring(idxMission + 7, end).trim();
    if (misText.startsWith(":") || misText.startsWith("-")) {
      misText = misText.substring(1).trim();
    }
    result.mission = misText;
  }

  // 5. Core Values
  if (idxValues !== -1) {
    const end = idxMessage !== -1 ? idxMessage : (idxMotto !== -1 ? idxMotto : text.length);
    let valText = text.substring(idxValues + 11, end).trim();
    if (valText.startsWith(":") || valText.startsWith("-")) {
      valText = valText.substring(1).trim();
    }
    result.coreValues = valText
      .split(/•|-|\||\.|\*/g)
      .map(v => v.trim())
      .filter(v => v.length > 2);
  }

  // 6. Message
  if (idxMessage !== -1) {
    const end = idxMotto !== -1 ? idxMotto : text.length;
    let msgText = text.substring(idxMessage + 17, end).trim();
    if (msgText.startsWith(":") || msgText.startsWith("-")) {
      msgText = msgText.substring(1).trim();
    }
    result.message = msgText.replace(/^["'\s]+|["'\s]+$/g, "");
  }

  // 7. Motto
  if (idxMotto !== -1) {
    let motText = text.substring(idxMotto + 5).trim();
    if (motText.startsWith(":") || motText.startsWith("-")) {
      motText = motText.substring(1).trim();
    }
    result.motto = motText.replace(/^["'\s]+|["'\s]+$/g, "");
  }

  return result;
}

export default async function AboutFounderPage() {
  let d = { ...DEFAULT };
  try {
    const raw = await getPageContent("about-founder");
    if (raw) {
      const saved = JSON.parse(raw);
      d = { ...DEFAULT, ...saved };
    }
  } catch { /* use defaults */ }

  const combinedBio = [d.bio1, d.bio2, d.bio3].filter(Boolean).join("\n\n");
  const parsed = parseFounderStory(combinedBio);

  const displayQuote = parsed.message || d.quote;

  return (
    <div className="bg-cream min-h-screen">

      {/* ─── Hero ─── */}
      <section className="relative h-[50vh] min-h-[340px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: `url('${d.heroImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/70 to-jungle/30" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto mt-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-bold mb-4">The Woman Behind WWJ</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory mb-6 tracking-wide">
            {d.heroTitle}
          </h1>
          <p className="text-lg text-ivory/80 font-light leading-relaxed">{d.heroSubtitle}</p>
        </div>
      </section>

      {/* ─── Founder intro ─── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Photo */}
            <div className="lg:col-span-5 relative lg:sticky lg:top-28">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="absolute -inset-3 rounded-[40%_60%_60%_40%_/_40%_40%_60%_60%] border-2 border-gold/30" />
                <div className="relative aspect-[4/5] rounded-[40%_60%_60%_40%_/_40%_40%_60%_60%] overflow-hidden border-4 border-ivory shadow-2xl">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${d.founderImage}')` }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-jungle text-ivory px-5 py-3 rounded-xl shadow-lg border border-gold/20">
                  <p className="font-display text-lg text-gold">{d.founderName}</p>
                  <p className="text-xs text-ivory/60 mt-0.5">{d.founderRole}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-8">
              {displayQuote && (
                <div className="relative pl-6 border-l-2 border-gold">
                  <Quote className="absolute -left-3 -top-1 w-5 h-5 text-gold bg-cream p-0.5" />
                  <p className="font-display text-xl text-jungle/80 italic leading-relaxed">
                    &quot;{displayQuote}&quot;
                  </p>
                </div>
              )}

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
                  <p className="text-lg text-jungle font-medium">{d.bio1}</p>
                  {d.bio2 && <p className="text-sm">{d.bio2}</p>}
                  {d.bio3 && <p className="text-sm">{d.bio3}</p>}
                </div>
              )}

              {/* Achievements */}
              {parsed.achievements.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-jungle/10">
                  <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase block">Key Achievements</span>
                  <div className="space-y-2 text-jungle/80 text-sm leading-relaxed">
                    {parsed.achievements.map((ach, idx) => (
                      <p key={idx} className="relative pl-4">
                        <span className="absolute left-0 text-gold">•</span> {ach}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Vision & Mission Card */}
              {(parsed.vision || parsed.mission) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gold/5 border border-gold/20 rounded-2xl p-6 md:p-8 mt-8">
                  {parsed.vision && (
                    <div className="space-y-2">
                      <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase block">Vision</span>
                      <p className="text-jungle text-xs leading-relaxed">{parsed.vision}</p>
                    </div>
                  )}
                  {parsed.mission && (
                    <div className="space-y-2 border-t md:border-t-0 md:border-l border-jungle/10 pt-4 md:pt-0 md:pl-6">
                      <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase block">Mission</span>
                      <p className="text-jungle text-xs leading-relaxed">{parsed.mission}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Social links */}
              <div className="flex items-center gap-6 pt-4 border-t border-jungle/10">
                {d.instagramHandle && (
                  <a
                    href={`https://instagram.com/${d.instagramHandle.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-jungle/60 hover:text-gold transition-colors font-semibold"
                  >
                    <AtSign className="w-4 h-4 text-gold" />
                    {d.instagramHandle}
                  </a>
                )}
                {d.email && (
                  <a
                    href={`mailto:${d.email}`}
                    className="flex items-center gap-2 text-sm text-jungle/60 hover:text-gold transition-colors font-semibold"
                  >
                    <Mail className="w-4 h-4 text-gold" />
                    {d.email}
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Milestones ─── */}
      <section className="py-16 bg-jungle border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: d.milestone1Number, label: d.milestone1Label },
              { number: d.milestone2Number, label: d.milestone2Label },
              { number: d.milestone3Number, label: d.milestone3Label },
              { number: d.milestone4Number, label: d.milestone4Label },
            ].map((m, i) => (
              <div key={i} className="space-y-1">
                <p className="font-display text-4xl text-gold">{m.number}</p>
                <p className="text-ivory/60 text-sm uppercase tracking-widest">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Principles / Values from the founder ─── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase font-bold mb-3">Words to Live By</p>
            <h2 className="font-display text-3xl md:text-4xl text-jungle">The Principles Behind Every Piece</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-4" />
          </div>

          {parsed.coreValues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {parsed.coreValues.map((val, i) => {
                let title = "Principle";
                let text = val;
                const separatorIdx = val.indexOf("—") !== -1 ? val.indexOf("—") : val.indexOf(":");
                if (separatorIdx !== -1) {
                  title = val.substring(0, separatorIdx).trim();
                  text = val.substring(separatorIdx + 1).trim();
                }
                return (
                  <div key={i} className="flex gap-4 p-5 bg-ivory rounded-xl border border-jungle/5 hover:border-gold/20 hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jungle flex items-center justify-center">
                      <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm text-jungle font-semibold mb-1">{title}</h3>
                      <p className="text-jungle/60 text-[11px] leading-relaxed">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {[
                {
                  star: true,
                  title: "Nature First",
                  text: "Every design begins with careful study of the animal it represents — its movement, its habitat, its spirit. We never compromise on authenticity.",
                },
                {
                  star: true,
                  title: "Community & Craft",
                  text: "We work exclusively with local artisan families who have practised their craft for generations. Their livelihood is as important to us as our products.",
                },
                {
                  star: true,
                  title: "Purpose Over Profit",
                  text: "A portion of every sale goes to wildlife conservation organisations. Because without the wild, there is no WWJ.",
                },
              ].map((v, i) => (
                <div key={i} className="flex gap-5 p-5 bg-ivory rounded-xl border border-jungle/5 hover:border-gold/20 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-jungle flex items-center justify-center">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-jungle mb-1">{v.title}</h3>
                    <p className="text-jungle/60 text-sm leading-relaxed">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Motto / Core Statement Callout ─── */}
      {parsed.motto && (
        <section className="py-24 bg-cream text-center px-4 relative overflow-hidden border-t border-border">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14rem] font-serif text-jungle/5 pointer-events-none select-none leading-none">“</div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="text-gold text-xs tracking-[0.3em] uppercase font-bold">Our Philosophy Motto</span>
            <p className="font-display text-2xl md:text-3xl text-jungle leading-relaxed italic font-light">
              &quot;{parsed.motto}&quot;
            </p>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="py-20 bg-jungle text-center px-4">
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-bold mb-4">From Kanika&apos;s Collection</p>
        <h2 className="font-display text-3xl md:text-4xl text-ivory mb-6">Wear a Piece of Her World</h2>
        <p className="text-ivory/60 mb-10 max-w-xl mx-auto text-sm leading-relaxed">
          Every piece in the WWJ family carries a little of Kanika&apos;s story &mdash; her love for animals, her respect for craft, and her belief that beauty and purpose can coexist.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-gold text-jungle px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-ivory transition-colors rounded-btn"
          >
            Shop Collections <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about/brand"
            className="inline-flex items-center gap-2 border border-gold/50 text-gold px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gold/10 transition-colors rounded-btn"
          >
            About the Brand <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
