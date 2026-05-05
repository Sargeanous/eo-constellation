"use client";
import { useDemoStore } from "@/lib/store";
import {
  MISSION_TOTAL_DEMO_MS,
  FINAL_MISSION_TIME,
} from "@/lib/data";

// Stopwatch with a thin gold progress ring. Mono digits, tabular-nums
// so the digits don't shift width while ticking. Reads
// missionElapsedMs and missionPhase from the store, owns no time of
// its own.
//
// What the stopwatch shows during a run is honest demo-elapsed time
// (00.0s ... 20.0s), not a fabricated mission clock. The
// "< 1 hour" landing only appears at the end. Source: PRD §16 plus
// the directive that the platform must not invent precise mission
// numbers (no real run yet).

interface StopwatchProps {
  /** Diameter in px. Default 180; final-beat instances pass larger. */
  size?: number;
  /** Override the displayed value. */
  forceDisplay?: string;
}

export function Stopwatch({ size = 180, forceDisplay }: StopwatchProps) {
  const elapsed = useDemoStore((s) => s.missionElapsedMs);
  const phase = useDemoStore((s) => s.missionPhase);
  const finished = phase === "delivered";

  // Demo-time display: seconds.tenths until completion, then "< 1 hour".
  const elapsedSec = elapsed / 1000;
  const liveDisplay = `${elapsedSec.toFixed(1)}s`;
  const display =
    forceDisplay ?? (finished ? FINAL_MISSION_TIME : liveDisplay);

  const progress = Math.min(1, elapsed / MISSION_TOTAL_DEMO_MS);

  // Ring geometry: leave 6px on every side for stroke + breathing room.
  const r = size / 2 - 6;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);
  // Final phrase is wider than a number; scale font down so it fits.
  const fontSize = finished
    ? Math.round(size * 0.16)
    : Math.round(size * 0.22);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="timer"
      aria-label={`Mission progress ${display}`}
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--border))"
          strokeWidth={2}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="hsl(var(--gold-500))"
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 80ms linear" }}
        />
      </svg>
      <div className="relative flex flex-col items-center">
        <span
          className="tabular font-mono font-semibold text-gold"
          style={{ fontSize, lineHeight: 1 }}
        >
          {display}
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          {finished ? "result" : "demo elapsed"}
        </span>
      </div>
    </div>
  );
}
