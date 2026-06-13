"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, Image as ImageIcon, Save, Plus, Search, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { addEvent } from "@/app/actions/events";
import { getProducts } from "@/app/actions/products";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const uploadMediaClient = async (file: File) => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

  const { error } = await supabase
    .storage
    .from('product') // Use existing product bucket which is already open
    .upload(filename, file, { cacheControl: '31536000', upsert: false });

  if (error) {
    return { success: false, url: null, error: error.message };
  }

  const { data: publicUrlData } = supabase
    .storage
    .from('product')
    .getPublicUrl(filename);

  return { success: true, url: publicUrlData.publicUrl };
};

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

type ProductOption = Awaited<ReturnType<typeof getProducts>>[number];

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productSearch, setProductSearch] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Event",
    status: "DRAFT",
    shortDescription: "",
    fullDescription: "",
    eventDate: "",
    location: "",
    partnerName: "",
    partnerWebsite: "",
    videoUrl: "",
    seoTitle: "",
    seoDescription: "",
  });

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Media upload files
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>([null, null, null, null]);

  const [partnerLogoFile, setPartnerLogoFile] = useState<File | null>(null);
  const [partnerLogoPreview, setPartnerLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Load products to support related products selection
    getProducts().then(setProducts);
  }, []);

  const handleTitleChange = (val: string) => {
    setFormData(prev => {
      const next = { ...prev, title: val };
      if (!isSlugManuallyEdited) {
        next.slug = slugify(val);
      }
      return next;
    });
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFiles = [...galleryFiles];
      newFiles[index] = file;
      setGalleryFiles(newFiles);

      const newPreviews = [...galleryPreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setGalleryPreviews(newPreviews);
    }
  };

  const handlePartnerLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPartnerLogoFile(file);
      setPartnerLogoPreview(URL.createObjectURL(file));
    }
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.eventDate || !mainImageFile) {
      toast.error("Please fill in all required fields (Title, Slug, Event Date, and Main Image).");
      return;
    }

    setIsSubmitting(true);
    let mainImageUrl = "";
    const galleryUrls: string[] = [];
    let partnerLogoUrl: string | null = null;

    try {
      toast.loading("Uploading images to storage...", { id: "upload" });
      const uploadPromises = [];

      // Main image upload
      if (mainImageFile) {
        uploadPromises.push(
          uploadMediaClient(mainImageFile).then(res => ({ type: "main", index: 0, res }))
        );
      }

      // Gallery uploads
      galleryFiles.forEach((file, index) => {
        if (file) {
          uploadPromises.push(
            uploadMediaClient(file).then(res => ({ type: "gallery", index, res }))
          );
        }
      });

      // Partner logo upload
      if (partnerLogoFile) {
        uploadPromises.push(
          uploadMediaClient(partnerLogoFile).then(res => ({ type: "partner", index: 0, res }))
        );
      }

      if (uploadPromises.length > 0) {
        const results = await Promise.all(uploadPromises);
        for (const result of results) {
          if (!result.res.success || !result.res.url) {
            toast.error("Failed to upload media files to Supabase", { id: "upload" });
            setIsSubmitting(false);
            return;
          }
          if (result.type === "main") mainImageUrl = result.res.url;
          else if (result.type === "gallery") galleryUrls[result.index] = result.res.url;
          else if (result.type === "partner") partnerLogoUrl = result.res.url;
        }
        toast.success("All media uploaded successfully!", { id: "upload" });
      } else {
        toast.dismiss("upload");
      }

      // 2. Save Event via Server Action
      toast.loading("Saving event data...", { id: "save" });
      const res = await addEvent({
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        status: formData.status,
        featuredImage: mainImageUrl,
        galleryImages: galleryUrls.filter(Boolean),
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        eventDate: formData.eventDate,
        location: formData.location || null,
        partnerName: formData.partnerName || null,
        partnerLogo: partnerLogoUrl,
        partnerWebsite: formData.partnerWebsite || null,
        videoUrl: formData.videoUrl || null,
        relatedProducts: selectedProductIds,
        seoTitle: formData.seoTitle || null,
        seoDescription: formData.seoDescription || null,
      });

      if (res.success) {
        toast.success("Event created successfully!", { id: "save" });
        router.push("/admin/events");
      } else {
        toast.error(res.error || "Failed to save event", { id: "save" });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred during save.", { id: "save" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/events"
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-jungle hover:bg-cream transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-display text-2xl text-jungle">Add Event / Collaboration</h2>
          <p className="text-sm text-jungle/60">Create a brand story detail post, exhibition showcase, or partnership.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Event Title <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g., WWJ at Nature Fashion Week 2026"
                  value={formData.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Slug URL <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="wwj-at-nature-fashion-week-2026"
                    value={formData.slug}
                    onChange={e => {
                      setIsSlugManuallyEdited(true);
                      setFormData({ ...formData, slug: slugify(e.target.value) });
                    }}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                  />
                  <span className="text-[10px] text-jungle/40 mt-1 block">
                    URL mapping: /events/{formData.slug || "[slug]"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-jungle mb-1.5">Event Date <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.eventDate}
                    onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-jungle mb-1.5">Venue Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Pragati Maidan, New Delhi"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Short Summary / Snippet <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="A short 1-2 sentence description shown in preview cards..."
                  value={formData.shortDescription}
                  onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Full Description (Rich Text/HTML Support)</label>
                <textarea
                  required
                  placeholder="Write detailed event highlights, descriptions, and results..."
                  value={formData.fullDescription}
                  onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl resize-none text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all min-h-[200px]"
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Media & Galleries</h3>
            
            <div className="space-y-4">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-2">Featured Main Image <span className="text-red-500">*</span></label>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-xl cursor-pointer bg-cream/30 hover:bg-cream/50 transition-colors relative overflow-hidden">
                  {mainImagePreview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${mainImagePreview})` }} />
                      <div className="absolute inset-0 bg-jungle/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white font-medium flex items-center gap-2"><Upload className="w-5 h-5" /> Change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-jungle/50">
                      <ImageIcon className="w-8 h-8 mb-2 text-jungle/30" />
                      <p className="text-sm font-medium">Select Featured Image</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleMainImageChange} required />
                </label>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-2">Exhibition / Event Gallery (Up to 4 Images)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <label key={index} className="flex flex-col items-center justify-center aspect-square border-2 border-border border-dashed rounded-xl cursor-pointer bg-cream/30 hover:bg-cream/50 transition-colors relative overflow-hidden">
                      {galleryPreviews[index] ? (
                        <div className="absolute inset-0 w-full h-full">
                          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${galleryPreviews[index]})` }} />
                        </div>
                      ) : (
                        <Plus className="w-6 h-6 text-jungle/30" />
                      )}
                      <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleGalleryChange(index, e)} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Video URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ or dynamic MP4 url"
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                />
                <span className="text-[10px] text-jungle/40 mt-1 block">
                  YouTube, Vimeo embeds and direct video URLs are automatically mapped to inline media players.
                </span>
              </div>
            </div>
          </div>

          {/* Collaborator / Partner Info */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Collaboration details (Optional)</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-jungle mb-1.5">Partner / Collaborator Name</label>
                  <input
                    type="text"
                    placeholder="e.g., World Wildlife Fund (WWF)"
                    value={formData.partnerName}
                    onChange={e => setFormData({ ...formData, partnerName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-jungle mb-1.5">Partner Website</label>
                  <input
                    type="url"
                    placeholder="e.g., https://worldwildlife.org"
                    value={formData.partnerWebsite}
                    onChange={e => setFormData({ ...formData, partnerWebsite: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                  />
                </div>
              </div>

              {/* Partner Logo */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-2">Partner Logo</label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-border border-dashed rounded-xl cursor-pointer bg-cream/30 hover:bg-cream/50 transition-colors relative overflow-hidden">
                  {partnerLogoPreview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${partnerLogoPreview})` }} />
                      <div className="absolute inset-0 bg-jungle/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white font-medium flex items-center gap-2 text-xs"><Upload className="w-4 h-4" /> Change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-jungle/50">
                      <ImageIcon className="w-6 h-6 mb-1 text-jungle/30" />
                      <p className="text-xs font-medium">Select Logo File</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handlePartnerLogoChange} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Configuration Section */}
        <div className="space-y-6">
          {/* Metadata Organization */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Classification</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Module Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold transition-all cursor-pointer"
                >
                  <option value="Event">Event</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Press Feature">Press Feature</option>
                  <option value="Conservation Initiative">Conservation Initiative</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Publication Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold transition-all cursor-pointer"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
          </div>

          {/* Related Products Multiselector */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Related WWJ Products</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-jungle/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-2 border border-border rounded-xl p-3 bg-cream/10">
              {filteredProducts.length === 0 ? (
                <p className="text-xs text-jungle/40 text-center py-4">No products found</p>
              ) : (
                filteredProducts.map(p => {
                  const isChecked = selectedProductIds.includes(p.id);
                  return (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-white transition-colors ${
                        isChecked ? "border-gold bg-gold/5" : "border-transparent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleProductSelection(p.id)}
                        className="rounded border-border text-gold focus:ring-gold w-3.5 h-3.5"
                      />
                      <div
                        className="w-8 h-8 rounded bg-cream border border-border bg-cover bg-center"
                        style={{ backgroundImage: `url(${p.images[0] || "/images/products/placeholder.png"})` }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-jungle truncate">{p.name}</p>
                        <p className="text-[10px] text-jungle/40">{p.category}</p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
            <p className="text-[10px] text-jungle/40 italic flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" /> selected: {selectedProductIds.length} items
            </p>
          </div>

          {/* SEO Details */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">SEO Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">SEO Title (Optional)</label>
                <input
                  type="text"
                  placeholder="Defaults to event title..."
                  value={formData.seoTitle}
                  onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">SEO Description (Optional)</label>
                <textarea
                  placeholder="Defaults to short description summary..."
                  value={formData.seoDescription}
                  onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border rounded-xl resize-none text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-jungle text-gold py-3.5 rounded-xl font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Save className="w-5 h-5" /> Save Event</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
