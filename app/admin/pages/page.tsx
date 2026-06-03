'use client';

import React, { useState, useEffect } from 'react';
import { updatePageContent, getPageContent } from '@/app/actions/content';
import { toast } from 'sonner';
import { Save, FileText } from 'lucide-react';

export default function AdminPagesCMS() {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroButtonText, setHeroButtonText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutParagraph, setAboutParagraph] = useState('');
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load existing content on mount
    async function loadContent() {
      try {
        const [heroRes, aboutRes] = await Promise.all([
          getPageContent('home-hero'),
          getPageContent('home-about')
        ]);

        if (heroRes) {
          const content = JSON.parse(heroRes);
          setHeroTitle(content.title || '');
          setHeroSubtitle(content.subtitle || '');
          setHeroButtonText(content.buttonText || '');
        }

        if (aboutRes) {
          const content = JSON.parse(aboutRes);
          setAboutSubtitle(content.subtitle || '');
          setAboutTitle(content.title || '');
          setAboutParagraph(content.paragraph || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const content = JSON.stringify({
        title: heroTitle,
        subtitle: heroSubtitle,
        buttonText: heroButtonText
      });
      const res = await updatePageContent('home-hero', content);
      
      if (res.success) {
        toast.success('Hero section updated successfully!');
      } else {
        toast.error('Failed to update hero section.');
      }
    } catch (err) {
      toast.error('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAbout(true);
    try {
      const content = JSON.stringify({
        subtitle: aboutSubtitle,
        title: aboutTitle,
        paragraph: aboutParagraph
      });
      const res = await updatePageContent('home-about', content);
      
      if (res.success) {
        toast.success('About section updated successfully!');
      } else {
        toast.error('Failed to update about section.');
      }
    } catch (err) {
      toast.error('An error occurred while saving.');
    } finally {
      setIsSavingAbout(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-jungle font-medium">Loading content data...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-display text-jungle">Site Content (CMS)</h2>
        <p className="text-muted mt-2">Manage the text and images displayed across the website.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Homepage Hero Settings */}
        <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center">
              <FileText className="w-5 h-5 text-jungle" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-jungle font-bold">Homepage Hero Banner</h3>
              <p className="text-sm text-muted">Update the main greeting on the homepage.</p>
            </div>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-jungle mb-2">Main Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. Elegance from the Wild"
                className="w-full px-4 py-3 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-jungle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-jungle mb-2">Subtitle</label>
              <textarea
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                rows={3}
                placeholder="e.g. Discover our exclusive collection of wildlife-inspired jewelry..."
                className="w-full px-4 py-3 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-jungle resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-jungle mb-2">Button Text</label>
              <input
                type="text"
                value={heroButtonText}
                onChange={(e) => setHeroButtonText(e.target.value)}
                placeholder="e.g. Shop the Collection"
                className="w-full px-4 py-3 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-jungle"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-jungle hover:bg-forest text-ivory py-3 rounded-xl font-medium transition-colors disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>

        {/* Homepage About Settings */}
        <section className="bg-white rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center">
              <FileText className="w-5 h-5 text-jungle" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-jungle font-bold">Homepage About Banner</h3>
              <p className="text-sm text-muted">Update the story section on the homepage.</p>
            </div>
          </div>

          <form onSubmit={handleSaveAbout} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-jungle mb-2">Eyebrow (Subtitle)</label>
              <input
                type="text"
                value={aboutSubtitle}
                onChange={(e) => setAboutSubtitle(e.target.value)}
                placeholder="e.g. INSPIRED BY NATURE."
                className="w-full px-4 py-3 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-jungle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-jungle mb-2">Main Title</label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                placeholder="e.g. Every Piece Tells A Wild Story."
                className="w-full px-4 py-3 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-jungle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-jungle mb-2">Paragraph</label>
              <textarea
                value={aboutParagraph}
                onChange={(e) => setAboutParagraph(e.target.value)}
                rows={4}
                placeholder="e.g. From the elegance of a butterfly..."
                className="w-full px-4 py-3 bg-cream/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold text-jungle resize-none"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSavingAbout}
                className="w-full flex items-center justify-center gap-2 bg-jungle hover:bg-forest text-ivory py-3 rounded-xl font-medium transition-colors disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {isSavingAbout ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
