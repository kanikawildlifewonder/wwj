import React from "react";
import Link from "next/link";
import { Calendar, MapPin, ChevronRight, Users } from "lucide-react";
import { getPublishedEvents } from "@/app/actions/events";

export async function EventsSection() {
  const allEvents = await getPublishedEvents();
  const latestEvents = allEvents.slice(0, 3);

  if (latestEvents.length === 0) return null; // Hide if no events are published

  return (
    <section className="bg-cream py-20 border-b border-jungle/10 text-jungle relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-gold" />
              <span className="text-gold text-xs tracking-[0.2em] uppercase font-bold">
                Highlights & Projects
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-jungle leading-tight">
              Events & Collaborations
            </h2>
            <p className="text-sm text-jungle/60 mt-2 max-w-lg">
              Explore our conservation partnerships, exhibitions, and brand appearances working with global change-makers.
            </p>
          </div>
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gold hover:text-jungle transition-colors"
          >
            See All Events 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestEvents.map((event) => (
            <div
              key={event.id}
              className="group bg-white rounded-2xl border border-jungle/10 hover:border-gold/50 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col h-full overflow-hidden"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-cream flex-shrink-0">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${event.featuredImage || "/images/products/placeholder.png"})`,
                  }}
                />
                <div className="absolute top-4 left-4 z-10 bg-jungle/90 text-gold px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded">
                  {event.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-jungle/50">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gold/70" />
                      {new Date(event.eventDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1.5">
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
                    <div className="flex items-center gap-2 pt-2 border-t border-jungle/5">
                      <Users className="w-3.5 h-3.5 text-gold/70 flex-shrink-0" />
                      <p className="text-xs font-semibold text-jungle/70">
                        In collaboration with <span className="text-gold">{event.partnerName}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-auto">
                  <Link
                    href={`/events/${event.slug}`}
                    className="w-full text-center bg-cream/50 text-jungle hover:bg-jungle hover:text-gold border border-jungle/10 hover:border-jungle py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
