"use client";

import {
  heroTitlePathData,
  heroTitleViewBox,
} from "~/_generated/hero-title-paths";

const PATHS = heroTitlePathData.filter((d) => d.length > 0);

const INITIAL_DELAY_MS = 400;
const DURATION_MS = 1800;
const STAGGER_MS = 100;
const FILL_DURATION_MS = 280;
/** Fill starts appearing after the stroke has finished for this path */
const FILL_DELAY_AFTER_STROKE_MS = 60;

export function HeroTitle() {
  return (
    <svg
      className="h-auto w-full max-w-[min(90vw,24rem)] translate-y-1"
      viewBox={heroTitleViewBox}
      preserveAspectRatio="xMinYMid meet"
      fill="none"
      style={{
        color: "var(--primary)",
        filter: "drop-shadow(2px 2px 0 var(--card))",
        ["--hero-initial-delay" as string]: `${INITIAL_DELAY_MS}ms`,
      }}
      aria-hidden
    >
      <g className="hero-title-reveal">
        {PATHS.map((d, i) => {
          const strokeDelay = INITIAL_DELAY_MS + i * STAGGER_MS;
          const fillDelay =
            strokeDelay + DURATION_MS + FILL_DELAY_AFTER_STROKE_MS;
          return (
            <g key={i}>
              {/* Fill: appears after the stroke has drawn */}
              <path
                d={d}
                fill="currentColor"
                className="hero-title-fill"
                style={{
                  animationDelay: `${fillDelay}ms`,
                  animationDuration: `${FILL_DURATION_MS}ms`,
                }}
              />
              {/* Stroke: draws along the path (handwritten outline) */}
              <path
                d={d}
                pathLength={1}
                strokeDasharray={1}
                stroke="currentColor"
                strokeWidth={0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
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
