"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Filter, Edit, Trash2, Calendar, MapPin, Users,
  ChevronDown, X, ExternalLink, RefreshCw, AlertCircle
} from "lucide-react";
import { getEvents, deleteEvent } from "@/app/actions/events";
import { toast } from "sonner";

type AdminEvent = Awaited<ReturnType<typeof getEvents>>[number];

type StatusFilter = "all" | "PUBLISHED" | "DRAFT";

interface Filters {
  category: string;
  status: StatusFilter;
}

const DEFAULT_FILTERS: Filters = { category: "all", status: "all" };

const EVENT_CATEGORIES = [
  "Event",
  "Collaboration",
  "Exhibition",
  "Press Feature",
  "Conservation Initiative",
  "Other"
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] = useState<Filters>(DEFAULT_FILTERS);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    const data = await getEvents();
    setEvents(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      setIsLoading(true);
      const data = await getEvents();
      if (mounted) {
        setEvents(data);
        setIsLoading(false);
      }
    };
    fetchEvents();
    return () => { mounted = false; };
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return events.filter((e) => {
      // Search
      if (q && 
          !e.title.toLowerCase().includes(q) && 
          !e.category.toLowerCase().includes(q) && 
          !(e.partnerName || "").toLowerCase().includes(q) &&
          !(e.location || "").toLowerCase().includes(q)
      ) {
        return false;
      }
      // Category filter
      if (filters.category !== "all" && e.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
      // Status filter
      if (filters.status !== "all" && e.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [events, searchTerm, filters]);

  const activeFilterCount = [
    filters.category !== "all",
    filters.status !== "all"
  ].filter(Boolean).length;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event/collaboration?")) return;
    const res = await deleteEvent(id);
    if (res.success) {
      toast.success("Event deleted successfully");
      loadEvents();
    } else {
      toast.error("Failed to delete event");
    }
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setShowFilter(false);
  };

  const resetFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setShowFilter(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-jungle">Events & Collaborations</h2>
          <p className="text-sm text-jungle/60">
            Showcase WWJ brand events, exhibitions, media press features, and conservation projects.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 bg-jungle text-gold px-5 py-2.5 rounded-xl text-sm font-bold tracking-wider hover:bg-charcoal transition-all shadow hover:shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Event / Collab
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-jungle/40" />
            <input
              type="text"
              placeholder="Search title, category, partner, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl text-sm bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 focus:outline-none focus:border-gold transition-all text-jungle placeholder:text-jungle/30"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-jungle/40 hover:text-jungle"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
                activeFilterCount > 0
                  ? "border-gold bg-gold/10 text-gold-dark hover:bg-gold/15"
                  : "border-border text-jungle/70 bg-cream/40 hover:bg-cream/60 focus:bg-cream/80"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold text-jungle text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>

            {/* Filter Dropdown */}
            {showFilter && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-border shadow-xl p-5 z-30 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h4 className="font-semibold text-jungle text-sm">Filter Events</h4>
                  <button onClick={resetFilters} className="text-xs text-gold hover:underline font-medium">
                    Clear all
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={pendingFilters.category}
                      onChange={(e) => setPendingFilters({ ...pendingFilters, category: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="all">All Categories</option>
                      {EVENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-jungle/60 uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <select
                      value={pendingFilters.status}
                      onChange={(e) =>
                        setPendingFilters({ ...pendingFilters, status: e.target.value as StatusFilter })
                      }
                      className="w-full px-3 py-2 border border-border rounded-xl text-sm bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 text-jungle focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="all">All Statuses</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => setShowFilter(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-xl text-sm text-jungle/60 hover:bg-cream"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 bg-jungle text-gold rounded-xl text-sm font-medium hover:bg-charcoal"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset table */}
          <button
            onClick={loadEvents}
            className="flex items-center justify-center p-2.5 border border-border rounded-xl text-jungle/60 bg-cream/40 hover:bg-cream/60 focus:bg-cream/80 transition-all"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table Listing */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-jungle/50">Loading events and collaborations...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center px-4">
            <AlertCircle className="w-12 h-12 text-jungle/20 mx-auto mb-3" />
            <h3 className="font-serif text-lg text-jungle mb-1">No items found</h3>
            <p className="text-sm text-jungle/50 max-w-sm mx-auto mb-4">
              {events.length === 0
                ? "Start showcasing your brand events and collaborations by adding a new one."
                : "No items match your active filters or search parameters."}
            </p>
            {events.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-gold hover:underline font-bold tracking-wider uppercase"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-cream/30">
                  <th className="px-6 py-4 text-xs font-bold text-jungle/60 uppercase tracking-wider">Event Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-jungle/60 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-jungle/60 uppercase tracking-wider">Date & Venue</th>
                  <th className="px-6 py-4 text-xs font-bold text-jungle/60 uppercase tracking-wider">Partner</th>
                  <th className="px-6 py-4 text-xs font-bold text-jungle/60 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-jungle/60 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-cream/10 transition-colors">
                    {/* Event Detail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-lg bg-cream border border-border bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url(${event.featuredImage})` }}
                        />
                        <div className="max-w-xs md:max-w-sm">
                          <p className="font-semibold text-jungle hover:text-gold transition-colors line-clamp-1">
                            <Link href={`/admin/events/${event.id}/edit`}>{event.title}</Link>
                          </p>
                          <p className="text-xs text-jungle/50 line-clamp-1 mt-0.5">{event.shortDescription}</p>
                          <a
                            href={`/events/${event.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-gold hover:underline mt-1.5 font-bold tracking-wider"
                          >
                            VIEW LIVE <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cream border border-border text-jungle">
                        {event.category}
                      </span>
                    </td>

                    {/* Date / Location */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <p className="text-xs text-jungle font-medium flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold/70" />
                          {new Date(event.eventDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                        {event.location && (
                          <p className="text-xs text-jungle/50 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-jungle/30" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Partner Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.partnerName ? (
                        <div className="space-y-1">
                          <p className="text-xs text-jungle font-medium flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gold/70" />
                            {event.partnerName}
                          </p>
                          {event.partnerWebsite && (
                            <a
                              href={event.partnerWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-jungle/40 hover:underline hover:text-gold block"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-jungle/30 italic">None</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          event.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {event.status === "PUBLISHED" ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="p-1.5 border border-border rounded-lg text-jungle/70 hover:bg-cream hover:text-jungle transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1.5 border border-red-100 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
