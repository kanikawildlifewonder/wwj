"use client";

import React, { useEffect, useRef, useState } from "react";
import { Save, Plus, Trash2, Tag, Image as ImageIcon, Upload, RefreshCw, X, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  getProductCategories,
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

      {/* Preview */}
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

      {/* Actions */}
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

      {/* Paste URL */}
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

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function AdminSettingsPage() {
  /* categories */
  const [categories,          setCategories]          = useState<string[]>([]);
  const [newCategory,         setNewCategory]          = useState("");
  const [isLoadingCategories, setIsLoadingCategories]  = useState(true);
  const [busyCategory,        setBusyCategory]         = useState<string | null>(null);

  /* logo & favicon */
  const [logoImageUrl,  setLogoImageUrl]  = useState("");
  const [logoText,      setLogoText]      = useState("WWJ");
  const [logoTagline,   setLogoTagline]   = useState("Wildlife Wonder Jewellery");
  const [faviconUrl,    setFaviconUrl]    = useState("");
  const [isSavingBrand, setIsSavingBrand] = useState(false);

  /* load */
  useEffect(() => {
    void getProductCategories().then((data) => {
      setCategories(data);
      setIsLoadingCategories(false);
    });

    void Promise.all([
      getPageContent("brand-logo"),
      getPageContent("brand-favicon"),
    ]).then(([logoRaw, favRaw]) => {
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
    });
  }, []);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    const data = await getProductCategories();
    setCategories(data);
    setIsLoadingCategories(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setBusyCategory("__add__");
    const res = await addProductCategory(newCategory);
    if (res.success) { toast.success(`Added "${newCategory.trim()}"`); setNewCategory(""); loadCategories(); }
    else              toast.error(res.error ?? "Failed to add category");
    setBusyCategory(null);
  };

  const handleRemoveCategory = async (name: string) => {
    if (!confirm(`Remove category "${name}"?`)) return;
    setBusyCategory(name);
    const res = await removeProductCategory(name);
    if (res.success) { toast.success(`Removed "${name}"`); loadCategories(); }
    else              toast.error(res.error ?? "Failed to remove category");
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
          {/* Logo image */}
          <MiniUploader
            label="Logo Image"
            hint="Upload a PNG/SVG logo (transparent background recommended, height ≈ 48px). Leave blank to use text logo."
            value={logoImageUrl}
            onChange={setLogoImageUrl}
          />

          {/* Favicon */}
          <MiniUploader
            label="Favicon"
            hint="Upload a square image (PNG/ICO, 32×32 or 64×64 px). Shown in browser tabs and bookmarks."
            value={faviconUrl}
            onChange={setFaviconUrl}
          />

          {/* Text fallback */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-jungle/80">Logo Text (fallback)</label>
            <p className="text-xs text-jungle/40">Shown when no logo image is uploaded.</p>
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              placeholder="WWJ"
              className="w-full border border-border px-3 py-2.5 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-sm text-jungle transition-all"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-jungle/80">Logo Tagline (fallback)</label>
            <p className="text-xs text-jungle/40">Small text shown below the logo text.</p>
            <input
              type="text"
              value={logoTagline}
              onChange={(e) => setLogoTagline(e.target.value)}
              placeholder="Wildlife Wonder Jewellery"
              className="w-full border border-border px-3 py-2.5 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-sm text-jungle transition-all"
            />
          </div>
        </div>

        {/* Live preview */}
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

      {/* ── Product Categories ── */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-8">
        <section>
          <h3 className="font-display text-lg text-jungle mb-1 border-b border-border pb-2 flex items-center gap-2">
            <Tag className="w-5 h-5 text-gold" />
            Product Categories
          </h3>
          <p className="text-sm text-jungle/60 mb-4">
            Add or remove categories used in the shop filters and product forms.
          </p>

          <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name..."
              className="flex-1 border border-border px-3 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-sm text-jungle transition-all"
            />
            <button
              type="submit"
              disabled={busyCategory === "__add__" || !newCategory.trim()}
              className="bg-jungle text-gold px-4 py-2 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {busyCategory === "__add__" ? "Adding..." : "Add"}
            </button>
          </form>

          {isLoadingCategories ? (
            <p className="text-sm text-jungle/50">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-jungle/50">No categories yet.</p>
          ) : (
            <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="flex items-center justify-between px-4 py-3 bg-cream/20 hover:bg-cream/40 transition-colors"
                >
                  <span className="text-sm font-medium text-jungle capitalize">{cat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    disabled={busyCategory === cat}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    title={`Remove ${cat}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* General info & shipping (display-only placeholders) */}
        <section>
          <h3 className="font-display text-lg text-jungle mb-4 border-b border-border pb-2">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Store Name</label>
              <input type="text" defaultValue="WWJ Wildlife Jewellery" className="w-full border border-border px-3 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Contact Email</label>
              <input type="email" defaultValue="hello@wwj.com" className="w-full border border-border px-3 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-jungle/80 mb-1">Store Description</label>
              <textarea rows={3} defaultValue="Premium handcrafted wildlife-inspired jewellery for a cause." className="w-full border border-border px-3 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg text-jungle mb-4 border-b border-border pb-2">Shipping &amp; Currency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Primary Currency</label>
              <select className="w-full border border-border px-3 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-jungle/80 mb-1">Free Shipping Threshold</label>
              <input type="number" defaultValue="1499" className="w-full border border-border px-3 py-2 rounded-lg bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold text-jungle transition-all" />
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <button className="bg-jungle text-gold px-6 py-2 rounded-btn flex items-center gap-2 text-sm font-bold tracking-wide hover:bg-charcoal transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
