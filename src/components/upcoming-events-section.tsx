"use client";

import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";
import { EventCard } from "~/components/event-card";
import { Button } from "~/components/ui/button";
import { type Event } from "~/lib/events";

const MAX_UPCOMING_EVENTS = 3;

interface UpcomingEventsSectionProps {
  allEvents: Event[];
}

export function UpcomingEventsSection({
  allEvents,
}: UpcomingEventsSectionProps) {
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
    )
    .slice(0, MAX_UPCOMING_EVENTS);

  return (
    <section className="border-border bg-page-background border-b py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-foreground mb-12 text-5xl font-bold tracking-tight md:text-6xl">
          {t("home.sections.events")}
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-2">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-center">
            <p>{t("home.events.noUpcoming")}</p>
          </div>
        )}

        {allEvents.length > upcomingEvents.length && (
          <div className="mt-12 flex justify-center">
            <Link href="/events">
              <Button
                variant="outline"
                className="cursor-pointer rounded-none"
              >
                {t("home.events.seeAll")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
