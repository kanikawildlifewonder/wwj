"use client";

import React, { useState, useEffect, useRef } from "react";
import { updatePageContent, getPageContent } from "@/app/actions/content";
import { uploadImage } from "@/app/actions/upload";
import { toast } from "sonner";
import {
  Save, FileText, Image as ImageIcon, Home, Megaphone,
  Layout, RefreshCw, CheckCircle, Upload, X, Eye,
} from "lucide-react";

/* ─────────────────────── types ──────────────────────── */
type CollectionSlot = { title: string; description: string; image: string };
type Section = "hero" | "collections" | "about" | "announcement" | "aboutBrand" | "aboutFounder";

const DEFAULT_COLLECTIONS: CollectionSlot[] = [
  { title: "WWJ JEWELLERY",       description: "Handcrafted animal-inspired fashion pieces.", image: "/images/products/peacock_necklace.png" },
  { title: "WWA ACCESSORIES",     description: "Cute everyday wildlife collectibles.",         image: "/images/products/elephant_keychain.png" },
  { title: "GIFTING COLLECTION",  description: "Ready-to-gift pieces & curated sets for every occasion.", image: "/images/collections/gifting_box.png" },
];

/* ─────────────────────── helpers ─────────────────────── */
function SectionCard({ icon: Icon, label, description, active, onClick }: {
  icon: React.ElementType; label: string; description: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
        active
          ? "bg-jungle border-jungle text-gold shadow-lg shadow-jungle/20"
          : "bg-white border-border text-jungle hover:border-gold/40 hover:bg-cream/40"
      }`}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-gold/20" : "bg-cream"}`}>
        <Icon className={`w-4 h-4 ${active ? "text-gold" : "text-jungle/60"}`} />
      </div>
      <div>
        <p className={`text-sm font-semibold ${active ? "text-gold" : "text-jungle"}`}>{label}</p>
        <p className={`text-xs mt-0.5 ${active ? "text-ivory/60" : "text-jungle/50"}`}>{description}</p>
      </div>
    </button>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider">{label}</label>
      {hint && <p className="text-xs text-jungle/40">{hint}</p>}
      {children}
    </div>
  );
}

const INPUT_CLS = "w-full px-3.5 py-2.5 bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 border border-border rounded-lg focus:outline-none focus:border-gold text-sm text-jungle placeholder:text-jungle/30 transition-all";
const TEXTAREA_CLS = `${INPUT_CLS} resize-none`;

