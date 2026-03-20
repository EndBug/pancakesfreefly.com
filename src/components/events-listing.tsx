"use client";

import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import { EventCard } from "~/components/event-card";
import { type Event } from "~/lib/events";

interface EventsListingProps {
  allEvents: Event[];
}

export function EventsListing({ allEvents }: EventsListingProps) {
  const t = useTranslations();

  const today = DateTime.now().startOf("day");

  const upcomingEvents = allEvents
    .filter((event) => {
      const effectiveEnd = DateTime.fromISO(event.endDate ?? event.date);
      return effectiveEnd >= today;
    })
    .sort(
      (a, b) =>
        DateTime.fromISO(a.date).toMillis() -
        DateTime.fromISO(b.date).toMillis(),
    );

  const pastEvents = allEvents
    .filter((event) => {
      const effectiveEnd = DateTime.fromISO(event.endDate ?? event.date);
      return effectiveEnd < today;
    })
    .sort(
      (a, b) =>
        DateTime.fromISO(b.date).toMillis() -
        DateTime.fromISO(a.date).toMillis(),
    );

  return (
    <div className="bg-page-background min-h-screen">
      {/* Upcoming Events Section */}
      <section className="border-border bg-page-background border-b py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-5xl font-bold tracking-tight md:text-6xl">
            {t("events.upcoming")}
          </h2>

          {upcomingEvents.length > 0 ? (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-2">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center">
              <p>{t("events.noUpcoming")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="border-border bg-page-background border-b py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-5xl font-bold tracking-tight md:text-6xl">
            {t("events.past")}
          </h2>

          {pastEvents.length > 0 ? (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-2">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center">
              <p>{t("events.noPast")}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
