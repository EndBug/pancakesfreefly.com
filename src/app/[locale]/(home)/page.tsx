import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSection } from "~/components/hero-section";
import { Navbar } from "~/components/navbar";
import { UpcomingEventsSection } from "~/components/upcoming-events-section";
import { Card, CardContent } from "~/components/ui/card";
import { getAllEvents } from "~/lib/events";

export const dynamic = "force-static";
const SHOW_TEAM_SECTION = false;

export default async function Home({
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

  return (
    <>
      <Navbar enableScrollBehavior={true} />
      <div className="bg-page-background min-h-screen">
        <HeroSection />

        <UpcomingEventsSection allEvents={allEvents} />

        {SHOW_TEAM_SECTION && (
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
        )}
      </div>
    </>
  );
}
