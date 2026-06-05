"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, Image as ImageIcon, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { addProduct } from "@/app/actions/products";
import { uploadImage } from "@/app/actions/upload";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "necklaces",
    inStock: true,
    featured: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    let imageUrl = "/images/products/placeholder.png";

    try {
      // 1. Upload Image if provided
      if (imageFile) {
        toast.loading("Uploading image...", { id: "upload" });
        const uploadFormData = new FormData();
        uploadFormData.append("image", imageFile);
        
        const uploadRes = await uploadImage(uploadFormData);
        if (uploadRes.success && uploadRes.url) {
          imageUrl = uploadRes.url;
          toast.success("Image uploaded successfully!", { id: "upload" });
        } else {
          toast.error(uploadRes.error || "Failed to upload image", { id: "upload" });
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Save Product
      toast.loading("Saving product...", { id: "save" });
      const res = await addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: [imageUrl],
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
              <label className="block text-sm font-medium text-jungle">Product Image</label>
              
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-xl cursor-pointer bg-cream/30 hover:bg-cream/50 transition-colors relative overflow-hidden">
                  {imagePreview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${imagePreview})` }} />
                      <div className="absolute inset-0 bg-jungle/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white font-medium flex items-center gap-2">
                          <Upload className="w-5 h-5" /> Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-jungle/50">
                      <ImageIcon className="w-10 h-10 mb-3 text-jungle/30" />
                      <p className="mb-2 text-sm"><span className="font-semibold text-jungle">Click to upload</span> or drag and drop</p>
                      <p className="text-xs">PNG, JPG or WEBP (MAX. 5MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                  />
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
                    className="w-full pl-8 pr-4 py-2.5 border border-border rounded-xl text-jungle bg-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-jungle mb-1.5">Category</label>
                <div className="relative">
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full px-4 py-2.5 border border-border rounded-xl appearance-none bg-white text-jungle focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  >
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="rings">Rings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="accessories">Accessories</option>
                    <option value="gifting">Gifting</option>
                  </select>
                  <ChevronLeft className="w-4 h-4 text-jungle/50 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                </div>
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
