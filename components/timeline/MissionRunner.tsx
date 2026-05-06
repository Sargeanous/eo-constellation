"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useDemoStore } from "@/lib/store";
import {
  SLA_STEPS,
  MISSION_TOTAL_DEMO_MS,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Stopwatch } from "./Stopwatch";
import { StepRail } from "./StepRail";
import { Step1Intel } from "./Step1Intel";
import { Step2Capture } from "./Step2Capture";
import { Step3Downlink } from "./Step3Downlink";
import { Step3Analytics } from "./Step3Analytics";
import { Step4Report } from "./Step4Report";
import { FinalBeat } from "./FinalBeat";
import { chime, tick } from "@/lib/audio";

// Phase 2: the centrepiece. Single button drives a compressed timeline
// that animates five steps (intel, tasking & capture, sovereign downlink,
// onboard analytics, report) and lands on "< 1 hour".
//
// Architecture:
//   - Store owns the clock (missionElapsedMs), phase, and a paused flag.
//     We drive a RAF loop that ticks elapsed only while running AND not
//     paused. Stop sets paused=true and freezes the run in place; Resume
//     un-freezes; Reset clears everything back to idle.
//   - Step components mount/unmount via AnimatePresence keyed on the
//     active step id, so each step gets a clean enter/exit.
//   - chime() is best-effort: gated behind audioEnabled in the store.
//   - Haptic is via the Web Vibration API; no-op on unsupported.

type StepId = (typeof SLA_STEPS)[number]["id"];

function activeStepId(elapsedMs: number): StepId | null {
  const s = SLA_STEPS.find(
    (s) => elapsedMs >= s.startDemoMs && elapsedMs < s.endDemoMs,
  );
  return s ? s.id : null;
}

export function MissionRunner() {
  const elapsed = useDemoStore((s) => s.missionElapsedMs);
  const phase = useDemoStore((s) => s.missionPhase);
  const paused = useDemoStore((s) => s.missionPaused);
  const audioEnabled = useDemoStore((s) => s.audioEnabled);
  const tickMission = useDemoStore((s) => s.tickMission);
  const setMissionPhase = useDemoStore((s) => s.setMissionPhase);
  const pauseMission = useDemoStore((s) => s.pauseMission);
  const resumeMission = useDemoStore((s) => s.resumeMission);
  const resetMission = useDemoStore((s) => s.resetMission);

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);
  const chimedRef = useRef(false);
  // Last step id we fired a tick for, so we don't double-fire across
  // re-renders within the same step.
  const tickedStepRef = useRef<StepId | null>(null);

  const isRunning = phase !== "idle" && phase !== "delivered";
  const isTicking = isRunning && !paused;

  // RAF loop: only ticks while running and not paused.
  useEffect(() => {
    if (!isTicking) {
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
  }, [isTicking, tickMission]);

  // Phase bookkeeping: flip the store phase as we cross step boundaries.
  // Map step id → store phase string; we don't strictly need the store
  // phase to drive the rail (rail reads elapsed directly), but the
  // store phase is what gates the RAF loop and the dock highlights.
  // We also fire a soft Tone tick on each NEW step entry so the audio
  // has rhythm beyond the single closing chime (only audible if the
  // operator menu has armed audio).
  useEffect(() => {
    if (phase === "idle") {
      tickedStepRef.current = null;
      return;
    }
    if (elapsed >= MISSION_TOTAL_DEMO_MS) {
      if (phase !== "delivered") setMissionPhase("delivered");
      return;
    }
    const id = activeStepId(elapsed);
    if (!id) return;
    const map: Record<StepId, typeof phase> = {
      1: "tasking",
      2: "imaging",
      3: "downlink",
      4: "analytics",
      5: "report",
    };
    const target = map[id];
    if (target && target !== phase) setMissionPhase(target);
    if (audioEnabled && id !== tickedStepRef.current) {
      tickedStepRef.current = id;
      tick().catch(() => {
        /* swallow: tick is non-essential */
      });
    }
  }, [elapsed, phase, setMissionPhase, audioEnabled]);

  // Completion chime: fires once when we transition into delivered.
  useEffect(() => {
    if (phase === "delivered" && !chimedRef.current) {
      chimedRef.current = true;
      if (audioEnabled) {
        chime().catch(() => {
          /* swallow: chime is non-essential */
        });
      }
    }
    if (phase === "idle") {
      chimedRef.current = false;
    }
  }, [phase, audioEnabled]);

  function onRun() {
    // Web Vibration API: graceful no-op on unsupported (iPad Safari
    // currently lacks it; that's fine).
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        /* ignore */
      }
    }
    setMissionPhase("tasking");
  }

  function onStop() {
    pauseMission();
  }

  function onResume() {
    resumeMission();
  }

  function onRunAgain() {
    resetMission();
    // Use a microtask so the store has updated before we restart.
    queueMicrotask(() => setMissionPhase("tasking"));
  }

  const stepId = activeStepId(elapsed);

  return (
    <div className="space-y-8">
      {/* Stopwatch + Run / Stop / Resume / Reset controls */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
        <Stopwatch />
        <div className="flex gap-3">
          {phase === "idle" && (
            <Button
              size="lg"
              onClick={onRun}
              className="bg-gold text-primary-foreground hover:bg-gold/90"
            >
              <Play className="mr-2 h-4 w-4" />
              Run Mission
            </Button>
          )}
          {isRunning && !paused && (
            <Button variant="outline" onClick={onStop}>
              <Pause className="mr-2 h-4 w-4" />
              Stop
            </Button>
          )}
          {isRunning && paused && (
            <>
              <Button
                onClick={onResume}
                className="bg-gold text-primary-foreground hover:bg-gold/90"
              >
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
              <Button variant="outline" onClick={resetMission}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Active-step body: fixed min height so the layout doesn't jump. */}
      <div className="min-h-[420px]">
        <AnimatePresence mode="wait">
          {phase === "idle" && <IdleHero key="idle" />}
          {isRunning && stepId === 1 && <Step1Intel key="step1" />}
          {isRunning && stepId === 2 && <Step2Capture key="step2" />}
          {isRunning && stepId === 3 && <Step3Downlink key="step3-downlink" />}
          {isRunning && stepId === 4 && <Step3Analytics key="step4-analytics" />}
          {isRunning && stepId === 5 && <Step4Report key="step5-report" />}
          {phase === "delivered" && <Step4Report key="step5-final" />}
        </AnimatePresence>
      </div>

      <StepRail />

      {phase === "delivered" && <FinalBeat onRunAgain={onRunAgain} />}
    </div>
  );
}

function IdleHero() {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full min-h-[360px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/40 p-10 text-center"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
        Ready
      </p>
      <p className="max-w-md font-display text-2xl font-semibold">
        Tap <span className="text-gold">Run Mission</span> and watch the SLA.
      </p>
      <p className="max-w-lg text-sm text-muted-foreground">
        Five steps, one resolution. Intel cue, sovereign tasking and capture,
        downlink to a UAE ground station, onboard analytics, report.
      </p>
    </motion.div>
  );
}
