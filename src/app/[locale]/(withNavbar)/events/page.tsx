import { setRequestLocale } from "next-intl/server";
import { EventsListing } from "~/components/events-listing";
import { getAllEvents } from "~/lib/events";

export const dynamic = "force-static";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const allEvents = getAllEvents();

  return <EventsListing allEvents={allEvents} />;
}
