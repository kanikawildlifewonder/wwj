"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, Image as ImageIcon, Save, CheckCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { addProduct } from "@/app/actions/products";
import { getGroupedProductCategories } from "@/app/actions/categories";
import { uploadImage } from "@/app/actions/upload";

const uploadMediaClient = async (file: File, folder = "products") => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);
  const res = await uploadImage(formData);
  return {
    success: res.success,
    url: res.url || null,
    error: res.error || null,
  };
};

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    mainCategory: "wwj",
    category: "Necklace",
    inStock: true,
    featured: false,
  });

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [groupedCategories, setGroupedCategories] = useState<Record<string, string[]>>({
    wwj: [],
    wwa: [],
    gift_cards: [],
  });

  // The options shown in the sub-category dropdown depend on the selected mainCategory
  const categoryOptions = groupedCategories[formData.mainCategory] ?? [];

  useEffect(() => {
    getGroupedProductCategories().then(setGroupedCategories);
  }, []);

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>([null, null, null, null]);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    let mainImageUrl = "/images/products/placeholder.png";
    const galleryUrls: string[] = [];
    let videoUrl: string | undefined = undefined;

    try {
      toast.loading("Uploading media...", { id: "upload" });
      
      const uploadPromises = [];

      if (mainImageFile) {
        uploadPromises.push(uploadMediaClient(mainImageFile, "products/thumbnails").then(res => ({ type: 'main', index: 0, res })));
      }

      galleryFiles.forEach((file, index) => {
        if (file) {
          uploadPromises.push(uploadMediaClient(file, "products/gallery").then(res => ({ type: 'gallery', index: index, res })));
        }
      });

      if (videoFile) {
        uploadPromises.push(uploadMediaClient(videoFile, "products/videos").then(res => ({ type: 'video', index: 0, res })));
      }

      if (uploadPromises.length > 0) {
        const results = await Promise.all(uploadPromises);
        
        for (const result of results) {
          if (!result.res.success || !result.res.url) {
            toast.error(result.res.error || "Failed to upload a media file", { id: "upload" });
            setIsSubmitting(false);
            return;
          }

          if (result.type === 'main') mainImageUrl = result.res.url;
          else if (result.type === 'gallery') galleryUrls[result.index] = result.res.url;
          else if (result.type === 'video') videoUrl = result.res.url;
        }
        toast.success("Media uploaded successfully!", { id: "upload" });
      } else {
        toast.dismiss("upload");
      }

      const allImages = [mainImageUrl, ...galleryUrls.filter(Boolean)];

      // 2. Save Product
      toast.loading("Saving product...", { id: "save" });
      const res = await addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        mainCategory: formData.mainCategory,
        category: isCustomCategory ? customCategory : formData.category,
        images: allImages,
        video: videoUrl,
        inStock: formData.inStock,
        featured: formData.featured,
      });

      if (res.success) {
        toast.success("Product created successfully!", { id: "save" });
        router.push("/admin/products");
      } else {
        toast.error(res.error || "Failed to save product", { id: "save" });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.", { id: "save" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-jungle hover:bg-cream transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="font-display text-2xl text-jungle">Add New Product</h2>
          <p className="text-sm text-jungle/60">Create a new product listing for your store.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Product Name <span className="text-red-500">*</span></label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g., Leopard Pendant Set"
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Description</label>
                <textarea 
                  required 
                  placeholder="Describe the product details..."
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-border rounded-xl resize-none text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Media</h3>
            
            <div className="space-y-4">
              {/* Main Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-2">Main Thumbnail <span className="text-red-500">*</span></label>
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
                      <p className="text-sm font-medium">Main Image</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleMainImageChange} required />
                </label>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-2">Gallery Images (Optional, up to 4)</label>
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

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-2">Product Video (Optional)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-xl cursor-pointer bg-cream/30 hover:bg-cream/50 transition-colors relative overflow-hidden">
                  {videoPreview ? (
                    <div className="absolute inset-0 w-full h-full bg-jungle/10 flex items-center justify-center">
                      <p className="font-medium text-jungle flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500"/> Video Selected</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-jungle/50">
                      <p className="text-sm font-medium">Upload Video (MP4, WebM)</p>
                      <p className="text-xs mt-1 max-w-[200px] text-center">Max 50MB</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="video/mp4, video/webm" onChange={handleVideoChange} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Organization & Pricing</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-jungle/50 font-medium">₹</span>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price} 
                    onChange={e => setFormData({ ...formData, price: e.target.value })} 
                    className="w-full pl-8 pr-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Main Category</label>
                <div className="relative">
                  <select 
                    value={formData.mainCategory} 
                    onChange={e => {
                      const newMain = e.target.value;
                      // Reset sub-category to first option in the new collection
                      const firstOpt = (groupedCategories[newMain] ?? [])[0] ?? "";
                      setIsCustomCategory(false);
                      setFormData({ ...formData, mainCategory: newMain, category: firstOpt });
                    }} 
                    className="w-full px-4 py-2.5 border border-border rounded-xl appearance-none bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all cursor-pointer"
                  >
                    <option value="wwj">WWJ (Wildlife Wonder Jewellery)</option>
                    <option value="wwa">WWA (Wildlife Wonder Accessories)</option>
                    <option value="gift_cards">Gifting Collection</option>
                  </select>
                  <ChevronLeft className="w-4 h-4 text-jungle/50 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Sub-Category</label>
                <div className="relative mb-3">
                  <select 
                    value={isCustomCategory ? "other" : formData.category} 
                    onChange={e => {
                      if (e.target.value === "other") {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }} 
                    className="w-full px-4 py-2.5 border border-border rounded-xl appearance-none bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all cursor-pointer"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="other">Other (Custom)</option>
                  </select>
                  <ChevronLeft className="w-4 h-4 text-jungle/50 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                </div>
                
                {isCustomCategory && (
                  <input 
                    required 
                    type="text" 
                    placeholder="Enter custom category name..."
                    value={customCategory} 
                    onChange={e => setCustomCategory(e.target.value)} 
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" 
                  />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-medium text-jungle border-b border-border pb-4">Status & Visibility</h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-border hover:bg-cream/50 transition-colors">
                <span className="text-sm font-medium text-jungle">In Stock</span>
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.inStock}
                  onChange={e => setFormData({ ...formData, inStock: e.target.checked })}
                />
                <div className="relative w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl border border-border hover:bg-cream/50 transition-colors">
                <div>
                  <span className="block text-sm font-medium text-jungle">Featured Item</span>
                  <span className="block text-xs text-jungle/50">Show as bestseller</span>
                </div>
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                />
                <div className="relative w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
              </label>
            </div>
          </div>

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
              <span className="flex items-center gap-2"><Save className="w-5 h-5" /> Save Product</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
