"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDemoStore } from "@/lib/store";
import {
  SLA_STEPS,
  MISSION_TOTAL_DEMO_MS,
  FINAL_MISSION_TIME,
  STATUS_QUO_HOURS,
  SPEEDUP_PCT,
} from "@/lib/data";
import { formatStopwatch } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Phase 1 placeholder — drives the stopwatch + 4-step rail off SLA_STEPS
// in compressed-demo time so the route is testable. Phase 2 replaces
// this with the full step-2 substep choreography (tasking / revisit /
// capture-downlink), the alert pop-up, the satellite globe inset, the
// SAR-scene reveal, and the report PDF preview.

type StepId = (typeof SLA_STEPS)[number]["id"];

function activeStep(elapsedMs: number) {
  return (
    SLA_STEPS.find(
      (s) => elapsedMs >= s.startDemoMs && elapsedMs < s.endDemoMs,
    ) ?? null
  );
}

export function MissionTimeline() {
  const elapsed = useDemoStore((s) => s.missionElapsedMs);
  const phase = useDemoStore((s) => s.missionPhase);
  const tickMission = useDemoStore((s) => s.tickMission);
  const setMissionPhase = useDemoStore((s) => s.setMissionPhase);
  const resetMission = useDemoStore((s) => s.resetMission);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  // RAF loop while the demo is running.
  useEffect(() => {
    if (phase === "idle" || phase === "delivered") {
      lastRef.current = null;
      return;
    }
    const loop = (t: number) => {
      if (lastRef.current === null) lastRef.current = t;
      const delta = t - lastRef.current;
      lastRef.current = t;
      tickMission(delta);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, tickMission]);

  // Bookkeeping: advance the store phase when elapsed crosses a step
  // boundary, freeze at "delivered" once we hit the demo end.
  useEffect(() => {
    if (phase === "idle") return;
    if (elapsed >= MISSION_TOTAL_DEMO_MS) {
      setMissionPhase("delivered");
      return;
    }
    const next = activeStep(elapsed);
    if (!next) return;
    const id: StepId = next.id;
    const map: Record<StepId, typeof phase> = {
      1: "tasking",
      2: "imaging",
      3: "downlink",
      4: "delivered",
    };
    const target = map[id];
    if (target && target !== phase) setMissionPhase(target);
  }, [elapsed, phase, setMissionPhase]);

  const pct = Math.min(100, (elapsed / MISSION_TOTAL_DEMO_MS) * 100);
  const isRunning = phase !== "idle" && phase !== "delivered";
  const finished = phase === "delivered";

  // Render the mission clock in real-mission seconds (0:00 → 58:42),
  // not demo seconds. Map elapsed demo ms onto its step's mission seconds
  // window linearly within the step.
  const missionSec = (() => {
    const step = activeStep(elapsed);
    if (!step) {
      return finished ? SLA_STEPS[SLA_STEPS.length - 1]!.endMissionSeconds : 0;
    }
    const t =
      (elapsed - step.startDemoMs) / (step.endDemoMs - step.startDemoMs);
    return Math.round(
      step.startMissionSeconds +
        t * (step.endMissionSeconds - step.startMissionSeconds),
    );
  })();

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Mission clock
          </p>
          <p className="tabular font-mono text-5xl text-gold">
            {finished
              ? FINAL_MISSION_TIME
              : formatStopwatch(missionSec * 1000)}
          </p>
        </div>
        <div className="flex gap-2">
          {phase === "idle" && (
            <Button
              size="lg"
              onClick={() => setMissionPhase("tasking")}
              className="bg-gold text-primary-foreground hover:bg-gold/90"
            >
              ▶ Run Mission
            </Button>
          )}
          {finished && (
            <Button size="lg" variant="outline" onClick={resetMission}>
              ↻ Run Again
            </Button>
          )}
          {isRunning && (
            <Button variant="outline" onClick={resetMission}>
              Stop
            </Button>
          )}
        </div>
      </div>

      <Progress value={pct} />

      <ol className="grid grid-cols-1 gap-2 text-xs md:grid-cols-4">
        {SLA_STEPS.map((s) => {
          const a = activeStep(elapsed);
          const isActive = a?.id === s.id;
          const passed = elapsed >= s.endDemoMs;
          return (
            <motion.li
              key={s.id}
              animate={{ opacity: isActive ? 1 : passed ? 0.75 : 0.4 }}
              className={[
                "rounded-md border px-3 py-3",
                isActive
                  ? "border-gold bg-gold/10"
                  : "border-border bg-background",
              ].join(" ")}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Step {s.id}
              </p>
              <p className="mt-1 text-sm">{s.name}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                {s.caption}
              </p>
            </motion.li>
          );
        })}
      </ol>

      {finished && (
        <div className="rounded-md border border-border bg-background p-4 text-center">
          <p className="tabular font-mono text-3xl text-gold">
            {FINAL_MISSION_TIME}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Status quo: {STATUS_QUO_HOURS}+ hours.
          </p>
          <p className="mt-1 text-xs text-amber">
            You are {SPEEDUP_PCT.toLocaleString()}% faster.
          </p>
        </div>
      )}
    </div>
  );
}
