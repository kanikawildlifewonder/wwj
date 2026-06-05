"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, Image as ImageIcon, Save, CheckCircle, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateProduct } from "@/app/actions/products";
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
    .from('product')
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) {
    return { success: false, url: null, error: error.message };
  }

  const { data: publicUrlData } = supabase
    .storage
    .from('product')
    .getPublicUrl(filename);

  return { success: true, url: publicUrlData.publicUrl };
};

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up predefined categories list
  const PREDEFINED_CATEGORIES = ["necklaces", "earrings", "rings", "bracelets", "accessories", "gifting"];
  const isCustomCategoryVal = !PREDEFINED_CATEGORIES.includes(product.category.toLowerCase());

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    mainCategory: product.mainCategory || "wwj",
    category: isCustomCategoryVal ? "other" : product.category.toLowerCase(),
    inStock: product.inStock,
    featured: product.featured,
  });

  const [isCustomCategory, setIsCustomCategory] = useState(isCustomCategoryVal);
  const [customCategory, setCustomCategory] = useState(isCustomCategoryVal ? product.category : "");

  // Media files states
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(product.images[0] || null);

  // Gallery files states
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [galleryPreviews, setGalleryPreviews] = useState<(string | null)[]>([
    product.images[1] || null,
    product.images[2] || null,
    product.images[3] || null,
    product.images[4] || null,
  ]);

  // Video states
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(product.video || null);

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

  const removeGalleryImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    const newFiles = [...galleryFiles];
    newFiles[index] = null;
    setGalleryFiles(newFiles);

    const newPreviews = [...galleryPreviews];
    newPreviews[index] = null;
    setGalleryPreviews(newPreviews);
  };

  const removeVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    let mainImageUrl = product.images[0] || "/images/products/placeholder.png";
    const finalGalleryUrls = [...galleryPreviews];
    let videoUrl = product.video || undefined;

    try {
      toast.loading("Uploading new media...", { id: "upload" });
      
      const uploadPromises = [];

      // Main image upload if changed
      if (mainImageFile) {
        uploadPromises.push(uploadMediaClient(mainImageFile).then(res => ({ type: 'main', index: 0, res })));
      }

      // Gallery uploads if changed
      galleryFiles.forEach((file, index) => {
        if (file) {
          uploadPromises.push(uploadMediaClient(file).then(res => ({ type: 'gallery', index: index, res })));
        }
      });

      // Video upload if changed
      if (videoFile) {
        uploadPromises.push(uploadMediaClient(videoFile).then(res => ({ type: 'video', index: 0, res })));
      }

      if (uploadPromises.length > 0) {
        const results = await Promise.all(uploadPromises);
        
        for (const result of results) {
          if (!result.res.success || !result.res.url) {
            toast.error("Failed to upload a media file", { id: "upload" });
            setIsSubmitting(false);
            return;
          }

          if (result.type === 'main') {
            mainImageUrl = result.res.url;
          } else if (result.type === 'gallery') {
            finalGalleryUrls[result.index] = result.res.url;
          } else if (result.type === 'video') {
            videoUrl = result.res.url;
          }
        }
        toast.success("Media uploaded successfully!", { id: "upload" });
      } else {
        toast.dismiss("upload");
      }

      // If videoPreview was cleared/removed, set videoUrl to null
      if (!videoPreview) {
        videoUrl = null;
      }

      // Compile final images array (filter out empty/deleted gallery slots)
      const allImages = [mainImageUrl, ...finalGalleryUrls.filter(Boolean)];

      // 2. Update Product
      toast.loading("Updating product...", { id: "save" });
      const res = await updateProduct(product.id, {
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
        toast.success("Product updated successfully!", { id: "save" });
        router.push("/admin/products");
      } else {
        toast.error(res.error || "Failed to update product", { id: "save" });
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
          <h2 className="font-display text-2xl text-jungle">Edit Product</h2>
          <p className="text-sm text-jungle/60">Update details and media for this product listing.</p>
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
                  className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Description</label>
                <textarea 
                  required 
                  placeholder="Describe the product details..."
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-border rounded-xl resize-none text-jungle bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all min-h-[120px]"
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
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleMainImageChange} />
                </label>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-2">Gallery Images (Optional, up to 4)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="relative aspect-square">
                      {galleryPreviews[index] ? (
                        <div className="group absolute inset-0 w-full h-full rounded-xl overflow-hidden border border-border">
                          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${galleryPreviews[index]})` }} />
                          <button
                            onClick={(e) => removeGalleryImage(index, e)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-border border-dashed rounded-xl cursor-pointer bg-cream/30 hover:bg-cream/50 transition-colors">
                          <Plus className="w-6 h-6 text-jungle/30" />
                          <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleGalleryChange(index, e)} />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-jungle mb-2">Product Video (Optional)</label>
                {videoPreview ? (
                  <div className="relative flex items-center justify-center w-full h-32 border border-border rounded-xl bg-cream/30 group">
                    <p className="font-medium text-jungle flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500"/> Video Selected
                    </p>
                    <button
                      onClick={removeVideo}
                      className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-xl cursor-pointer bg-cream/30 hover:bg-cream/50 transition-colors relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center text-jungle/50">
                      <p className="text-sm font-medium">Upload Video (MP4, WebM)</p>
                      <p className="text-xs mt-1 max-w-[200px] text-center">Max 100MB</p>
                    </div>
                    <input type="file" className="hidden" accept="video/mp4, video/webm" onChange={handleVideoChange} />
                  </label>
                )}
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
                    className="w-full pl-8 pr-4 py-2.5 border border-border rounded-xl text-jungle bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Main Category</label>
                <div className="relative">
                  <select 
                    value={formData.mainCategory} 
                    onChange={e => setFormData({ ...formData, mainCategory: e.target.value })} 
                    className="w-full px-4 py-2.5 border border-border rounded-xl appearance-none bg-white text-jungle focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  >
                    <option value="wwj">WWJ (Wildlife Wonder Jewellery)</option>
                    <option value="wwa">WWA (Wildlife Wonder Art)</option>
                    <option value="gift_cards">Gift Cards</option>
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
                    className="w-full px-4 py-2.5 border border-border rounded-xl appearance-none bg-white text-jungle focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  >
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="rings">Rings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="accessories">Accessories</option>
                    <option value="gifting">Gifting</option>
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
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-jungle bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" 
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
              <span className="flex items-center gap-2"><Save className="w-5 h-5" /> Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
