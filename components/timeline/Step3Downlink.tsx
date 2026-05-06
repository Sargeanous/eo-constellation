"use client";
import { motion } from "framer-motion";
import { ArrowDownToLine, Radio } from "lucide-react";
import { GROUND_STATIONS } from "@/lib/data";
import { BaseerPill } from "./BaseerPill";

// Step 3: Sovereign downlink. After capture, the satellite passes
// over a UAE ground station and pushes the imagery down. No bytes
// leave the country. Visual: a satellite glyph traversing a slim arc
// with bytes streaming into one of three named UAE ground stations.

export function Step3Downlink() {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="relative grid w-full gap-6 md:grid-cols-[1.4fr_1fr]"
    >
      <BaseerPill role="downlink" />

      <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-border bg-card">
        <p className="absolute left-6 top-6 z-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Sovereign downlink
        </p>
        <p className="absolute left-6 top-12 z-10 font-display text-lg font-semibold">
          EDGE-SAR-07 → UAE ground
        </p>

        <svg
          viewBox="0 0 600 360"
          className="absolute inset-0 h-full w-full"
          aria-label="Satellite downlinking imagery to UAE ground station"
        >
          <defs>
            <linearGradient id="dlGrad" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#D4A949" />
            </linearGradient>
          </defs>

          {/* Sat-orbit arc */}
          <path
            d="M 60 100 Q 300 30 540 110"
            fill="none"
            stroke="#38BDF8"
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeDasharray="3 4"
          />

          {/* Satellite glyph travelling along the arc */}
          <g>
            <rect
              x="-10"
              y="-10"
              width="20"
              height="20"
              fill="#1E293B"
              stroke="#38BDF8"
              strokeWidth="1.4"
            />
            <rect
              x="-22"
              y="-6"
              width="12"
              height="12"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
            />
            <rect
              x="10"
              y="-6"
              width="12"
              height="12"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
            />
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M 60 100 Q 300 30 540 110"
            />
          </g>

          {/* Ground station mast at lower-right */}
          <g transform="translate(440 280)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-44"
              stroke="#D4A949"
              strokeWidth="1.4"
            />
            <path
              d="M -14 -8 L 0 -44 L 14 -8 Z"
              fill="none"
              stroke="#D4A949"
              strokeWidth="1.4"
            />
            <rect
              x="-22"
              y="0"
              width="44"
              height="14"
              fill="#1E293B"
              stroke="#D4A949"
              strokeWidth="1.4"
            />
            <text
              x="0"
              y="32"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="11"
              fill="#D4A949"
            >
              FUJAIRAH
            </text>
            <text
              x="0"
              y="46"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="9"
              fill="#94A3B8"
            >
              UAE GROUND
            </text>
          </g>

          {/* Streaming downlink bytes - dashed gradient */}
          <path
            d="M 540 110 Q 510 200 440 280"
            fill="none"
            stroke="url(#dlGrad)"
            strokeWidth="2.2"
            strokeDasharray="6 6"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="48"
              to="0"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="absolute bottom-6 left-6 right-6 text-center font-mono text-xs text-sovgreen"
        >
          ▸ 420 MB streaming · sovereign cloud · zero foreign egress
        </motion.p>
      </div>

      <aside className="rounded-lg border border-border bg-card p-6 space-y-4 text-sm">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Step 3 · Sovereign downlink
          </p>
          <p className="mt-2 font-display text-base font-semibold">
            Three UAE ground stations
          </p>
          <p className="mt-1 text-muted-foreground">
            The satellite passes over the nearest sovereign site and
            pushes the captured frames straight into the UAE network.
          </p>
        </div>

        <ul className="space-y-2">
          {GROUND_STATIONS.map((g) => (
            <li
              key={g.id}
              className="flex items-baseline justify-between rounded-md border border-border bg-background px-3 py-2"
            >
              <span className="text-foreground">{g.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {g.lat.toFixed(2)}°N · {g.lng.toFixed(2)}°E
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-2 rounded-md border border-border bg-background p-3">
          <Radio className="mt-0.5 h-4 w-4 shrink-0 text-sovsky" />
          <p className="text-xs text-muted-foreground">
            Ground stations sit on UAE soil, on UAE infrastructure. No
            foreign teleport, no shared cloud, no external chain of
            custody.
          </p>
        </div>
        <div className="flex items-start gap-2 rounded-md border border-border bg-background p-3">
          <ArrowDownToLine className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p className="text-xs text-muted-foreground">
            Bytes hit the sovereign cloud, ready for the analytics pass.
          </p>
        </div>
      </aside>
    </motion.div>
  );
}
