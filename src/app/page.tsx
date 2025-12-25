import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "~/components/ui/card";

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className="bg-page-background min-h-screen">
      {/* Hero Section */}
      <section className="border-border relative min-h-screen overflow-hidden border-b">
        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <video
            src="https://wo9fhjfkhj.ufs.sh/f/6BcYgWCS0fbTYH0ezWJMDvCEA3LuiQhaTUSoNbJzWtp91Xs6"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "56.25vw",
              minHeight: "100vh",
              minWidth: "177.77vh",
            }}
          />
        </div>

        {/* Asymmetric boxes */}
        <div className="relative z-20 min-h-screen">
          {/* Top-left: logo + title */}
          <div className="absolute top-6 left-4 hidden md:top-10 md:left-8 md:block">
            <div className="border-border bg-page-background/70 border-2 p-6 backdrop-blur-sm md:p-8">
              <div className="flex items-center gap-5">
                <Image
                  src="/logo.svg"
                  alt={t("home.teamName")}
                  width={96}
                  height={96}
                  className="h-16 w-16 shrink-0 md:h-20 md:w-20"
                  priority
                />
                <h1 className="font-display text-primary mt-4 text-6xl leading-none tracking-tight whitespace-nowrap md:text-7xl">
                  {t("home.teamName")}
                </h1>
              </div>
            </div>
          </div>

          {/* Bottom-right: links */}
          <div className="absolute right-4 bottom-6 hidden md:right-8 md:bottom-10 md:block">
            <div className="flex flex-col gap-4 md:flex-row">
              <Link
                href="/events"
                className="border-border bg-page-background/65 hover:bg-page-background/80 text-foreground block border-2 p-6 backdrop-blur-sm transition-colors"
              >
                <div className="text-foreground text-3xl font-bold tracking-tight">
                  {t("home.sections.events")}
                </div>
              </Link>

              <Link
                href="/contact"
                className="border-border bg-page-background/65 hover:bg-page-background/80 text-foreground block border-2 p-6 backdrop-blur-sm transition-colors"
              >
                <div className="text-foreground text-3xl font-bold tracking-tight">
                  {t("navbar.contact")}
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile fallback flow (prevents overlap) */}
          <div className="container mx-auto flex min-h-screen flex-col justify-between gap-6 px-4 py-6 md:hidden">
            <div className="border-border bg-page-background/70 border-2 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo.svg"
                  alt={t("home.teamName")}
                  width={80}
                  height={80}
                  className="h-14 w-14 shrink-0"
                  priority
                />
                <h1 className="font-display text-primary translate-y-1 text-5xl leading-none tracking-tight">
                  {t("home.teamName")}
                </h1>
              </div>
            </div>

            <div className="grid gap-4">
              <Link
                href="/events"
                className="border-border bg-page-background/65 hover:bg-page-background/80 text-foreground block border-2 p-6 backdrop-blur-sm transition-colors"
              >
                <div className="text-foreground text-3xl font-bold tracking-tight">
                  {t("home.sections.events")}
                </div>
              </Link>

              <Link
                href="/contact"
                className="border-border bg-page-background/65 hover:bg-page-background/80 text-foreground block border-2 p-6 backdrop-blur-sm transition-colors"
              >
                <div className="text-foreground text-3xl font-bold tracking-tight">
                  {t("navbar.contact")}
                </div>
              </Link>
            </div>
          </div>
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
