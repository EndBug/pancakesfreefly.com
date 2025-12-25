import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "~/components/ui/card";

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className="bg-page-background min-h-screen">
      {/* Hero Section */}
      <section className="border-border relative flex min-h-screen items-center justify-center overflow-hidden border-b">
        {/* Video background placeholder - will be implemented later */}
        <div className="from-page-background via-page-background to-page-background absolute inset-0 bg-linear-to-b opacity-80" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
          {/* Logo */}
          <Image
            src="/logo.svg"
            alt={t("home.teamName")}
            width={128}
            height={128}
            className="h-32 w-32 md:h-48 md:w-48"
            priority
          />

          {/* Team name */}
          <h1 className="font-display text-primary text-7xl tracking-tight md:text-9xl">
            {t("home.teamName")}
          </h1>
        </div>
      </section>

      {/* Events Section */}
      <section className="border-border bg-page-background border-b py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-5xl font-bold tracking-tight md:text-6xl">
            {t("home.sections.events")}
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((event) => (
              <Card
                key={event}
                className="border-border bg-card overflow-hidden rounded-none border-2"
              >
                {/* 4:5 vertical poster placeholder */}
                <div className="bg-muted relative aspect-4/5 w-full">
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    {t("home.events.poster", { event })}
                  </div>
                </div>

                <CardContent className="space-y-2 p-4">
                  <div className="bg-muted h-4 w-3/4" />
                  <div className="bg-muted h-3 w-1/2" />
                  <div className="bg-muted h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
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
              t.raw("home.team.members") as Array<{ name: string; bio: string }>
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
  );
}
