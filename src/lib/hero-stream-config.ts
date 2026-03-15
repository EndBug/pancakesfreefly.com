/**
 * Shared hero stream config (no "use client").
 * Used by the hero section component and by the home layout for server-injected preload links.
 */

export type StreamRow = {
  images: string[];
  direction: "left" | "right";
  duration: number;
  entranceDelay: number;
  hiddenOnMobile?: boolean;
};

export const HERO_STREAM_ROWS: StreamRow[] = [
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

/** Priority image count per row for LCP (must match hero-section.tsx isPriority logic). */
const PRIORITY_COUNTS = [4, 2] as const;

/**
 * Returns the list of hero image URLs that should be preloaded with the initial HTML.
 * Used by the home layout to inject <link rel="preload"> so the browser gets them in the first response.
 */
export function getHeroPriorityImageUrls(): string[] {
  const urls: string[] = [];
  for (const [rowIdx, count] of PRIORITY_COUNTS.entries()) {
    const row = HERO_STREAM_ROWS[rowIdx];
    if (!row) continue;
    for (let i = 0; i < count && i < row.images.length; i++) {
      const src = row.images[i];
      if (src) urls.push(src);
    }
  }
  return urls;
}
