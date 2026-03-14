"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "~/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { HeroTitle } from "./hero-title";

type StreamRow = {
  images: string[];
  direction: "left" | "right";
  duration: number;
  entranceDelay: number;
  hiddenOnMobile?: boolean;
};

const STREAM_ROWS: StreamRow[] = [
  {
    direction: "left",
    duration: 80,
    entranceDelay: 0,
    images: [
      "/images/hero-section/high/001.png",
      "/images/hero-section/low/001.png",
      "/images/hero-section/high/005.png",
      "/images/hero-section/high/009.png",
      "/images/hero-section/low/005.png",
      "/images/hero-section/high/013.png",
      "/images/hero-section/high/003.png",
      "/images/hero-section/low/009.png",
    ],
  },
  {
    direction: "right",
    duration: 100,
    entranceDelay: 200,
    images: [
      "/images/hero-section/high/002.png",
      "/images/hero-section/high/006.png",
      "/images/hero-section/low/002.png",
      "/images/hero-section/high/010.png",
      "/images/hero-section/high/014.png",
      "/images/hero-section/low/006.png",
      "/images/hero-section/high/004.png",
      "/images/hero-section/low/010.png",
    ],
  },
  {
    direction: "left",
    duration: 70,
    entranceDelay: 400,
    images: [
      "/images/hero-section/high/007.png",
      "/images/hero-section/low/003.png",
      "/images/hero-section/high/011.png",
      "/images/hero-section/high/015.png",
      "/images/hero-section/low/007.png",
      "/images/hero-section/high/017.png",
      "/images/hero-section/low/011.png",
    ],
  },
  {
    direction: "right",
    duration: 90,
    entranceDelay: 600,
    hiddenOnMobile: true,
    images: [
      "/images/hero-section/high/008.png",
      "/images/hero-section/low/004.png",
      "/images/hero-section/high/012.png",
      "/images/hero-section/high/016.png",
      "/images/hero-section/low/008.png",
      "/images/hero-section/low/012.png",
      "/images/hero-section/low/013.png",
    ],
  },
];

export function HeroSection() {
  const t = useTranslations();
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      const fadeOutThreshold = 0.1;

      if (scrollPercent > fadeOutThreshold) {
        setScrollOpacity(0);
      } else {
        setScrollOpacity(1 - scrollPercent / fadeOutThreshold);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="border-border bg-page-background relative flex h-dvh w-full flex-col justify-center gap-3 overflow-hidden border-b">
      {/* Photo streams */}
      {STREAM_ROWS.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={cn(
            "hero-stream-row min-h-[28vh] overflow-hidden md:min-h-[22vh]",
            row.hiddenOnMobile && "hidden md:block",
          )}
          style={
            { "--row-delay": `${row.entranceDelay}ms` } as React.CSSProperties
          }
        >
          <div
            className={cn(
              "flex w-max gap-3",
              row.direction === "left"
                ? "animate-stream-left"
                : "animate-stream-right",
            )}
            style={
              { "--stream-duration": `${row.duration}s` } as React.CSSProperties
            }
          >
            {[...row.images, ...row.images].map((src, imgIdx) => {
              const isPriority =
                (rowIdx === 0 && imgIdx < 4) || (rowIdx === 1 && imgIdx < 2);
              return (
                <div
                  key={`${rowIdx}-${imgIdx}`}
                  className="relative aspect-video h-[28vh] shrink-0 md:h-[22vh]"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 50vw, 39vw"
                    priority={isPriority}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Top gradient for text readability */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-7 h-28"
        style={{
          background:
            "linear-gradient(to bottom, var(--page-background) 0%, transparent 100%)",
        }}
      />
      {/* Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-7 h-28"
        style={{
          background:
            "linear-gradient(to top, var(--page-background) 0%, transparent 100%)",
        }}
      />

      {/* Team Name - top left (handwritten SVG animation) */}
      <div className="absolute top-4 left-4 z-10 w-[min(90vw,22rem)] md:top-8 md:left-8 md:w-[26rem]">
        <HeroTitle />
        {/* <span className="sr-only">{t("navbar.teamName")}</span> */}
      </div>

      {/* Links - bottom right */}
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

      {/* Scroll indicator - bottom center */}
      <div
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-300"
        style={{ opacity: scrollOpacity }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="border-border flex h-8 w-8 items-center justify-center">
            <ChevronDown className="text-foreground animate-scroll-float h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
