"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card } from "~/components/ui/card";

const HERO_VIDEO_SRC =
  "https://wo9fhjfkhj.ufs.sh/f/6BcYgWCS0fbTYH0ezWJMDvCEA3LuiQhaTUSoNbJzWtp91Xs6";

export function HeroSection() {
  const t = useTranslations();

  return (
    <section className="border-border bg-page-background relative h-screen max-h-screen overflow-hidden border-b p-4">
      <div className="relative container mx-auto flex h-full max-h-full items-stretch px-4 md:items-center md:px-8">
        {/* Video card - left aligned, taking most of the screen */}
        <Card className="border-border bg-card relative z-0 m-4 h-[calc(100%-2rem)] max-h-full w-[calc(100%-2rem)] overflow-visible rounded-none border-2 pb-0 md:m-0 md:h-auto md:max-h-full md:w-[95%]">
          <div className="relative h-full w-full">
            <video
              src={HERO_VIDEO_SRC}
              autoPlay
              loop
              muted
              playsInline
              poster="/video_still.png"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Team Name - top left, positioned relative to video card */}
          <div className="absolute -top-2 -left-4 z-10 md:-top-4 md:-left-8">
            <span className="font-display text-primary translate-y-1 text-8xl/16 tracking-tight [text-shadow:3px_3px_0px_var(--card)]">
              {t("navbar.teamName")}
            </span>
          </div>
        </Card>

        {/* Links - bottom right, can overlap video */}
        <div className="absolute right-4 bottom-6 z-10 flex flex-col gap-4 md:right-8 md:bottom-10 md:flex-row">
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
    </section>
  );
}
