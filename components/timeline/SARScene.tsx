"use client";
import { motion } from "framer-motion";

// Procedural SAR scene. PRD §4 step 2c calls for a "0.5m SAR scene"
// placeholder that "looks SAR-like: high contrast, speckle-textured".
// We do this with stacked SVG feTurbulence layers over a dark base,
// plus three vessel-shaped bright pixels in the sea portion of the
// frame that step 3 puts bounding boxes around.
//
// Coordinates of the vessels are exported so Step3Analytics can
// align bounding boxes without hard-coding the geometry twice.

export interface Vessel {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
}

export const SAR_VESSELS: Vessel[] = [
  { x: 168, y: 240, w: 56, h: 12, label: "Container ship", confidence: 0.89 },
  { x: 320, y: 282, w: 38, h: 9, label: "Frigate", confidence: 0.76 },
  { x: 444, y: 218, w: 30, h: 8, label: "Tanker", confidence: 0.82 },
];

interface SARSceneProps {
  /** When true, renders without the "first capture" reveal flash. Use
   *  on Step 3 / Step 4 where the scene is already visible. */
  steady?: boolean;
}

export function SARScene({ steady }: SARSceneProps) {
  return (
    <motion.div
      className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-border"
      initial={steady ? false : { opacity: 0 }}
      animate={steady ? false : { opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <svg viewBox="0 0 600 400" className="h-full w-full">
        <defs>
          {/* Fine speckle: high frequency, low octave for crispness */}
          <filter id="sarSpeckle" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.6"
              numOctaves="2"
              seed="11"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.78
                      0 0 0 0 0.80
                      0 0 0 0 0.82
                      0 0 0 0.55 0"
            />
          </filter>
          {/* Coarse cloud: gives a "land vs sea" macro pattern */}
          <filter id="sarCoarse" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="3"
              seed="3"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.18
                      0 0 0 0 0.22
                      0 0 0 0 0.27
                      0 0 0 0.65 0"
            />
          </filter>
          <radialGradient id="sarVignette" cx="50%" cy="50%" r="55%">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="vesselGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* Base: dark slate */}
        <rect width="600" height="400" fill="#0a0d12" />
        {/* Coarse macro pattern */}
        <rect width="600" height="400" filter="url(#sarCoarse)" opacity="1" />
        {/* Fine speckle */}
        <rect
          width="600"
          height="400"
          filter="url(#sarSpeckle)"
          opacity="0.9"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Vessels: bright pixels in the lower half. Each is a small
            rectangle with a soft halo simulating SAR return. */}
        {SAR_VESSELS.map((v, i) => (
          <g key={i}>
            <rect
              x={v.x - 4}
              y={v.y - 4}
              width={v.w + 8}
              height={v.h + 8}
              fill="#F1F5F9"
              opacity="0.20"
              rx="2"
            />
            <rect
              x={v.x}
              y={v.y}
              width={v.w}
              height={v.h}
              fill="url(#vesselGrad)"
              rx="1.5"
            />
          </g>
        ))}

        {/* Vignette */}
        <rect width="600" height="400" fill="url(#sarVignette)" />

        {/* Crosshair: a tiny graticule at the centre */}
        <g
          stroke="#38BDF8"
          strokeWidth="0.5"
          strokeOpacity="0.55"
          fill="none"
        >
          <line x1="290" y1="200" x2="310" y2="200" />
          <line x1="300" y1="190" x2="300" y2="210" />
          <circle cx="300" cy="200" r="6" />
        </g>
      </svg>

      {/* Frame metadata strip: reads as ground-station HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-sovsky/80">
        <span>EDGE-SAR-07 · 0.5 m GSD</span>
        <span>26.57°N 56.25°E</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>STRIPMAP · VV</span>
        <span>X-BAND · NESZ &lt; -20 dB</span>
      </div>
    </motion.div>
  );
}
