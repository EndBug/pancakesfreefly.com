import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EventCard } from "~/components/event-card";
import { HeroSection } from "~/components/hero-section";
import { Navbar } from "~/components/navbar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { getAllEvents } from "~/lib/events";

export default async function Home() {
  const t = await getTranslations();

  // Get all events and filter for upcoming ones
  const allEvents = getAllEvents();
  const now = new Date();
  const upcomingEvents = allEvents
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3); // Show max 3 events on homepage

  return (
    <>
      <Navbar enableScrollBehavior={true} />
      <div className="bg-page-background min-h-screen">
        <HeroSection />

        {/* Events Section */}
        <section className="border-border bg-page-background border-b py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-foreground mb-12 text-5xl font-bold tracking-tight md:text-6xl">
              {t("home.sections.events")}
            </h2>

            {upcomingEvents.length > 0 ? (
              <>
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-2">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {/* See All Events Button */}
                {allEvents.length > upcomingEvents.length && (
                  <div className="mt-12 flex justify-center">
                    <Link href="/events">
                      <Button variant="outline" className="rounded-none">
                        {t("home.events.seeAll")}
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground text-center">
                <p>{t("home.events.noUpcoming")}</p>
              </div>
            )}
          </div>
        </section>

        {/* Team Section */}
        <section className="border-border bg-page-background border-b py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-foreground mb-12 text-5xl font-bold tracking-tight md:text-6xl">
              {t("home.sections.team")}
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {(
                t.raw("home.team.members") as Array<{
                  name: string;
                  bio: string;
                }>
              ).map((member, index) => (
                <Card
                  key={index}
                  className="border-border bg-card rounded-none border-2"
                >
                  <CardContent className="p-6">
                    {/* Picture placeholder */}
                    <div className="bg-muted mb-4 aspect-square w-full" />

                    {/* Name */}
                    <h3 className="text-foreground mb-3 text-2xl font-bold">
                      {member.name}
                    </h3>

                    {/* Bio */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
