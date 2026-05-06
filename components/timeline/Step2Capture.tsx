"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Radio } from "lucide-react";
import { useDemoStore } from "@/lib/store";
import { SLA_STEPS } from "@/lib/data";
import { GlobeInset } from "./GlobeInset";
import { SARScene } from "./SARScene";

// Step 2: Satellite Tasking & Data Capture. Three sub-beats keyed to
// substep demoMs windows in lib/data.ts:
//   2a Tasking  : dotted-line ground-station → constellation
//   2b Revisit  : globe inset advancing toward Hormuz, caption swap
//                 at the midpoint
//   2c Capture  : SAR scene reveal flash. Byte stream / downlink lives
//                 in the dedicated Step 3 (Sovereign downlink).

const STEP2 = SLA_STEPS.find((s) => s.id === 2)!;
const TASKING = STEP2.substeps!.find((s) => s.name === "Tasking")!;
const REVISIT = STEP2.substeps!.find((s) => s.name === "Revisit")!;
const CAPTURE = STEP2.substeps!.find((s) => s.name === "Capture")!;
const REVISIT_MIDPOINT =
  (REVISIT.startDemoMs + REVISIT.endDemoMs) / 2;

type Sub = "tasking" | "revisit" | "capture" | "post";

function activeSub(elapsedMs: number): Sub {
  if (elapsedMs < TASKING.endDemoMs) return "tasking";
  if (elapsedMs < REVISIT.endDemoMs) return "revisit";
  if (elapsedMs < CAPTURE.endDemoMs) return "capture";
  return "post";
}

export function Step2Capture() {
  const elapsed = useDemoStore((s) => s.missionElapsedMs);
  const sub = activeSub(elapsed);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="grid w-full gap-6 md:grid-cols-[1.4fr_1fr]"
    >
      <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-border bg-card">
        <AnimatePresence mode="wait">
          {sub === "tasking" && <TaskingPanel key="tasking" />}
          {sub === "revisit" && <RevisitPanel key="revisit" elapsed={elapsed} />}
          {(sub === "capture" || sub === "post") && (
            <CapturePanel key="capture" />
          )}
        </AnimatePresence>
      </div>

      <SidePanel sub={sub} />
    </motion.div>
  );
}

function TaskingPanel() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-8"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Sub-step 2a · Tasking
      </p>
      <p className="mt-2 font-display text-lg font-semibold">
        Sovereign uplink → EDGE-SAR-07
      </p>

      <svg viewBox="0 0 400 180" className="mt-4 w-full max-w-md">
        <defs>
          <linearGradient id="taskGrad" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#D4A949" />
          </linearGradient>
        </defs>
        {/* Ground station */}
        <g transform="translate(40 130)">
          <rect x="-12" y="-6" width="24" height="14" fill="#1E293B" stroke="#38BDF8" />
          <line x1="0" y1="-6" x2="0" y2="-26" stroke="#38BDF8" strokeWidth="1" />
          <circle cx="0" cy="-30" r="4" fill="none" stroke="#38BDF8" strokeWidth="1" />
          <text x="0" y="22" textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="ui-monospace, monospace">
            GROUND
          </text>
        </g>
        {/* Satellite */}
        <g transform="translate(360 50)">
          <rect x="-8" y="-8" width="16" height="16" fill="#1E293B" stroke="#38BDF8" />
          <rect x="-22" y="-4" width="12" height="8" fill="none" stroke="#38BDF8" />
          <rect x="10" y="-4" width="12" height="8" fill="none" stroke="#38BDF8" />
          <text x="0" y="28" textAnchor="middle" fontSize="9" fill="#38BDF8" fontFamily="ui-monospace, monospace">
            SAR-07
          </text>
        </g>
        {/* Tasking link: animated dashes */}
        <path
          d="M 50 124 Q 200 -10 360 50"
          fill="none"
          stroke="url(#taskGrad)"
          strokeWidth="1.6"
          strokeDasharray="6 6"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="48"
            to="0"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        className="mt-4 font-mono text-xs text-sovgreen"
      >
        ▸ EDGE-SAR-07 acknowledged · ETA 45 min
      </motion.p>
    </motion.div>
  );
}

function RevisitPanel({ elapsed }: { elapsed: number }) {
  const showSecondCaption = elapsed >= REVISIT_MIDPOINT;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 grid grid-rows-[1fr_auto] p-6"
    >
      <div className="flex items-center justify-center">
        <div className="aspect-square w-full max-w-[300px]">
          <GlobeInset />
        </div>
      </div>
      <div className="mt-4 min-h-[44px]">
        <AnimatePresence mode="wait">
          {!showSecondCaption ? (
            <motion.p
              key="caption-1"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-center text-sm text-muted-foreground"
            >
              EDGE-SAR-07 advancing toward Hormuz · 45 min compressed.
            </motion.p>
          ) : (
            <motion.p
              key="caption-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-center text-sm text-foreground"
            >
              Approaching Hormuz at{" "}
              <span className="font-mono text-gold">7.6 km/s</span>. Imaging
              window in <span className="font-mono text-gold">12 minutes</span>.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CapturePanel() {
  // SAR reveal: a short white flash on mount, then the scene settles in.
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 p-4"
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="pointer-events-none absolute inset-0 z-20 bg-white"
      />
      <div className="relative z-10 h-full">
        <SARScene />
      </div>
    </motion.div>
  );
}

function SidePanel({ sub }: { sub: Sub }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Step 2 · Tasking & Capture
        </p>
        <p className="mt-2 font-display text-base font-semibold">
          Sovereign tasking · no foreign approval
        </p>
      </div>

      <div className="space-y-2 font-mono text-xs">
        <Row label="Bird" value="EDGE-SAR-07" highlight />
        <Row label="Mode" value="Spotlight 0.3 m" />
        <Row label="Polarization" value="VV" />
        <Row label="Slew" value="±30°" />
        <Row label="AOI" value="Hormuz · 26.57°N 56.25°E" />
      </div>

      <div className="mt-2 rounded-md border border-border bg-background p-3">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Radio className="h-3 w-3" />
            Telemetry
          </p>
          <p className="font-mono text-[11px] text-sovgreen">
            {sub === "tasking" && "uplink · ack"}
            {sub === "revisit" && "in transit"}
            {(sub === "capture" || sub === "post") && "scene captured"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-gold" : "text-foreground"}>{value}</span>
    </div>
  );
}