/* ─────────────────────── image uploader ─────────────────── */
function ImageUploader({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await uploadImage(fd);
    setUploading(false);
    if (res.success && res.url) { onChange(res.url); toast.success("Image uploaded!"); }
    else toast.error(res.error ?? "Upload failed");
    if (fileRef.current) fileRef.current.value = "";
  };

  const applyUrl = () => {
    if (urlInput.trim()) { onChange(urlInput.trim()); setUrlInput(""); }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider">{label}</label>

      {/* Preview */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border bg-cream/30">
        {value ? (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${value})` }} />
            <div className="absolute inset-0 bg-jungle/30" />
            <button
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
              {value.startsWith("http") ? "External URL" : value.split("/").pop()}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-jungle/30">
            <ImageIcon className="w-8 h-8" />
            <p className="text-xs">No image selected</p>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 py-2 border border-dashed border-gold/50 text-gold text-xs font-semibold rounded-lg hover:bg-gold/5 transition-colors disabled:opacity-50"
        >
          {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? "Uploading…" : "Upload Image"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Or paste URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste image URL…"
          className="flex-1 px-3 py-2 border border-border rounded-lg text-xs text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-colors"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyUrl(); } }}
        />
        <button
          type="button"
          onClick={applyUrl}
          className="px-3 py-2 bg-jungle text-gold text-xs font-semibold rounded-lg hover:bg-charcoal transition-colors"
        >
          Use
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════ MAIN PAGE ═════════════════════════════ */
export default function AdminPagesCMS() {
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [isLoading,    setIsLoading]    = useState(true);
  const [isSaving,     setIsSaving]     = useState(false);

  // Hero
  const [heroTitle,      setHeroTitle]      = useState("");
  const [heroSubtitle,   setHeroSubtitle]   = useState("");
  const [heroButtonText, setHeroButtonText] = useState("");

  // Collections
  const [collections, setCollections] = useState<CollectionSlot[]>(DEFAULT_COLLECTIONS.map(c => ({ ...c })));

  // About/story
  const [aboutSubtitle,  setAboutSubtitle]  = useState("");
  const [aboutTitle,     setAboutTitle]     = useState("");
  const [aboutParagraph, setAboutParagraph] = useState("");

  // Announcement
  const [announcementText, setAnnouncementText] = useState("FREE SHIPPING ON ORDERS ABOVE ₹1499");

  // About Brand
  const [brandHeroTitle,     setBrandHeroTitle]     = useState("Our Story");
  const [brandHeroSubtitle,  setBrandHeroSubtitle]  = useState("Where high-end craftsmanship meets untamed beauty.");
  const [brandHeroImage,     setBrandHeroImage]     = useState("");
  const [brandMissionTitle,  setBrandMissionTitle]  = useState("A Brand Born From the Wild");
  const [brandMission1,      setBrandMission1]      = useState("");
  const [brandMission2,      setBrandMission2]      = useState("");
  const [brandMissionImage,  setBrandMissionImage]  = useState("");

  // About Founder
  const [founderName,        setFounderName]        = useState("Kanika");
  const [founderRole,        setFounderRole]        = useState("Founder & Creative Director, WWJ");
  const [founderImage,       setFounderImage]       = useState("");
  const [founderQuote,       setFounderQuote]       = useState("");
  const [founderBio1,        setFounderBio1]        = useState("");
  const [founderBio2,        setFounderBio2]        = useState("");
  const [founderInstagram,   setFounderInstagram]   = useState("@wildlifewonderjewellery");
  const [founderEmail,       setFounderEmail]       = useState("");
  const [founderM1Num,       setFounderM1Num]       = useState("5+");
  const [founderM1Label,     setFounderM1Label]     = useState("Years of Craft");
  const [founderM2Num,       setFounderM2Num]       = useState("200+");
  const [founderM2Label,     setFounderM2Label]     = useState("Unique Designs");
  const [founderM3Num,       setFounderM3Num]       = useState("10K+");
  const [founderM3Label,     setFounderM3Label]     = useState("Happy Customers");
  const [founderM4Num,       setFounderM4Num]       = useState("15+");
  const [founderM4Label,     setFounderM4Label]     = useState("Artisan Partners");

  /* ── load ── */
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [heroRes, aboutRes, colRes, annRes, brandRes, founderRes] = await Promise.all([
          getPageContent("home-hero"),
          getPageContent("home-about"),
          getPageContent("home-collections"),
          getPageContent("announcement-bar"),
          getPageContent("about-brand"),
          getPageContent("about-founder"),
        ]);

        if (heroRes) {
          const c = JSON.parse(heroRes);
          setHeroTitle(c.title ?? "");
          setHeroSubtitle(c.subtitle ?? "");
          setHeroButtonText(c.buttonText ?? "");
        }
        if (aboutRes) {
          const c = JSON.parse(aboutRes);
          setAboutSubtitle(c.subtitle ?? "");
          setAboutTitle(c.title ?? "");
          setAboutParagraph(c.paragraph ?? "");
        }
        if (colRes) {
          const arr = JSON.parse(colRes);
          if (Array.isArray(arr)) {
            setCollections(DEFAULT_COLLECTIONS.map((def, i) => ({
              title:       arr[i]?.title       ?? def.title,
              description: arr[i]?.description ?? def.description,
              image:       arr[i]?.image       ?? def.image,
            })));
          }
        }
        if (annRes) {
          const c = JSON.parse(annRes);
          setAnnouncementText(c.text ?? announcementText);
        }
        if (brandRes) {
          const c = JSON.parse(brandRes);
          setBrandHeroTitle(c.heroTitle ?? brandHeroTitle);
          setBrandHeroSubtitle(c.heroSubtitle ?? brandHeroSubtitle);
          setBrandHeroImage(c.heroImage ?? "");
          setBrandMissionTitle(c.missionTitle ?? brandMissionTitle);
          setBrandMission1(c.missionParagraph1 ?? "");
          setBrandMission2(c.missionParagraph2 ?? "");
          setBrandMissionImage(c.missionImage ?? "");
        }
        if (founderRes) {
          const c = JSON.parse(founderRes);
          setFounderName(c.founderName ?? founderName);
          setFounderRole(c.founderRole ?? founderRole);
          setFounderImage(c.founderImage ?? "");
          setFounderQuote(c.quote ?? "");
          setFounderBio1(c.bio1 ?? "");
          setFounderBio2(c.bio2 ?? "");
          setFounderInstagram(c.instagramHandle ?? founderInstagram);
          setFounderEmail(c.email ?? "");
          setFounderM1Num(c.milestone1Number ?? founderM1Num);
          setFounderM1Label(c.milestone1Label ?? founderM1Label);
          setFounderM2Num(c.milestone2Number ?? founderM2Num);
          setFounderM2Label(c.milestone2Label ?? founderM2Label);
          setFounderM3Num(c.milestone3Number ?? founderM3Num);
          setFounderM3Label(c.milestone3Label ?? founderM3Label);
          setFounderM4Num(c.milestone4Number ?? founderM4Num);
          setFounderM4Label(c.milestone4Label ?? founderM4Label);
        }
      } catch { /* ignore */ }
      setIsLoading(false);
    }
    void load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── save ── */
  const save = async () => {
    setIsSaving(true);
    try {
      let res: { success: boolean };
      if (activeSection === "hero") {
        res = await updatePageContent("home-hero", JSON.stringify({ title: heroTitle, subtitle: heroSubtitle, buttonText: heroButtonText }));
      } else if (activeSection === "collections") {
        res = await updatePageContent("home-collections", JSON.stringify(collections));
      } else if (activeSection === "about") {
        res = await updatePageContent("home-about", JSON.stringify({ subtitle: aboutSubtitle, title: aboutTitle, paragraph: aboutParagraph }));
      } else if (activeSection === "aboutBrand") {
        res = await updatePageContent("about-brand", JSON.stringify({
          heroTitle: brandHeroTitle, heroSubtitle: brandHeroSubtitle, heroImage: brandHeroImage,
          missionTitle: brandMissionTitle, missionParagraph1: brandMission1, missionParagraph2: brandMission2,
          missionImage: brandMissionImage,
        }));
      } else if (activeSection === "aboutFounder") {
        res = await updatePageContent("about-founder", JSON.stringify({
          founderName, founderRole, founderImage,
          quote: founderQuote, bio1: founderBio1, bio2: founderBio2,
          instagramHandle: founderInstagram, email: founderEmail,
          milestone1Number: founderM1Num, milestone1Label: founderM1Label,
          milestone2Number: founderM2Num, milestone2Label: founderM2Label,
          milestone3Number: founderM3Num, milestone3Label: founderM3Label,
          milestone4Number: founderM4Num, milestone4Label: founderM4Label,
        }));
      } else {
        res = await updatePageContent("announcement-bar", JSON.stringify({ text: announcementText }));
      }
      if (res.success) toast.success("Saved — changes are live!");
      else             toast.error("Failed to save changes.");
    } catch {
      toast.error("An error occurred.");
    }
    setIsSaving(false);
  };

  const updateCollection = (idx: number, field: keyof CollectionSlot, val: string) => {
    setCollections((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  };

  const SECTIONS: { id: Section; icon: React.ElementType; label: string; description: string }[] = [
    { id: "hero",         icon: Home,      label: "Hero Banner",          description: "Main title, subtitle & CTA button" },
    { id: "collections",  icon: Layout,    label: "Collection Thumbnails", description: "Images & text for 3 collection cards" },
    { id: "about",        icon: FileText,  label: "Story / About Section", description: "Wildlife story banner text" },
    { id: "announcement", icon: Megaphone, label: "Announcement Bar",      description: "Top-of-page strip message" },
    { id: "aboutBrand",   icon: FileText,  label: "About Brand Page",      description: "Hero, mission, images for /about/brand" },
    { id: "aboutFounder", icon: FileText,  label: "About Founder Page",    description: "Founder photo, bio, quote, milestones" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-jungle/50">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading content…</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-2xl text-jungle">Site Content</h2>
          <p className="text-sm text-jungle/60 mt-0.5">Edit page content, images and text displayed across the website.</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm px-4 py-2 border border-border rounded-lg text-jungle/60 hover:text-jungle hover:bg-cream transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview Site
          </a>
          <button
            onClick={save}
            disabled={isSaving}
            className="flex items-center gap-2 bg-jungle text-gold px-5 py-2 rounded-lg text-sm font-semibold hover:bg-charcoal transition-colors disabled:opacity-60"
          >
            {isSaving
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1 space-y-2">
          {SECTIONS.map((s) => (
            <SectionCard
              key={s.id}
              icon={s.icon}
              label={s.label}
              description={s.description}
              active={activeSection === s.id}
              onClick={() => setActiveSection(s.id)}
            />
          ))}

          {/* Live tip */}
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-700">Changes go live instantly after saving — no rebuild needed.</p>
            </div>
          </div>
        </div>

        {/* Editor panel */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-cream/20">
              {(() => {
                const s = SECTIONS.find((s) => s.id === activeSection)!;
                const Icon = s.icon;
                return (
                  <>
                    <div className="w-9 h-9 rounded-lg bg-jungle/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-jungle" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-jungle">{s.label}</h3>
                      <p className="text-xs text-jungle/50">{s.description}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="p-6 space-y-6">

              {/* ── HERO ── */}
              {activeSection === "hero" && (
                <>
                  <FormField label="Main Title" hint='You can use <br /> for line breaks'>
                    <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder='e.g. WEAR <br /> THE WILD' className={INPUT_CLS} />
                  </FormField>
                  <FormField label="Subtitle / Tagline">
                    <input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="e.g. Celebrate Nature. Inspire Change." className={INPUT_CLS} />
                  </FormField>
                  <FormField label="Primary Button Text">
                    <input value={heroButtonText} onChange={(e) => setHeroButtonText(e.target.value)} placeholder="e.g. Shop Collection" className={INPUT_CLS} />
                  </FormField>
                </>
              )}

              {/* ── COLLECTIONS ── */}
              {activeSection === "collections" && (
                <div className="space-y-8">
                  <p className="text-xs text-jungle/50 -mt-2">Update the image and copy for each of the three collection cards shown on the homepage.</p>
                  {collections.map((col, idx) => (
                    <div key={idx} className="rounded-xl border border-border overflow-hidden">
                      <div className="px-4 py-3 bg-cream/30 border-b border-border flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-jungle text-gold text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                        <span className="text-sm font-semibold text-jungle">Card {idx + 1}</span>
                        <span className="text-xs text-jungle/40 ml-1">— {DEFAULT_COLLECTIONS[idx].title}</span>
                      </div>
                      <div className="p-4 space-y-4">
                        <ImageUploader
                          label="Thumbnail Image"
                          value={col.image}
                          onChange={(url) => updateCollection(idx, "image", url)}
                        />
                        <FormField label="Card Title">
                          <input value={col.title} onChange={(e) => updateCollection(idx, "title", e.target.value)} placeholder={DEFAULT_COLLECTIONS[idx].title} className={INPUT_CLS} />
                        </FormField>
                        <FormField label="Card Description">
                          <input value={col.description} onChange={(e) => updateCollection(idx, "description", e.target.value)} placeholder={DEFAULT_COLLECTIONS[idx].description} className={INPUT_CLS} />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── ABOUT ── */}
              {activeSection === "about" && (
                <>
                  <FormField label="Eyebrow Label" hint="Small text above the main title">
                    <input value={aboutSubtitle} onChange={(e) => setAboutSubtitle(e.target.value)} placeholder="e.g. INSPIRED BY NATURE." className={INPUT_CLS} />
                  </FormField>
                  <FormField label="Main Title">
                    <input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder="e.g. Every Piece Tells A Wild Story." className={INPUT_CLS} />
                  </FormField>
                  <FormField label="Body Paragraph">
                    <textarea value={aboutParagraph} onChange={(e) => setAboutParagraph(e.target.value)} rows={5} placeholder="e.g. From the elegance of a butterfly…" className={TEXTAREA_CLS} />
                  </FormField>
                </>
              )}

              {/* ── ANNOUNCEMENT ── */}
              {activeSection === "announcement" && (
                <FormField label="Announcement Bar Text" hint="Shown in the top strip across all pages">
                  <input value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} placeholder="e.g. FREE SHIPPING ON ORDERS ABOVE ₹1499" className={INPUT_CLS} />
                  <p className="text-xs text-jungle/40 mt-1">Keep it short — ideally under 60 characters.</p>
                </FormField>
              )}

              {/* ── ABOUT BRAND ── */}
              {activeSection === "aboutBrand" && (
                <div className="space-y-6">
                  <p className="text-xs text-jungle/50 -mt-2">Edit content for the <strong>/about/brand</strong> page.</p>
                  <FormField label="Hero Title"><input value={brandHeroTitle} onChange={(e) => setBrandHeroTitle(e.target.value)} placeholder="Our Story" className={INPUT_CLS} /></FormField>
                  <FormField label="Hero Subtitle"><input value={brandHeroSubtitle} onChange={(e) => setBrandHeroSubtitle(e.target.value)} placeholder="Born from a passion for wildlife…" className={INPUT_CLS} /></FormField>
                  <ImageUploader label="Hero Background Image" value={brandHeroImage} onChange={setBrandHeroImage} />
                  <FormField label="Mission Section Title"><input value={brandMissionTitle} onChange={(e) => setBrandMissionTitle(e.target.value)} placeholder="A Brand Born From the Wild" className={INPUT_CLS} /></FormField>
                  <FormField label="Mission Paragraph 1"><textarea value={brandMission1} onChange={(e) => setBrandMission1(e.target.value)} rows={3} className={TEXTAREA_CLS} placeholder="WWJ was founded with…" /></FormField>
                  <FormField label="Mission Paragraph 2"><textarea value={brandMission2} onChange={(e) => setBrandMission2(e.target.value)} rows={3} className={TEXTAREA_CLS} placeholder="We believe jewellery should tell a story…" /></FormField>
                  <ImageUploader label="Mission Section Image (right side)" value={brandMissionImage} onChange={setBrandMissionImage} />
                </div>
              )}

              {/* ── ABOUT FOUNDER ── */}
              {activeSection === "aboutFounder" && (
                <div className="space-y-6">
                  <p className="text-xs text-jungle/50 -mt-2">Edit content for the <strong>/about/founder</strong> page.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Founder Name"><input value={founderName} onChange={(e) => setFounderName(e.target.value)} placeholder="Kanika" className={INPUT_CLS} /></FormField>
                    <FormField label="Founder Role"><input value={founderRole} onChange={(e) => setFounderRole(e.target.value)} placeholder="Founder & Creative Director" className={INPUT_CLS} /></FormField>
                  </div>
                  <ImageUploader label="Founder Photo" value={founderImage} onChange={setFounderImage} />
                  <FormField label="Pull Quote" hint="Shown in italic beside the photo"><textarea value={founderQuote} onChange={(e) => setFounderQuote(e.target.value)} rows={3} className={TEXTAREA_CLS} placeholder="I founded WWJ with a singular vision…" /></FormField>
                  <FormField label="Bio Paragraph 1"><textarea value={founderBio1} onChange={(e) => setFounderBio1(e.target.value)} rows={3} className={TEXTAREA_CLS} /></FormField>
                  <FormField label="Bio Paragraph 2"><textarea value={founderBio2} onChange={(e) => setFounderBio2(e.target.value)} rows={3} className={TEXTAREA_CLS} /></FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Instagram Handle"><input value={founderInstagram} onChange={(e) => setFounderInstagram(e.target.value)} placeholder="@wildlifewonderjewellery" className={INPUT_CLS} /></FormField>
                    <FormField label="Email Address"><input value={founderEmail} onChange={(e) => setFounderEmail(e.target.value)} placeholder="kanika@wwj.com" className={INPUT_CLS} /></FormField>
                  </div>
                  <p className="text-xs font-semibold text-jungle/50 uppercase tracking-wider">Milestone Stats</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { num: founderM1Num, setNum: setFounderM1Num, label: founderM1Label, setLabel: setFounderM1Label },
                      { num: founderM2Num, setNum: setFounderM2Num, label: founderM2Label, setLabel: setFounderM2Label },
                      { num: founderM3Num, setNum: setFounderM3Num, label: founderM3Label, setLabel: setFounderM3Label },
                      { num: founderM4Num, setNum: setFounderM4Num, label: founderM4Label, setLabel: setFounderM4Label },
                    ].map((m, i) => (
                      <div key={i} className="p-3 border border-border rounded-lg space-y-2">
                        <input value={m.num} onChange={(e) => m.setNum(e.target.value)} placeholder="5+" className={INPUT_CLS} />
                        <input value={m.label} onChange={(e) => m.setLabel(e.target.value)} placeholder="Years of Craft" className={INPUT_CLS} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer save bar */}
            <div className="px-6 py-4 border-t border-border bg-cream/20 flex justify-end">
              <button
                onClick={save}
                disabled={isSaving}
                className="flex items-center gap-2 bg-jungle text-gold px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-charcoal transition-colors disabled:opacity-60"
              >
                {isSaving
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
                  : <><Save className="w-4 h-4" /> Save {SECTIONS.find((s) => s.id === activeSection)?.label}</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
