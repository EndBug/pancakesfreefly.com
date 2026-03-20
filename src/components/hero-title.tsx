"use client";

import {
  heroTitleLine1PathData,
  heroTitleLine1ViewBox,
  heroTitleLine2PathData,
  heroTitleLine2ViewBox,
} from "~/_generated/hero-title-paths";

const INITIAL_DELAY_MS = 400;
const DURATION_MS = 1800;
const STAGGER_MS = 100;
const FILL_DURATION_MS = 280;
const FILL_DELAY_AFTER_STROKE_MS = 60;

const svgStyle: React.CSSProperties = {
  color: "var(--primary)",
  filter: "drop-shadow(2px 2px 0 var(--card))",
  ["--hero-initial-delay" as string]: `${INITIAL_DELAY_MS}ms`,
};

type TitleSvgProps = {
  paths: string[];
  viewBox: string;
  clipPrefix: string;
  /** Global index for stagger (line1: 0..6, line2: 7..13) */
  startIndex: number;
};

function TitleSvg({ paths, viewBox, clipPrefix, startIndex }: TitleSvgProps) {
  return (
    <svg
      className="h-24 w-auto max-w-[85vw] translate-y-1 md:h-24 md:max-w-none md:translate-y-0"
      viewBox={viewBox}
      preserveAspectRatio="xMinYMid meet"
      fill="none"
      style={svgStyle}
      aria-hidden
    >
      <defs>
        {paths.map((d, i) => (
          <clipPath key={i} id={`${clipPrefix}-${i}`}>
            <path d={d} />
          </clipPath>
        ))}
      </defs>
      <g className="hero-title-reveal">
        {paths.map((d, j) => {
          const i = startIndex + j;
          const strokeDelay = INITIAL_DELAY_MS + i * STAGGER_MS;
          const fillDelay =
            strokeDelay + DURATION_MS + FILL_DELAY_AFTER_STROKE_MS;
          return (
            <g key={i}>
              <path
                d={d}
                fill="currentColor"
                className="hero-title-fill"
                style={{
                  animationDelay: `${fillDelay}ms`,
                  animationDuration: `${FILL_DURATION_MS}ms`,
                }}
              />
              <path
                d={d}
                pathLength={1}
                strokeDasharray={1}
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                clipPath={`url(#${clipPrefix}-${j})`}
                className="hero-title-path"
                style={
                  {
                    animationDelay: `${strokeDelay}ms`,
                    ["--hero-duration" as string]: `${DURATION_MS}ms`,
                  } as React.CSSProperties
                }
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function HeroTitle() {
  return (
    <div className="flex w-full max-w-[min(92vw,28rem)] flex-col items-center justify-center gap-0 md:max-w-none md:flex-row">
      <TitleSvg
        paths={heroTitleLine1PathData}
        viewBox={heroTitleLine1ViewBox}
        clipPrefix="hero-title-l1-clip"
        startIndex={0}
      />
      {/* Negative margin pulls second word closer (equivalent to negative gap) */}
      <div className="-mt-8 md:mt-0 md:-ml-3">
        <TitleSvg
          paths={heroTitleLine2PathData}
          viewBox={heroTitleLine2ViewBox}
          clipPrefix="hero-title-l2-clip"
          startIndex={7}
        />
      </div>
    </div>
  );
}
