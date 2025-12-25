"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const HERO_VIDEO_SRC =
  "https://wo9fhjfkhj.ufs.sh/f/6BcYgWCS0fbTYH0ezWJMDvCEA3LuiQhaTUSoNbJzWtp91Xs6";

export function HeroSection() {
  const t = useTranslations();
  const [maskExpanded, setMaskExpanded] = useState(false);
  const teamName = t("home.teamName");
  const teamNameParts = teamName.split(" ");
  const firstLine = teamNameParts
    .slice(0, Math.ceil(teamNameParts.length / 2))
    .join(" ");
  const secondLine = teamNameParts
    .slice(Math.ceil(teamNameParts.length / 2))
    .join(" ");

  useEffect(() => {
    setMaskExpanded(true);
  }, []);

  return (
    <section className="border-border relative min-h-screen overflow-hidden border-b">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          src={HERO_VIDEO_SRC}
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

        <div
          className={`bg-primary absolute inset-0 transition-opacity duration-1000 ${
            maskExpanded ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Loading overlay */}
      <div
        className={`absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-500`}
      >
        <div className="relative h-full w-full">
          <svg
            viewBox="0 0 1440 900"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id="hero-solid-mask" colorInterpolationFilters="sRGB">
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                />
              </filter>

              <mask id="hero-cutout" maskUnits="userSpaceOnUse">
                <rect width="100%" height="100%" fill="white" />

                <g
                  filter="url(#hero-solid-mask)"
                  /** Position to the center of the canvas */
                  transform="translate(720 430)"
                >
                  <image
                    href="/logo.svg"
                    className={`h-40 w-40 transform-gpu transition-transform delay-300 duration-1500 ease-in ${
                      maskExpanded
                        ? "-translate-x-2000 -translate-y-1600 scale-[100]"
                        : "-translate-x-20 -translate-y-40 scale-110 md:-translate-y-20"
                    }`}
                    preserveAspectRatio="xMidYMid meet"
                  />
                </g>

                {/* Mobile: two lines */}
                <text
                  transform="translate(720 430)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-display)"
                  fontWeight="400"
                  fill="black"
                  className={`text-8xl transition-opacity duration-300 ease-in ${
                    maskExpanded ? "opacity-0" : "opacity-100"
                  } translate-y-12 md:opacity-0`}
                >
                  <tspan x="0" dy="0">
                    {firstLine}
                  </tspan>
                  <tspan x="0" dy="0.7em">
                    {secondLine}
                  </tspan>
                </text>
                {/* Desktop: single line */}
                <text
                  transform="translate(720 430)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-display)"
                  fontWeight="400"
                  fill="black"
                  className={`text-8xl transition-opacity duration-300 ease-in ${
                    maskExpanded ? "opacity-0" : "opacity-0 md:opacity-100"
                  } translate-y-32`}
                >
                  <tspan x="0" dy="0">
                    {teamName}
                  </tspan>
                </text>
              </mask>
            </defs>

            <rect
              width="100%"
              height="100%"
              fill="#0a0a0a"
              mask="url(#hero-cutout)"
            />
          </svg>
        </div>
      </div>

      {/* Hero content above loading */}
      <div className="absolute inset-0 z-50 min-h-screen">
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
        <div className="container mx-auto flex min-h-screen flex-col justify-end gap-6 px-4 py-6 md:hidden">
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

      {/* Hero content below loading */}
      <div className="absolute inset-0 min-h-screen">
        {/* Top-left: logo + title */}
        <div className="absolute top-6 left-4 hidden md:top-10 md:left-8 md:block">
          <div className="border-border bg-page-background/70 border-2 p-2 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt={t("home.teamName")}
                width={96}
                height={96}
                className="h-24 w-24 shrink-0"
                priority
              />
              {/* <h1 className="font-display text-primary mt-4 mr-4 text-7xl leading-none tracking-tight whitespace-nowrap">
                {t("home.teamName")}
              </h1> */}
            </div>
          </div>
        </div>

        <div className="container mx-auto flex min-h-screen flex-col justify-between gap-6 px-4 py-6 md:hidden">
          <div className="flex items-center justify-start">
            <div className="border-border bg-page-background/70 border-2 p-2 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo.svg"
                  alt={t("home.teamName")}
                  width={80}
                  height={80}
                  className="h-24 w-24 shrink-0"
                  priority
                />
                {/* <h1 className="font-display text-primary translate-y-1 text-6xl leading-none tracking-tight">
                {t("home.teamName")}
              </h1> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
