"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Package, Heart, MapPin, Plus, Trash2, Edit2, X, Check, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getMyAddresses,
  saveMyAddresses,
  type SavedAddress,
} from "@/app/actions/account";
import { useUser } from "@clerk/nextjs";

export default function AddressesPage() {
  const { user, isLoaded } = useUser();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);

  const defaultForm = () => ({
    name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    phone: "",
    isDefault: false,
  });

  const [formData, setFormData] = useState<Omit<SavedAddress, "id">>(defaultForm());

  // Load addresses on mount
  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;

    const load = async () => {
      if (!user) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      const data = await getMyAddresses();
      if (!cancelled) {
        setAddresses(data);
        setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [isLoaded, user]);

  const persistAddresses = async (updated: SavedAddress[]) => {
    setIsSaving(true);
    try {
      await saveMyAddresses(updated);
    } catch {
      toast.error("Failed to save — please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({ ...defaultForm(), isDefault: addresses.length === 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (address: SavedAddress) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let updatedAddresses = [...addresses];

    if (editingAddress) {
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === editingAddress.id ? { ...addr, ...formData } : addr
      );
    } else {
      const newAddress: SavedAddress = {
        id: `addr-${Date.now()}`,
        ...formData,
      };
      updatedAddresses.push(newAddress);
    }

    // Handle default flag
    if (formData.isDefault) {
      const activeId = editingAddress
        ? editingAddress.id
        : updatedAddresses[updatedAddresses.length - 1].id;
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === activeId,
      }));
    } else if (editingAddress?.isDefault) {
      const other = updatedAddresses.find((a) => a.id !== editingAddress.id);
      if (other) other.isDefault = true;
    }

    setAddresses(updatedAddresses);
    setIsModalOpen(false);
    await persistAddresses(updatedAddresses);
    toast.success(editingAddress ? "Address updated!" : "Address saved!");
  };

  const handleDeleteAddress = async (id: string) => {
    const isDefaultToDelete = addresses.find((a) => a.id === id)?.isDefault;
    const updated = addresses.filter((a) => a.id !== id);
    if (isDefaultToDelete && updated.length > 0) updated[0].isDefault = true;
    setAddresses(updated);
    await persistAddresses(updated);
    toast.success("Address removed.");
  };

  const handleSetDefault = async (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    await persistAddresses(updated);
    toast.success("Default address updated.");
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Page Header */}
      <div className="bg-jungle py-8 sm:py-12 text-center border-b border-border">
        <h1 className="font-display text-3xl sm:text-4xl text-ivory">My Account</h1>
        <p className="font-sans text-sm text-ivory/60 mt-2">Manage your profile, orders &amp; wishlist</p>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar */}
          <div className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <Link href="/account" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <User className="w-4 h-4" /><span>Profile</span>
            </Link>
            <Link href="/account/orders" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <Package className="w-4 h-4" /><span>Orders</span>
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-2.5 px-4 py-3 hover:bg-jungle/5 rounded-lg transition-colors text-jungle/70 whitespace-nowrap text-sm font-medium flex-shrink-0">
              <Heart className="w-4 h-4" /><span>Wishlist</span>
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-2.5 px-4 py-3 bg-jungle text-gold rounded-lg whitespace-nowrap text-sm font-medium flex-shrink-0">
              <MapPin className="w-4 h-4" /><span>Addresses</span>
            </Link>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-white p-5 sm:p-8 rounded-xl border border-jungle/10 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-xl sm:text-2xl text-jungle">Saved Addresses</h2>
                <button
                  onClick={openAddModal}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 bg-jungle text-gold px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-charcoal transition-colors disabled:opacity-60"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {isLoading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  <p className="text-sm text-jungle/50">Loading your addresses…</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <MapPin className="w-12 h-12 text-jungle/20 mb-4" />
                  <p className="text-lg font-serif text-jungle">No addresses saved</p>
                  <p className="text-jungle/60 mb-6">Add a shipping address to speed up checkout.</p>
                  <button
                    onClick={openAddModal}
                    className="bg-jungle text-gold px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-btn hover:bg-charcoal transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`relative p-5 rounded-lg border transition-colors flex flex-col justify-between ${
                        address.isDefault
                          ? "border-gold bg-cream/20"
                          : "border-jungle/10 bg-white hover:border-gold/30"
                      }`}
                    >
                      <div>
                        {address.isDefault && (
                          <span className="absolute top-4 right-4 bg-gold/10 text-gold text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Default
                          </span>
                        )}
                        <p className="font-bold text-jungle mb-2">{address.name}</p>
                        <div className="space-y-1 text-sm text-jungle/70 font-sans">
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.zip}</p>
                          <p>{address.country}</p>
                          <p className="pt-2 text-xs text-jungle/50">Phone: {address.phone}</p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-jungle/5 flex justify-end gap-3 flex-wrap">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            disabled={isSaving}
                            className="text-xs text-jungle/50 hover:text-gold transition-colors font-medium disabled:opacity-50"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(address)}
                          className="flex items-center gap-1 text-xs text-jungle/60 hover:text-gold transition-colors font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        {!address.isDefault && (
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            disabled={isSaving}
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors font-medium disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-jungle/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-jungle/10 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="bg-jungle p-4 flex justify-between items-center text-ivory">
              <h3 className="font-display text-lg">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ivory/60 hover:text-ivory transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {[
                { label: "Full Name", name: "name", type: "text", placeholder: "Recipient name", required: true },
                { label: "Street Address", name: "street", type: "text", placeholder: "Apartment, suite, street address", required: true },
              ].map(({ label, name, type, placeholder, required }) => (
                <div key={name} className="space-y-1">
                  <label className="text-xs font-bold text-gold uppercase tracking-wider">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={(formData as Record<string, string | boolean>)[name] as string}
                    onChange={handleInputChange}
                    required={required}
                    placeholder={placeholder}
                    className="w-full bg-cream/40 border border-jungle/10 focus:border-gold outline-none px-3.5 py-2 rounded-lg text-sm text-jungle transition-all"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "City", name: "city", placeholder: "City" },
                  { label: "State", name: "state", placeholder: "State" },
                ].map(({ label, name, placeholder }) => (
                  <div key={name} className="space-y-1">
                    <label className="text-xs font-bold text-gold uppercase tracking-wider">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={(formData as Record<string, string | boolean>)[name] as string}
                      onChange={handleInputChange}
                      required
                      placeholder={placeholder}
                      className="w-full bg-cream/40 border border-jungle/10 focus:border-gold outline-none px-3.5 py-2 rounded-lg text-sm text-jungle transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gold uppercase tracking-wider">PIN Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    placeholder="PIN Code"
                    className="w-full bg-cream/40 border border-jungle/10 focus:border-gold outline-none px-3.5 py-2 rounded-lg text-sm text-jungle transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gold uppercase tracking-wider">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-cream/40 border border-jungle/10 focus:border-gold outline-none px-3.5 py-2 rounded-lg text-sm text-jungle transition-all"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gold uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Contact number"
                  className="w-full bg-cream/40 border border-jungle/10 focus:border-gold outline-none px-3.5 py-2 rounded-lg text-sm text-jungle transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-jungle rounded cursor-pointer"
                />
                <label htmlFor="isDefault" className="text-sm text-jungle/80 cursor-pointer select-none">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-jungle/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-jungle/10 hover:bg-cream/40 text-jungle/80 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-jungle text-gold hover:bg-charcoal rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
