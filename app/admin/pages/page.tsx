"use client";

import React, { useState, useEffect, useRef } from "react";
import { updatePageContent, getPageContent } from "@/app/actions/content";
import { uploadImage, uploadPdf } from "@/app/actions/upload";
import { toast } from "sonner";
import {
  Save, FileText, Image as ImageIcon, Home, Megaphone,
  Layout, RefreshCw, CheckCircle, Upload, X, Eye, FileDown,
} from "lucide-react";

/* ─────────────────────── types ──────────────────────── */
type CollectionSlot = { title: string; description: string; image: string };
type Section = "hero" | "collections" | "about" | "announcement" | "aboutBrand" | "aboutFounder" | "welfare" | "policies" | "catalogPdf" | "footerSocials";

const DEFAULT_COLLECTIONS: CollectionSlot[] = [
  { title: "WWJ JEWELLERY",       description: "Handcrafted animal-inspired fashion pieces.", image: "/images/products/peacock_necklace.png" },
  { title: "WWA ACCESSORIES",     description: "Cute everyday wildlife collectibles.",         image: "/images/products/elephant_keychain.png" },
  { title: "GIFTING COLLECTION",  description: "Ready-to-gift pieces & curated sets for every occasion.", image: "/images/collections/gifting_box.webp" },
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
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-gold/20" : "bg-cream"}`}>
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

/* ─────────────────────── pdf uploader ─────────────────── */
function PdfUploader({ value, onChange, label, fileName, onFileNameChange }: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  fileName: string;
  onFileNameChange: (name: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadPdf(fd);
    setUploading(false);
    if (res.success && res.url) {
      onChange(res.url);
      onFileNameChange(file.name);
      toast.success("PDF uploaded successfully!");
    } else {
      toast.error(res.error ?? "Upload failed");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const applyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      const inferredName = urlInput.split("/").pop() || "Catalog PDF";
      onFileNameChange(inferredName);
      setUrlInput("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider">{label}</label>

      {/* Preview */}
      <div className="relative w-full p-4 rounded-xl border border-border bg-cream/30 flex flex-col justify-center min-h-25">
        {value ? (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs shrink-0">
              PDF
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-jungle truncate" title={fileName || value}>
                {fileName || "Lookbook / Catalog PDF"}
              </p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold hover:underline truncate block"
              >
                View PDF File
              </a>
            </div>
            <button
              onClick={() => {
                onChange("");
                onFileNameChange("");
              }}
              className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow shrink-0"
              title="Remove PDF"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-jungle/30 py-4">
            <div className="w-10 h-10 rounded bg-cream flex items-center justify-center">
              <FileDown className="w-5 h-5 text-jungle/40" />
            </div>
            <p className="text-xs">No PDF uploaded</p>
          </div>
        )}
      </div>

      {/* Upload button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-dashed border-gold/50 text-gold text-xs font-semibold rounded-lg hover:bg-gold/5 transition-colors disabled:opacity-50"
        >
          {uploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          {uploading ? "Uploading PDF…" : "Upload PDF (Max 20MB)"}
        </button>
        <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
      </div>

      {/* Or paste URL */}
      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste PDF URL..."
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
  const [aboutImageLeft,   setAboutImageLeft]   = useState("/images/wildlife/peacock.webp");
  const [aboutImageCenter, setAboutImageCenter] = useState("/images/wildlife/deer.webp");
  const [aboutImageRight,  setAboutImageRight]  = useState("/images/collections/accessories_banner.webp");

  // Announcement
  const [announcementText, setAnnouncementText] = useState("FREE SHIPPING ON ORDERS ABOVE ₹1499");
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [announcementLinkUrl, setAnnouncementLinkUrl] = useState("");
  const [announcementBadge1, setAnnouncementBadge1] = useState("HANDCRAFTED");
  const [announcementBadge2, setAnnouncementBadge2] = useState("ANIMAL INSPIRED");
  const [announcementBadge3, setAnnouncementBadge3] = useState("PREMIUM QUALITY");

  // Footer & Socials
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==");
  const [facebookUrl, setFacebookUrl] = useState("#");
  const [pinterestUrl, setPinterestUrl] = useState("#");
  const [youtubeUrl, setYoutubeUrl] = useState("#");
  const [brandDescription, setBrandDescription] = useState("WWJ - Wildlife Wonder Jewellery is more than just a brand. It's a movement to celebrate wildlife, creativity and craftsmanship.");
  const [disclaimer, setDisclaimer] = useState("Disclaimer: All jewelry products sold on this website are handcrafted fashion/imitation jewelry made of brass, alloy, and non-precious metals.");
  const [feeds, setFeeds] = useState<{ src: string; alt: string; href: string }[]>([
    { src: "/images/wildlife/tiger.webp", alt: "Tiger Wildlife", href: "https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" },
    { src: "/images/products/peacock_necklace.png", alt: "Peacock Necklace", href: "https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" },
    { src: "/images/wildlife/deer.webp", alt: "Deer Wildlife", href: "https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" },
    { src: "/images/products/butterfly_earrings.png", alt: "Butterfly Earrings", href: "https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" },
    { src: "/images/wildlife/peacock.webp", alt: "Peacock Wildlife", href: "https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" },
    { src: "/images/products/leopard_pendant.png", alt: "Leopard Pendant", href: "https://www.instagram.com/wildlife_wonder_jewellery_?igsh=MTN0c25tYjNyOGlocw==" }
  ]);

  // Welfare Section
  const [welfareTitle, setWelfareTitle] = useState("Welfare & Conservation Initiatives");
  const [welfareSubtitle, setWelfareSubtitle] = useState("Giving back to nature with every purchase.");
  const [welfare1Title, setWelfare1Title] = useState("Food for Paws");
  const [welfare1Desc, setWelfare1Desc] = useState("Providing nutritious meals and medical care for stray animals.");
  const [welfare1Stat, setWelfare1Stat] = useState("5000+ Meals Served");
  const [welfare1Img, setWelfare1Img] = useState("/images/welfare/food-for-paws.jpg");
  const [welfare2Title, setWelfare2Title] = useState("Homes for Cows");
  const [welfare2Desc, setWelfare2Desc] = useState("Supporting gaushalas and shelter sanctuaries for abandoned cattle.");
  const [welfare2Stat, setWelfare2Stat] = useState("12 Sanctuaries Supported");
  const [welfare2Img, setWelfare2Img] = useState("/images/welfare/homes-for-cows.jpg");
  const [welfare3Title, setWelfare3Title] = useState("Little Wings");
  const [welfare3Desc, setWelfare3Desc] = useState("Avian rescue, water bowl placement, and bird nest installation.");
  const [welfare3Stat, setWelfare3Stat] = useState("1200+ Nests Installed");
  const [welfare3Img, setWelfare3Img] = useState("/images/welfare/little-wings.jpg");

  // Policy Pages
  const [activePolicyTab, setActivePolicyTab] = useState<"privacy" | "terms" | "returns" | "shipping">("privacy");
  const [policyPrivacy, setPolicyPrivacy] = useState("");
  const [policyTerms, setPolicyTerms] = useState("");
  const [policyReturns, setPolicyReturns] = useState("");
  const [policyShipping, setPolicyShipping] = useState("");

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

  // Catalog PDF
  const [catalogPdfUrl,       setCatalogPdfUrl]       = useState("");
  const [catalogPdfName,      setCatalogPdfName]      = useState("");
  const [showCatalogDownload, setShowCatalogDownload] = useState(true);

  /* ── load ── */
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [
          heroRes, aboutRes, colRes, annRes, brandRes, founderRes, catalogRes, socialRes, welfareRes,
          pPrivacyRes, pTermsRes, pReturnsRes, pShippingRes
        ] = await Promise.all([
          getPageContent("home-hero"),
          getPageContent("home-about"),
          getPageContent("home-collections"),
          getPageContent("announcement-bar"),
          getPageContent("about-brand"),
          getPageContent("about-founder"),
          getPageContent("shop-catalog"),
          getPageContent("footer-socials"),
          getPageContent("home-welfare"),
          getPageContent("policy-privacy"),
          getPageContent("policy-terms"),
          getPageContent("policy-returns"),
          getPageContent("policy-shipping"),
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
          setAboutImageLeft(c.imageLeft ?? "/images/wildlife/peacock.webp");
          setAboutImageCenter(c.imageCenter ?? "/images/wildlife/deer.webp");
          setAboutImageRight(c.imageRight ?? "/images/collections/accessories_banner.webp");
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
          if (c.text !== undefined) setAnnouncementText(c.text);
          if (c.enabled !== undefined) setAnnouncementEnabled(Boolean(c.enabled));
          if (c.linkUrl !== undefined) setAnnouncementLinkUrl(c.linkUrl);
          if (c.badge1) setAnnouncementBadge1(c.badge1);
          if (c.badge2) setAnnouncementBadge2(c.badge2);
          if (c.badge3) setAnnouncementBadge3(c.badge3);
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
        if (catalogRes) {
          const c = JSON.parse(catalogRes);
          setCatalogPdfUrl(c.pdfUrl ?? "");
          setCatalogPdfName(c.pdfName ?? "");
          setShowCatalogDownload(c.showDownloadButton ?? true);
        }
        if (socialRes) {
          const c = JSON.parse(socialRes);
          if (c.instagramUrl) setInstagramUrl(c.instagramUrl);
          if (c.facebookUrl) setFacebookUrl(c.facebookUrl);
          if (c.pinterestUrl) setPinterestUrl(c.pinterestUrl);
          if (c.youtubeUrl) setYoutubeUrl(c.youtubeUrl);
          if (c.brandDescription) setBrandDescription(c.brandDescription);
          if (c.disclaimer) setDisclaimer(c.disclaimer);
          if (Array.isArray(c.feeds)) {
            setFeeds(prev => c.feeds.map((f: { src?: string; alt?: string; href?: string }, i: number) => ({
              src: f.src ?? (prev[i]?.src || ""),
              alt: f.alt ?? (prev[i]?.alt || ""),
              href: f.href ?? (prev[i]?.href || ""),
            })));
          }
        }
        if (welfareRes) {
          const c = JSON.parse(welfareRes);
          if (c.title) setWelfareTitle(c.title);
          if (c.subtitle) setWelfareSubtitle(c.subtitle);
          if (c.item1Title) setWelfare1Title(c.item1Title);
          if (c.item1Desc) setWelfare1Desc(c.item1Desc);
          if (c.item1Stat) setWelfare1Stat(c.item1Stat);
          if (c.item1Img) setWelfare1Img(c.item1Img);
          if (c.item2Title) setWelfare2Title(c.item2Title);
          if (c.item2Desc) setWelfare2Desc(c.item2Desc);
          if (c.item2Stat) setWelfare2Stat(c.item2Stat);
          if (c.item2Img) setWelfare2Img(c.item2Img);
          if (c.item3Title) setWelfare3Title(c.item3Title);
          if (c.item3Desc) setWelfare3Desc(c.item3Desc);
          if (c.item3Stat) setWelfare3Stat(c.item3Stat);
          if (c.item3Img) setWelfare3Img(c.item3Img);
        }
        if (pPrivacyRes) setPolicyPrivacy(pPrivacyRes);
        if (pTermsRes) setPolicyTerms(pTermsRes);
        if (pReturnsRes) setPolicyReturns(pReturnsRes);
        if (pShippingRes) setPolicyShipping(pShippingRes);
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
        res = await updatePageContent("home-about", JSON.stringify({
          subtitle: aboutSubtitle,
          title: aboutTitle,
          paragraph: aboutParagraph,
          imageLeft: aboutImageLeft,
          imageCenter: aboutImageCenter,
          imageRight: aboutImageRight,
        }));
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
      } else if (activeSection === "welfare") {
        res = await updatePageContent("home-welfare", JSON.stringify({
          title: welfareTitle, subtitle: welfareSubtitle,
          item1Title: welfare1Title, item1Desc: welfare1Desc, item1Stat: welfare1Stat, item1Img: welfare1Img,
          item2Title: welfare2Title, item2Desc: welfare2Desc, item2Stat: welfare2Stat, item2Img: welfare2Img,
          item3Title: welfare3Title, item3Desc: welfare3Desc, item3Stat: welfare3Stat, item3Img: welfare3Img,
        }));
      } else if (activeSection === "policies") {
        const key = `policy-${activePolicyTab}`;
        const val = activePolicyTab === "privacy" ? policyPrivacy : activePolicyTab === "terms" ? policyTerms : activePolicyTab === "returns" ? policyReturns : policyShipping;
        res = await updatePageContent(key, val);
      } else if (activeSection === "catalogPdf") {
        res = await updatePageContent("shop-catalog", JSON.stringify({
          pdfUrl: catalogPdfUrl,
          pdfName: catalogPdfName,
          showDownloadButton: showCatalogDownload,
        }));
      } else if (activeSection === "footerSocials") {
        res = await updatePageContent("footer-socials", JSON.stringify({
          instagramUrl, facebookUrl, pinterestUrl, youtubeUrl, brandDescription, disclaimer, feeds
        }));
      } else {
        res = await updatePageContent("announcement-bar", JSON.stringify({
          text: announcementText, enabled: announcementEnabled, linkUrl: announcementLinkUrl,
          badge1: announcementBadge1, badge2: announcementBadge2, badge3: announcementBadge3,
        }));
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
    { id: "hero",         icon: Home,      label: "Hero Banner",           description: "Main title, subtitle & CTA button" },
    { id: "collections",  icon: Layout,    label: "Collection Cards",     description: "Images & text for 3 collection cards" },
    { id: "about",        icon: FileText,  label: "Story / About Section", description: "Wildlife story banner text & images" },
    { id: "announcement", icon: Megaphone, label: "Announcement Bar",      description: "Top-of-page notice & badges" },
    { id: "welfare",      icon: Layout,    label: "Welfare & Initiatives",description: "Food for Paws, Gaushalas, Avian rescue" },
    { id: "aboutBrand",   icon: FileText,  label: "About Brand Page",      description: "Hero, mission, images for /about/brand" },
    { id: "aboutFounder", icon: FileText,  label: "About Founder Page",    description: "Founder photo, bio, quote, milestones" },
    { id: "policies",     icon: FileText,  label: "Policy Pages",          description: "Privacy, Terms, Returns & Shipping policies" },
    { id: "catalogPdf",   icon: FileDown,  label: "Catalog PDF / Lookbook", description: "Upload lookbook PDF for the shop page" },
    { id: "footerSocials", icon: Layout,    label: "Footer & Social Links", description: "Social links, copyright & Instagram feed" },
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
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
                        <span className="w-6 h-6 rounded-full bg-jungle text-gold text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border mt-4">
                    <ImageUploader label="Collage Left Image" value={aboutImageLeft} onChange={setAboutImageLeft} />
                    <ImageUploader label="Collage Center Image" value={aboutImageCenter} onChange={setAboutImageCenter} />
                    <ImageUploader label="Collage Right Image" value={aboutImageRight} onChange={setAboutImageRight} />
                  </div>
                </>
              )}

              {/* ── ANNOUNCEMENT ── */}
              {activeSection === "announcement" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-cream/30 border border-border rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-jungle">Enable Announcement Bar</p>
                      <p className="text-xs text-jungle/50">Toggle top notification banner visibility across the site</p>
                    </div>
                    <div
                      onClick={() => setAnnouncementEnabled(!announcementEnabled)}
                      className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 ${announcementEnabled ? "bg-gold" : "bg-jungle/20"}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${announcementEnabled ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                  </div>

                  <FormField label="Announcement Notice Text" hint="Shown on top left (desktop)">
                    <input value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} placeholder="e.g. FREE SHIPPING ON ORDERS ABOVE ₹1499" className={INPUT_CLS} />
                  </FormField>

                  <FormField label="Click Announcement Link (Optional)" hint="URL to open when clicked">
                    <input value={announcementLinkUrl} onChange={(e) => setAnnouncementLinkUrl(e.target.value)} placeholder="e.g. /shop or https://..." className={INPUT_CLS} />
                  </FormField>

                  <p className="text-xs font-semibold text-jungle/50 uppercase tracking-wider">Highlight Badges</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label="Badge 1">
                      <input value={announcementBadge1} onChange={(e) => setAnnouncementBadge1(e.target.value)} placeholder="HANDCRAFTED" className={INPUT_CLS} />
                    </FormField>
                    <FormField label="Badge 2">
                      <input value={announcementBadge2} onChange={(e) => setAnnouncementBadge2(e.target.value)} placeholder="ANIMAL INSPIRED" className={INPUT_CLS} />
                    </FormField>
                    <FormField label="Badge 3">
                      <input value={announcementBadge3} onChange={(e) => setAnnouncementBadge3(e.target.value)} placeholder="PREMIUM QUALITY" className={INPUT_CLS} />
                    </FormField>
                  </div>
                </div>
              )}

              {/* ── WELFARE & INITIATIVES ── */}
              {activeSection === "welfare" && (
                <div className="space-y-6">
                  <p className="text-xs text-jungle/50 -mt-2">Customize title, copy, and statistics for welfare initiatives on the <strong>/welfare</strong> page.</p>

                  <FormField label="Section Title">
                    <input value={welfareTitle} onChange={(e) => setWelfareTitle(e.target.value)} placeholder="Welfare & Conservation Initiatives" className={INPUT_CLS} />
                  </FormField>
                  <FormField label="Section Subtitle">
                    <input value={welfareSubtitle} onChange={(e) => setWelfareSubtitle(e.target.value)} placeholder="Giving back to nature with every purchase." className={INPUT_CLS} />
                  </FormField>

                  <div className="space-y-6 pt-4 border-t border-border">
                    {/* Initiative 1 */}
                    <div className="p-4 border border-border rounded-xl space-y-4 bg-cream/5">
                      <h4 className="font-semibold text-sm text-jungle">Initiative 1 — Food for Paws</h4>
                      <FormField label="Initiative Title">
                        <input value={welfare1Title} onChange={(e) => setWelfare1Title(e.target.value)} placeholder="Food for Paws" className={INPUT_CLS} />
                      </FormField>
                      <FormField label="Description">
                        <textarea value={welfare1Desc} onChange={(e) => setWelfare1Desc(e.target.value)} rows={2} className={TEXTAREA_CLS} />
                      </FormField>
                      <FormField label="Highlight Metric / Stat">
                        <input value={welfare1Stat} onChange={(e) => setWelfare1Stat(e.target.value)} placeholder="5000+ Meals Served" className={INPUT_CLS} />
                      </FormField>
                      <ImageUploader label="Banner Image" value={welfare1Img} onChange={setWelfare1Img} />
                    </div>

                    {/* Initiative 2 */}
                    <div className="p-4 border border-border rounded-xl space-y-4 bg-cream/5">
                      <h4 className="font-semibold text-sm text-jungle">Initiative 2 — Homes for Cows</h4>
                      <FormField label="Initiative Title">
                        <input value={welfare2Title} onChange={(e) => setWelfare2Title(e.target.value)} placeholder="Homes for Cows" className={INPUT_CLS} />
                      </FormField>
                      <FormField label="Description">
                        <textarea value={welfare2Desc} onChange={(e) => setWelfare2Desc(e.target.value)} rows={2} className={TEXTAREA_CLS} />
                      </FormField>
                      <FormField label="Highlight Metric / Stat">
                        <input value={welfare2Stat} onChange={(e) => setWelfare2Stat(e.target.value)} placeholder="12 Sanctuaries Supported" className={INPUT_CLS} />
                      </FormField>
                      <ImageUploader label="Banner Image" value={welfare2Img} onChange={setWelfare2Img} />
                    </div>

                    {/* Initiative 3 */}
                    <div className="p-4 border border-border rounded-xl space-y-4 bg-cream/5">
                      <h4 className="font-semibold text-sm text-jungle">Initiative 3 — Little Wings</h4>
                      <FormField label="Initiative Title">
                        <input value={welfare3Title} onChange={(e) => setWelfare3Title(e.target.value)} placeholder="Little Wings" className={INPUT_CLS} />
                      </FormField>
                      <FormField label="Description">
                        <textarea value={welfare3Desc} onChange={(e) => setWelfare3Desc(e.target.value)} rows={2} className={TEXTAREA_CLS} />
                      </FormField>
                      <FormField label="Highlight Metric / Stat">
                        <input value={welfare3Stat} onChange={(e) => setWelfare3Stat(e.target.value)} placeholder="1200+ Nests Installed" className={INPUT_CLS} />
                      </FormField>
                      <ImageUploader label="Banner Image" value={welfare3Img} onChange={setWelfare3Img} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── POLICIES ── */}
              {activeSection === "policies" && (
                <div className="space-y-6">
                  <p className="text-xs text-jungle/50 -mt-2">Edit content for store policies. Accessible live under <strong>/policies/privacy</strong>, <strong>/policies/terms</strong>, <strong>/policies/returns</strong>, and <strong>/policies/shipping</strong>.</p>

                  <div className="flex border-b border-border gap-2">
                    {(["privacy", "terms", "returns", "shipping"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActivePolicyTab(tab)}
                        className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                          activePolicyTab === tab ? "border-gold text-jungle font-bold" : "border-transparent text-jungle/50 hover:text-jungle"
                        }`}
                      >
                        {tab === "privacy" ? "Privacy Policy" : tab === "terms" ? "Terms of Service" : tab === "returns" ? "Return Policy" : "Shipping Policy"}
                      </button>
                    ))}
                  </div>

                  {activePolicyTab === "privacy" && (
                    <FormField label="Privacy Policy Document (Markdown/Text)">
                      <textarea value={policyPrivacy} onChange={(e) => setPolicyPrivacy(e.target.value)} rows={12} className={TEXTAREA_CLS} placeholder="Write privacy policy text..." />
                    </FormField>
                  )}
                  {activePolicyTab === "terms" && (
                    <FormField label="Terms of Service Document (Markdown/Text)">
                      <textarea value={policyTerms} onChange={(e) => setPolicyTerms(e.target.value)} rows={12} className={TEXTAREA_CLS} placeholder="Write terms of service text..." />
                    </FormField>
                  )}
                  {activePolicyTab === "returns" && (
                    <FormField label="Return & Refund Policy Document (Markdown/Text)">
                      <textarea value={policyReturns} onChange={(e) => setPolicyReturns(e.target.value)} rows={12} className={TEXTAREA_CLS} placeholder="Write return policy text..." />
                    </FormField>
                  )}
                  {activePolicyTab === "shipping" && (
                    <FormField label="Shipping & Delivery Policy Document (Markdown/Text)">
                      <textarea value={policyShipping} onChange={(e) => setPolicyShipping(e.target.value)} rows={12} className={TEXTAREA_CLS} placeholder="Write shipping policy text..." />
                    </FormField>
                  )}
                </div>
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

              {/* ── CATALOG PDF ── */}
              {activeSection === "catalogPdf" && (
                <div className="space-y-6">
                  <p className="text-xs text-jungle/50 -mt-2">
                    Upload a catalog or lookbook PDF file. A premium download button will appear on the shop page header.
                  </p>
                  <PdfUploader
                    label="Catalog / Lookbook PDF"
                    value={catalogPdfUrl}
                    onChange={setCatalogPdfUrl}
                    fileName={catalogPdfName}
                    onFileNameChange={setCatalogPdfName}
                  />
                  <div className="pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => setShowCatalogDownload(!showCatalogDownload)}
                        className={`w-9 h-5 rounded-full transition-colors shrink-0 ${showCatalogDownload ? "bg-gold" : "bg-jungle/20"}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white mt-0.5 mx-0.5 shadow transition-transform ${showCatalogDownload ? "translate-x-4" : "translate-x-0"}`} />
                      </div>
                      <span className="text-sm font-medium text-jungle">Show Download Button on Shop Page</span>
                    </label>
                  </div>
                </div>
              )}

              {/* ── FOOTER & SOCIALS ── */}
              {activeSection === "footerSocials" && (
                <div className="space-y-6">
                  <p className="text-xs text-jungle/50 -mt-2">
                    Manage footer brand bio, disclaimer, social media links, and the 6 Instagram feed thumbnails.
                  </p>
                  
                  <FormField label="Footer Brand Bio Snippet">
                    <textarea
                      value={brandDescription}
                      onChange={(e) => setBrandDescription(e.target.value)}
                      rows={3}
                      className={TEXTAREA_CLS}
                    />
                  </FormField>

                  <FormField label="Footer Disclaimer Text">
                    <textarea
                      value={disclaimer}
                      onChange={(e) => setDisclaimer(e.target.value)}
                      rows={3}
                      className={TEXTAREA_CLS}
                    />
                  </FormField>

                  <p className="text-xs font-semibold text-jungle/50 uppercase tracking-wider">Social Media Links</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Instagram URL">
                      <input
                        type="text"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className={INPUT_CLS}
                      />
                    </FormField>
                    <FormField label="Facebook URL">
                      <input
                        type="text"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className={INPUT_CLS}
                      />
                    </FormField>
                    <FormField label="Pinterest URL">
                      <input
                        type="text"
                        value={pinterestUrl}
                        onChange={(e) => setPinterestUrl(e.target.value)}
                        placeholder="https://pinterest.com/..."
                        className={INPUT_CLS}
                      />
                    </FormField>
                    <FormField label="YouTube URL">
                      <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/..."
                        className={INPUT_CLS}
                      />
                    </FormField>
                  </div>

                  <p className="text-xs font-semibold text-jungle/50 uppercase tracking-wider">Instagram Feed Items</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feeds.map((feed, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-xl space-y-4 bg-cream/5">
                        <div className="flex items-center gap-2 border-b border-border pb-2">
                          <span className="w-5 h-5 rounded-full bg-jungle text-gold text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                          <span className="text-xs font-bold text-jungle">Feed Image {idx + 1}</span>
                        </div>
                        <ImageUploader
                          label="Image Thumbnail"
                          value={feed.src}
                          onChange={(url) => setFeeds(prev => prev.map((f, i) => i === idx ? { ...f, src: url } : f))}
                        />
                        <FormField label="Image Alt Description">
                          <input
                            type="text"
                            value={feed.alt}
                            onChange={(e) => setFeeds(prev => prev.map((f, i) => i === idx ? { ...f, alt: e.target.value } : f))}
                            placeholder="e.g. Tiger Wildlife"
                            className={INPUT_CLS}
                          />
                        </FormField>
                        <FormField label="Instagram Post URL">
                          <input
                            type="text"
                            value={feed.href}
                            onChange={(e) => setFeeds(prev => prev.map((f, i) => i === idx ? { ...f, href: e.target.value } : f))}
                            placeholder="https://instagram.com/p/..."
                            className={INPUT_CLS}
                          />
                        </FormField>
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
