"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, Search, Users, ArrowRight } from "lucide-react";

type EventRecord = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  featuredImage: string;
  shortDescription: string;
  eventDate: string; // serialized Date
  location: string | null;
  partnerName: string | null;
};

const CATEGORIES = [
  { label: "All Stories", value: "all" },
  { label: "Events", value: "Event" },
  { label: "Collaborations", value: "Collaboration" },
  { label: "Exhibitions", value: "Exhibition" },
  { label: "Press Features", value: "Press Feature" },
  { label: "Conservation", value: "Conservation Initiative" }
];

export default function EventsListingClient({ initialEvents }: { initialEvents: EventRecord[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchesCategory =
        activeCategory === "all" ||
        event.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.partnerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.location || "").toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialEvents, activeCategory, searchQuery]);

  return (
    <div className="bg-ivory min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-jungle text-ivory py-20 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 bg-radial-gradient from-forest/20 to-transparent opacity-60" />
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs tracking-widest uppercase font-bold">
            <Users className="w-3.5 h-3.5" /> WWJ Journeys
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-ivory">
            Events & Collaborations
          </h1>
          <p className="text-sm md:text-base text-ivory/70 max-w-xl mx-auto leading-relaxed">
            Discover our active involvement in nature exhibitions, design collaborations, press features, and wildlife conservation initiatives around the world.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 mt-12 space-y-8">
        {/* Search & Category filter toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 pb-6 border-b border-jungle/10">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap border ${
                    isActive
                      ? "bg-jungle text-gold border-jungle"
                      : "bg-white text-jungle/70 border-jungle/10 hover:border-gold/50"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-jungle/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events, partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-jungle/10 rounded-xl text-xs bg-white text-jungle focus:outline-none focus:border-gold placeholder:text-jungle/30 transition-colors"
            />
          </div>
        </div>

        {/* Results grid */}
        {filteredEvents.length === 0 ? (
          <div className="py-24 text-center border border-jungle/5 bg-cream/30 rounded-2xl max-w-lg mx-auto">
            <Users className="w-12 h-12 text-jungle/20 mx-auto mb-4" />
            <h3 className="font-serif text-lg text-jungle mb-1">No stories found</h3>
            <p className="text-sm text-jungle/50">
              No events match your current category selection or search parameters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl border border-jungle/10 hover:border-gold/40 hover:shadow-xl transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Image header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-cream flex-shrink-0">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${event.featuredImage})` }}
                  />
                  <div className="absolute top-4 left-4 z-10 bg-jungle/90 text-gold px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded">
                    {event.category}
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-jungle/50 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold/70" />
                        {new Date(event.eventDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold/70" />
                          {event.location}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg md:text-xl text-jungle leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-sm text-jungle/70 leading-relaxed line-clamp-3">
                      {event.shortDescription}
                    </p>

                    {event.partnerName && (
                      <div className="flex items-center gap-1.5 pt-2.5 border-t border-jungle/5 text-xs text-jungle/60">
                        <Users className="w-3.5 h-3.5 text-gold/70" />
                        <span>Partner: <span className="font-semibold text-jungle">{event.partnerName}</span></span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6">
                    <Link
                      href={`/events/${event.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gold hover:text-jungle transition-colors uppercase"
                    >
                      Explore Event <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
