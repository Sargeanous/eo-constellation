"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDemoStore } from "@/lib/store";
import {
  MISSION_TIMELINE,
  MISSION_TOTAL_MS,
  type MissionPhaseSpec,
} from "@/lib/data";
import { formatStopwatch } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function activePhase(elapsed: number): MissionPhaseSpec | undefined {
  return MISSION_TIMELINE.find(
    (p) => elapsed >= p.startMs && elapsed < p.endMs,
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

  // RAF loop while a mission is running.
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

  // Phase bookkeeping: advance phase when elapsed crosses a boundary.
  useEffect(() => {
    if (phase === "idle") return;
    if (elapsed >= MISSION_TOTAL_MS) {
      setMissionPhase("delivered");
      return;
    }
    const next = activePhase(elapsed);
    if (next && next.id !== phase) setMissionPhase(next.id);
  }, [elapsed, phase, setMissionPhase]);

  const pct = Math.min(100, (elapsed / MISSION_TOTAL_MS) * 100);
  const isRunning = phase !== "idle" && phase !== "delivered";

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Mission clock
          </p>
          <p className="font-mono text-3xl">{formatStopwatch(elapsed)}</p>
        </div>
        <div className="flex gap-2">
          {phase === "idle" && (
            <Button onClick={() => setMissionPhase("tasking")}>
              Run Mission
            </Button>
          )}
          {phase === "delivered" && (
            <Button variant="outline" onClick={resetMission}>
              Reset
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

      <ol className="grid grid-cols-5 gap-2 text-xs">
        {MISSION_TIMELINE.map((p) => {
          const active = phase === p.id;
          const passed = elapsed >= p.endMs;
          return (
            <motion.li
              key={p.id}
              animate={{
                opacity: active ? 1 : passed ? 0.7 : 0.4,
              }}
              className={`rounded-md border px-2 py-2 ${
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background"
              }`}
            >
              <p className="uppercase tracking-wider text-[10px] text-muted-foreground">
                {p.id}
              </p>
              <p className="mt-1">{p.label}</p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
