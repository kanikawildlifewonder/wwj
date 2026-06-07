import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditEventForm from "./EditEventForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id }
  });

  if (!event) notFound();

  // Convert Date to string to pass safely to Client Component if needed,
  // but Prisma client returns Date object which we can serialize or map.
  const serializedEvent = {
    ...event,
    eventDate: event.eventDate.toISOString(),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };

  return <EditEventForm event={serializedEvent} />;
}
