import React from "react";
import { getPublishedEvents } from "@/app/actions/events";
import EventsListingClient from "./EventsListingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Collaborations | WWJ - Wildlife Wonder Jewellery",
  description: "Discover the latest exhibitions, design collaborations, press features, and conservation initiatives by Wildlife Wonder Jewellery.",
  alternates: {
    canonical: "/events",
  },
};

export default async function EventsPage() {
  const events = await getPublishedEvents();

  // Serialize events dates to pass safely to Client Component
  const serializedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    category: event.category,
    status: event.status,
    featuredImage: event.featuredImage,
    shortDescription: event.shortDescription,
    eventDate: event.eventDate.toISOString(),
    location: event.location,
    partnerName: event.partnerName,
  }));

  return <EventsListingClient initialEvents={serializedEvents} />;
}
