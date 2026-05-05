"use client";
import { useDemoStore } from "@/lib/store";
import {
  SLA_STEPS,
  MISSION_TOTAL_DEMO_MS,
  FINAL_MISSION_TIME,
} from "@/lib/data";
import { formatStopwatch } from "@/lib/utils";

// Stopwatch with a thin gold progress ring (PRD §10).
// Mono digits, tabular-nums so the digits don't shift width while
// ticking. Reads missionElapsedMs and missionPhase from the store —
// owns no time of its own.

interface StopwatchProps {
  /** Diameter in px. Default 180; final-beat instances pass larger. */
  size?: number;
  /** Override the displayed time (e.g. freeze at 58:42 for the final
   *  beat). Skips the elapsed-→-mission-seconds math. */
  forceDisplay?: string;
}

function activeStep(elapsedMs: number) {
  return (
    SLA_STEPS.find(
      (s) => elapsedMs >= s.startDemoMs && elapsedMs < s.endDemoMs,
    ) ?? null
  );
}

function computeMissionSec(elapsedMs: number, finished: boolean): number {
  if (finished) return SLA_STEPS[SLA_STEPS.length - 1]!.endMissionSeconds;
  const step = activeStep(elapsedMs);
  if (!step) return 0;
  const t =
    (elapsedMs - step.startDemoMs) / (step.endDemoMs - step.startDemoMs);
  return Math.round(
    step.startMissionSeconds +
      t * (step.endMissionSeconds - step.startMissionSeconds),
  );
}

export function Stopwatch({ size = 180, forceDisplay }: StopwatchProps) {
  const elapsed = useDemoStore((s) => s.missionElapsedMs);
  const phase = useDemoStore((s) => s.missionPhase);
  const finished = phase === "delivered";

  const missionSec = computeMissionSec(elapsed, finished);
  const display =
    forceDisplay ??
    (finished ? FINAL_MISSION_TIME : formatStopwatch(missionSec * 1000));

  const progress = Math.min(1, elapsed / MISSION_TOTAL_DEMO_MS);

  // Ring geometry — leave 8px on every side for stroke + breathing room.
  const r = size / 2 - 6;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);
  const fontSize = Math.round(size * 0.24);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="timer"
      aria-label={`Mission clock ${display}`}
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
          mission clock
        </span>
      </div>
    </div>
  );
}
