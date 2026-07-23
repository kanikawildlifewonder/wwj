"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Save, Plus, Trash2, Tag, Image as ImageIcon, Upload,
  RefreshCw, X, Zap, Diamond, Gem, Gift,
} from "lucide-react";
import { toast } from "sonner";
import {
  getGroupedProductCategories,
  addProductCategory,
  removeProductCategory,
} from "@/app/actions/categories";
import { getPageContent, updatePageContent } from "@/app/actions/content";
import { uploadImage } from "@/app/actions/upload";

/* ─── image uploader widget ─── */
function MiniUploader({
  label, hint, value, onChange,
}: { label: string; hint?: string; value: string; onChange: (url: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await uploadImage(fd);
    setUploading(false);
    if (res.success && res.url) { onChange(res.url); toast.success("Uploaded!"); }
    else toast.error(res.error ?? "Upload failed");
    if (ref.current) ref.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-jungle/80">{label}</label>
      {hint && <p className="text-xs text-jungle/40">{hint}</p>}

      <div className="relative w-full h-28 rounded-xl border border-dashed border-border bg-cream/30 flex items-center justify-center overflow-hidden">
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="max-h-full max-w-full object-contain p-2" />
            <button
              onClick={() => onChange("")}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="text-center text-jungle/25 space-y-1">
            <ImageIcon className="w-7 h-7 mx-auto" />
            <p className="text-xs">No image</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-gold/40 text-gold rounded-lg hover:bg-gold/5 transition-colors disabled:opacity-50"
        >
          {uploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="flex gap-1.5">
        <input
          type="text"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder="Or paste URL…"
          className="flex-1 text-xs px-2.5 py-2 border border-border rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (urlDraft.trim()) { onChange(urlDraft.trim()); setUrlDraft(""); } } }}
        />
        <button
          type="button"
          onClick={() => { if (urlDraft.trim()) { onChange(urlDraft.trim()); setUrlDraft(""); } }}
          className="px-2.5 py-2 bg-jungle text-gold text-xs font-semibold rounded-lg hover:bg-charcoal transition-colors"
        >
          Use
        </button>
      </div>
    </div>
  );
}

/* ─── single-collection category panel ─── */
interface CategoryPanelProps {
  title: string;
  icon: React.ReactNode;
  collectionKey: string;
  categories: string[];
  busyCategory: string | null;
  onAdd: (name: string, collectionKey: string) => Promise<void>;
  onRemove: (name: string, collectionKey: string) => Promise<void>;
}

function CategoryPanel({
  title, icon, collectionKey, categories, busyCategory, onAdd, onRemove,
}: CategoryPanelProps) {
  const [newCat, setNewCat] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    await onAdd(newCat, collectionKey);
    setNewCat("");
  };

  return (
    <div className="bg-cream/20 rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-gold">{icon}</span>
        <h4 className="font-display text-base text-jungle">{title}</h4>
        <span className="ml-auto text-xs font-mono text-jungle/30 bg-cream px-2 py-0.5 rounded">{collectionKey}</span>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category name..."
          className="flex-1 border border-border px-3 py-2 rounded-lg bg-white hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-sm text-jungle transition-all"
        />
        <button
          type="submit"
          disabled={busyCategory === `__add__${collectionKey}` || !newCat.trim()}
          className="bg-jungle text-gold px-3 py-2 rounded-btn flex items-center gap-1.5 text-xs font-bold tracking-wide hover:bg-charcoal transition-colors disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          {busyCategory === `__add__${collectionKey}` ? "Adding..." : "Add"}
        </button>
      </form>

      {categories.length === 0 ? (
        <p className="text-xs text-jungle/40 italic px-1">No categories yet.</p>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
          {categories.map((cat) => (
            <li
              key={cat}
              className="flex items-center justify-between px-4 py-2.5 bg-white hover:bg-cream/40 transition-colors"
            >
              <span className="text-sm font-medium text-jungle capitalize">{cat}</span>
              <button
                type="button"
                onClick={() => onRemove(cat, collectionKey)}
                disabled={busyCategory === `${collectionKey}:${cat}`}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                title={`Remove ${cat}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function AdminSettingsPage() {
  /* grouped categories */
  const [grouped, setGrouped] = useState<Record<string, string[]>>({ wwj: [], wwa: [], gift_cards: [] });
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [busyCategory, setBusyCategory] = useState<string | null>(null);

  /* logo & favicon */
  const [logoImageUrl,  setLogoImageUrl]  = useState("");
  const [logoText,      setLogoText]      = useState("WWJ");
  const [logoTagline,   setLogoTagline]   = useState("Wildlife Wonder Jewellery");
  const [faviconUrl,    setFaviconUrl]    = useState("");
  const [isSavingBrand, setIsSavingBrand] = useState(false);

  /* general & shipping settings */
  const [storeName,          setStoreName]          = useState("WWJ Wildlife Jewellery");
  const [contactEmail,       setContactEmail]       = useState("hello@wwj.com");
  const [storeDescription,   setStoreDescription]   = useState("Premium handcrafted wildlife-inspired jewellery for a cause.");
  const [currency,           setCurrency]           = useState("INR");
  const [shippingThreshold,  setShippingThreshold]  = useState("1499");
  const [shippingFee,        setShippingFee]        = useState("99");
  const [isSavingSettings,   setIsSavingSettings]   = useState(false);

  /* color theme */
  const [themeJungle, setThemeJungle] = useState("#071D16");
  const [themeForest, setThemeForest] = useState("#102C22");
  const [themeGold, setThemeGold] = useState("#D6B87A");
  const [themeIvory, setThemeIvory] = useState("#F7F1E5");
  const [themeCream, setThemeCream] = useState("#F6EBD5");
  const [isSavingTheme, setIsSavingTheme] = useState(false);

  /* load on mount */
  useEffect(() => {
    // categories
    void getGroupedProductCategories().then((data) => {
      setGrouped(data);
      setIsLoadingCategories(false);
    });

    // brand logo, favicon, theme
    void Promise.all([
      getPageContent("brand-logo"),
      getPageContent("brand-favicon"),
      getPageContent("site-theme"),
    ]).then(([logoRaw, favRaw, themeRaw]) => {
      if (logoRaw) {
        try {
          const p = JSON.parse(logoRaw);
          setLogoImageUrl(p.imageUrl ?? "");
          setLogoText(p.text ?? "WWJ");
          setLogoTagline(p.tagline ?? "Wildlife Wonder Jewellery");
        } catch { /* ignore */ }
      }
      if (favRaw) {
        try {
          const p = JSON.parse(favRaw);
          setFaviconUrl(p.url ?? "");
        } catch { /* ignore */ }
      }
      if (themeRaw) {
        try {
          const p = JSON.parse(themeRaw);
          if (p.jungle) setThemeJungle(p.jungle);
          if (p.forest) setThemeForest(p.forest);
          if (p.gold) setThemeGold(p.gold);
          if (p.ivory) setThemeIvory(p.ivory);
          if (p.cream) setThemeCream(p.cream);
        } catch { /* ignore */ }
      }
    });

    // store settings
    void getPageContent("store-settings").then((raw) => {
      if (raw) {
        try {
          const p = JSON.parse(raw);
          if (p.storeName)         setStoreName(p.storeName);
          if (p.contactEmail)      setContactEmail(p.contactEmail);
          if (p.storeDescription)  setStoreDescription(p.storeDescription);
          if (p.currency)          setCurrency(p.currency);
          if (p.shippingThreshold) setShippingThreshold(String(p.shippingThreshold));
          if (p.shippingFee !== undefined) setShippingFee(String(p.shippingFee));
        } catch { /* keep defaults */ }
      }
    });
  }, []);

  const reloadGrouped = async () => {
    setIsLoadingCategories(true);
    const data = await getGroupedProductCategories();
    setGrouped(data);
    setIsLoadingCategories(false);
  };

  const handleAddCategory = async (name: string, collectionKey: string) => {
    setBusyCategory(`__add__${collectionKey}`);
    const res = await addProductCategory(name, collectionKey);
    if (res.success) {
      toast.success(`Added "${name.trim()}" to ${collectionKey.toUpperCase()}`);
      await reloadGrouped();
    } else {
      toast.error(res.error ?? "Failed to add category");
    }
    setBusyCategory(null);
  };

  const handleRemoveCategory = async (name: string, collectionKey: string) => {
    if (!confirm(`Remove category "${name}" from ${collectionKey.toUpperCase()}?`)) return;
    setBusyCategory(`${collectionKey}:${name}`);
    const res = await removeProductCategory(name, collectionKey);
    if (res.success) {
      toast.success(`Removed "${name}"`);
      await reloadGrouped();
    } else {
      toast.error(res.error ?? "Failed to remove category");
    }
    setBusyCategory(null);
  };

  const handleSaveBrand = async () => {
    setIsSavingBrand(true);
    const [logoRes, favRes] = await Promise.all([
      updatePageContent("brand-logo",    JSON.stringify({ imageUrl: logoImageUrl, text: logoText, tagline: logoTagline })),
      updatePageContent("brand-favicon", JSON.stringify({ url: faviconUrl })),
    ]);
    setIsSavingBrand(false);
    if (logoRes.success && favRes.success) toast.success("Brand settings saved! Reload the site to see changes.");
    else toast.error("Failed to save brand settings.");
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    const res = await updatePageContent(
      "store-settings",
      JSON.stringify({
        storeName,
        contactEmail,
        storeDescription,
        currency,
        shippingThreshold: parseFloat(shippingThreshold) || 1499,
        shippingFee: parseFloat(shippingFee) || 0,
      })
    );
    setIsSavingSettings(false);
    if (res.success) toast.success("Store settings saved! Changes will be reflected on the site.");
    else toast.error("Failed to save store settings.");
  };

  const handleSaveTheme = async (
    j = themeJungle, f = themeForest, g = themeGold, i = themeIvory, c = themeCream
  ) => {
    setIsSavingTheme(true);
    const res = await updatePageContent(
      "site-theme",
      JSON.stringify({ jungle: j, forest: f, gold: g, ivory: i, cream: c })
    );
    setIsSavingTheme(false);
    if (res.success) toast.success("Color theme saved! Site colors updated live.");
    else toast.error("Failed to save color theme.");
  };

  const THEME_PRESETS = [
    { name: "Jungle Emerald (Default)", jungle: "#071D16", forest: "#102C22", gold: "#D6B87A", ivory: "#F7F1E5", cream: "#F6EBD5" },
    { name: "Royal Onyx & Gold",       jungle: "#0D0D0D", forest: "#1A1A1A", gold: "#E5C158", ivory: "#F9F9F9", cream: "#F0EAD6" },
    { name: "Midnight Sapphire",        jungle: "#090C15", forest: "#121829", gold: "#C0C0C0", ivory: "#FFFFFF", cream: "#EBF0F5" },
    { name: "Rose Gold Luxury",         jungle: "#1C0F13", forest: "#2A161C", gold: "#E0A96D", ivory: "#FBF2ED", cream: "#F7E8E1" },
    { name: "Warm Terracotta & Sand",   jungle: "#2C1A14", forest: "#3E261E", gold: "#D9A05B", ivory: "#FAF4EE", cream: "#F5EBE1" },
    { name: "Deep Ruby & Champagne",   jungle: "#240A10", forest: "#38111B", gold: "#F0C987", ivory: "#FCF8F0", cream: "#F6EEE0" },
  ];

  const INPUT_CLS = "w-full border border-border px-3 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl text-jungle">Settings</h2>
        <p className="text-sm text-jungle/60">Manage your store preferences and configuration.</p>
      </div>

      {/* ── Logo & Favicon ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Zap className="w-5 h-5 text-gold" />
          <h3 className="font-display text-lg text-jungle">Logo &amp; Favicon</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MiniUploader
            label="Logo Image"
            hint="Upload a PNG/SVG logo (transparent background recommended, height ≈ 48px). Leave blank to use text logo."
            value={logoImageUrl}
            onChange={setLogoImageUrl}
          />
          <MiniUploader
            label="Favicon"
            hint="Upload a square image (PNG/ICO, 32×32 or 64×64 px). Shown in browser tabs and bookmarks."
            value={faviconUrl}
            onChange={setFaviconUrl}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-jungle/80">Logo Text (fallback)</label>
            <p className="text-xs text-jungle/40">Shown when no logo image is uploaded.</p>
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="WWJ"
              className={INPUT_CLS}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-jungle/80">Logo Tagline (fallback)</label>
            <p className="text-xs text-jungle/40">Small text shown below the logo text.</p>
            <input
              type="text"
              value={logoTagline}
              onChange={(e) => setLogoTagline(e.target.value)}
              placeholder="Wildlife Wonder Jewellery"
              className={INPUT_CLS}
            />
          </div>
        </div>

        {(logoImageUrl || logoText) && (
          <div className="rounded-lg bg-jungle p-4 flex items-center gap-3">
            <p className="text-xs text-ivory/50 uppercase tracking-widest mr-2">Preview:</p>
            {logoImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoImageUrl} alt="logo preview" className="h-14 w-auto object-contain" />
            ) : (
              <div className="flex flex-col -space-y-1">
                <span className="font-display text-2xl font-bold text-ivory tracking-widest">{logoText}</span>
                <span className="font-sans text-[0.5rem] tracking-[0.2em] text-gold uppercase">{logoTagline}</span>
              </div>
            )}
            {faviconUrl && (
              <div className="ml-auto flex items-center gap-2">
                <p className="text-xs text-ivory/40">Favicon:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={faviconUrl} alt="favicon preview" className="w-8 h-8 rounded object-contain border border-ivory/10" />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSaveBrand}
            disabled={isSavingBrand}
            className="bg-jungle text-gold px-6 py-2.5 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            {isSavingBrand
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Save className="w-4 h-4" /> Save Brand Settings</>}
          </button>
        </div>
      </div>

      {/* ── Product Categories (separated by collection) ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Tag className="w-5 h-5 text-gold" />
          <h3 className="font-display text-lg text-jungle">Product Categories</h3>
          <p className="ml-2 text-sm text-jungle/50">Manage sub-categories per collection.</p>
        </div>

        {isLoadingCategories ? (
          <p className="text-sm text-jungle/50 py-4 text-center">Loading categories…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CategoryPanel
              title="WWJ Jewellery"
              icon={<Diamond className="w-4 h-4" />}
              collectionKey="wwj"
              categories={grouped.wwj ?? []}
              busyCategory={busyCategory}
              onAdd={handleAddCategory}
              onRemove={handleRemoveCategory}
            />
            <CategoryPanel
              title="WWA Accessories"
              icon={<Gem className="w-4 h-4" />}
              collectionKey="wwa"
              categories={grouped.wwa ?? []}
              busyCategory={busyCategory}
              onAdd={handleAddCategory}
              onRemove={handleRemoveCategory}
            />
            <CategoryPanel
              title="Gifting"
              icon={<Gift className="w-4 h-4" />}
              collectionKey="gift_cards"
              categories={grouped.gift_cards ?? []}
              busyCategory={busyCategory}
              onAdd={handleAddCategory}
              onRemove={handleRemoveCategory}
            />
          </div>
        )}
      </div>

      {/* ── General Information & Shipping ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-8">
        <section>
          <h3 className="font-display text-lg text-jungle mb-4 border-b border-border pb-2">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={INPUT_CLS}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-jungle/80 mb-1">Store Description</label>
              <textarea
                rows={3}
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                className={`${INPUT_CLS} resize-none`}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg text-jungle mb-4 border-b border-border pb-2">Shipping &amp; Currency</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Primary Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={INPUT_CLS}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={shippingThreshold}
                onChange={(e) => setShippingThreshold(e.target.value)}
                min="0"
                step="1"
                className={INPUT_CLS}
              />
              <p className="text-xs text-jungle/40 mt-1">Orders at or above this qualify for free shipping.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                min="0"
                step="1"
                className={INPUT_CLS}
              />
              <p className="text-xs text-jungle/40 mt-1">Charged when the order subtotal is below the threshold.</p>
            </div>
          </div>
        </section>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSavingSettings}
            className="bg-jungle text-gold px-6 py-2.5 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            {isSavingSettings
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
              : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* ── Dynamic Website Color Theme Customizer ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Zap className="w-5 h-5 text-gold" />
          <h3 className="font-display text-lg text-jungle">Website Color Theme Customizer</h3>
          <p className="ml-2 text-sm text-jungle/50">Change the live color palette across the website.</p>
        </div>

        {/* Theme Presets */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-jungle/80">One-Click Luxury Theme Presets</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {THEME_PRESETS.map((p) => {
              const isSelected =
                themeJungle === p.jungle && themeGold === p.gold;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setThemeJungle(p.jungle);
                    setThemeForest(p.forest);
                    setThemeGold(p.gold);
                    setThemeIvory(p.ivory);
                    setThemeCream(p.cream);
                    void handleSaveTheme(p.jungle, p.forest, p.gold, p.ivory, p.cream);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? "border-gold ring-2 ring-gold/30 bg-cream/40"
                      : "border-border bg-white hover:border-gold/50"
                  }`}
                >
                  <p className="text-xs font-bold text-jungle mb-2">{p.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full border shadow-xs shrink-0" style={{ backgroundColor: p.jungle }} title="Main Background / Jungle" />
                    <span className="w-5 h-5 rounded-full border shadow-xs shrink-0" style={{ backgroundColor: p.forest }} title="Card Forest" />
                    <span className="w-5 h-5 rounded-full border shadow-xs shrink-0" style={{ backgroundColor: p.gold }} title="Accent Gold" />
                    <span className="w-5 h-5 rounded-full border shadow-xs shrink-0" style={{ backgroundColor: p.ivory }} title="Text Ivory" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Pickers */}
        <div className="pt-4 border-t border-border space-y-4">
          <label className="block text-sm font-medium text-jungle/80">Custom Brand Color Controls</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-jungle/60 uppercase">Main Dark / Jungle</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeJungle}
                  onChange={(e) => setThemeJungle(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-border p-0.5"
                />
                <input
                  type="text"
                  value={themeJungle}
                  onChange={(e) => setThemeJungle(e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 border border-border rounded font-mono text-jungle"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-jungle/60 uppercase">Card / Forest</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeForest}
                  onChange={(e) => setThemeForest(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-border p-0.5"
                />
                <input
                  type="text"
                  value={themeForest}
                  onChange={(e) => setThemeForest(e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 border border-border rounded font-mono text-jungle"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-jungle/60 uppercase">Accent / Gold</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeGold}
                  onChange={(e) => setThemeGold(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-border p-0.5"
                />
                <input
                  type="text"
                  value={themeGold}
                  onChange={(e) => setThemeGold(e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 border border-border rounded font-mono text-jungle"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-jungle/60 uppercase">Light Text / Ivory</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeIvory}
                  onChange={(e) => setThemeIvory(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-border p-0.5"
                />
                <input
                  type="text"
                  value={themeIvory}
                  onChange={(e) => setThemeIvory(e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 border border-border rounded font-mono text-jungle"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-jungle/60 uppercase">Light Card / Cream</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeCream}
                  onChange={(e) => setThemeCream(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-border p-0.5"
                />
                <input
                  type="text"
                  value={themeCream}
                  onChange={(e) => setThemeCream(e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 border border-border rounded font-mono text-jungle"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-5 rounded-xl border border-border space-y-3" style={{ backgroundColor: themeJungle, color: themeIvory }}>
          <p className="text-xs uppercase tracking-widest font-bold" style={{ color: themeGold }}>Live Theme Color Preview</p>
          <h4 className="font-display text-xl font-bold">WEAR THE WILD</h4>
          <p className="text-sm opacity-80">Sample card rendering using chosen colors.</p>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" className="px-4 py-2 text-xs font-bold uppercase rounded tracking-wider" style={{ backgroundColor: themeGold, color: themeJungle }}>
              Shop Collection
            </button>
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: themeForest, color: themeGold }}>
              Wildlife Conservation Badge
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => void handleSaveTheme()}
            disabled={isSavingTheme}
            className="bg-jungle text-gold px-6 py-2.5 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors disabled:opacity-50"
          >
            {isSavingTheme
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving Color Theme…</>
              : <><Save className="w-4 h-4" /> Save Color Theme</>}
          </button>
        </div>
      </div>
    </div>
  );
}
