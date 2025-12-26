import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventCard } from "~/components/event-card";
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
  // Explicitly pass locale to ensure correct translations during client-side navigation
  const t = await getTranslations({ locale });

  const allEvents = getAllEvents();
  const now = new Date();

  // Split events into upcoming and past
  // For events with endDate, check if endDate is in the past
  const upcomingEvents = allEvents
    .filter((event) => {
      const eventEndDate = event.endDate
        ? new Date(event.endDate)
        : new Date(event.date);
      return eventEndDate >= now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = allEvents
    .filter((event) => {
      const eventEndDate = event.endDate
        ? new Date(event.endDate)
        : new Date(event.date);
      return eventEndDate < now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
