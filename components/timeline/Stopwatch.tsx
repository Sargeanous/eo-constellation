"use client";
import { useDemoStore } from "@/lib/store";
import { SLA_STEPS, MISSION_TOTAL_DEMO_MS } from "@/lib/data";

// Stopwatch with a thin gold progress ring.
//
// During the run, the digits are interpolated MISSION-time minute:second
// values. The interpolation is linear within each step, so by design
// the digits tick slowly during steps 1, 3, 4 (where the per-step
// mission window is short) and fast-forward during step 2 (where the
// 45-minute revisit window is compressed into ~12 demo seconds).
// That variable pace is the visual point: the Chairman sees the
// clock fast-forward through the wait that historically took days.
//
// At completion the digits land on the precise final mission time
// (the sum of every step's mission window). The "< 1 hour" framing
// is messaging - it lives on the FinalBeat headline, not on this
// instrument: the stopwatch is a numeric reading, so it shows the
// real number the run clocked.

interface StopwatchProps {
  /** Diameter in px. Default 180; final-beat instances pass larger. */
  size?: number;
  /** Override the displayed value. */
  forceDisplay?: string;
}

function activeStep(elapsedMs: number) {
  return (
    SLA_STEPS.find(
      (s) => elapsedMs >= s.startDemoMs && elapsedMs < s.endDemoMs,
    ) ?? null
  );
}

function formatMmSs(totalSec: number): string {
  const t = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(t / 60).toString().padStart(2, "0");
  const s = (t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Mission seconds for the current demo elapsed. Interpolates within
 *  whichever step is active. Each step's local linear ramp produces
 *  the variable visible speed (slow → fast → slow → slow). */
function computeMissionSec(elapsedMs: number): number {
  const step = activeStep(elapsedMs);
  if (!step) {
    if (elapsedMs >= MISSION_TOTAL_DEMO_MS) {
      return SLA_STEPS[SLA_STEPS.length - 1]!.endMissionSeconds;
    }
    return 0;
  }
  const t =
    (elapsedMs - step.startDemoMs) / (step.endDemoMs - step.startDemoMs);
  return (
    step.startMissionSeconds +
    t * (step.endMissionSeconds - step.startMissionSeconds)
  );
}

export function Stopwatch({ size = 180, forceDisplay }: StopwatchProps) {
  const elapsed = useDemoStore((s) => s.missionElapsedMs);
  const phase = useDemoStore((s) => s.missionPhase);
  const finished = phase === "delivered";

  const missionSec = computeMissionSec(elapsed);
  const display = forceDisplay ?? formatMmSs(missionSec);

  const progress = Math.min(1, elapsed / MISSION_TOTAL_DEMO_MS);

  // Ring geometry: leave 6px on every side for stroke + breathing room.
  const r = size / 2 - 6;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - progress);
  const fontSize = Math.round(size * 0.22);

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
          {finished ? "result" : "mission clock"}
        </span>
      </div>
    </div>
  );
}
