"use client";
import { motion } from "framer-motion";
import { useDemoStore } from "@/lib/store";
import { SLA_STEPS } from "@/lib/data";

// Rail of 5 step pills along the bottom of the mission view. Active
// step is gold-bordered with the gold pill stretched; passed steps are
// muted; future steps barely visible. A thin progress sliver inside the
// active pill mirrors the demoMs progress within that step.

export function StepRail() {
  const elapsed = useDemoStore((s) => s.missionElapsedMs);

  return (
    <ol className="grid grid-cols-1 gap-2 md:grid-cols-5">
      {SLA_STEPS.map((s) => {
        const passed = elapsed >= s.endDemoMs;
        const active = elapsed >= s.startDemoMs && elapsed < s.endDemoMs;
        const stepProgress = active
          ? Math.min(
              1,
              Math.max(
                0,
                (elapsed - s.startDemoMs) / (s.endDemoMs - s.startDemoMs),
              ),
            )
          : passed
            ? 1
            : 0;

        return (
          <motion.li
            key={s.id}
            animate={{
              opacity: active ? 1 : passed ? 0.75 : 0.4,
              scale: active ? 1.02 : 1,
            }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className={`relative overflow-hidden rounded-md border px-3 py-3 ${
              active
                ? "border-gold bg-gold/10 shadow-[0_0_20px_-8px_hsl(var(--gold-500)/0.6)]"
                : passed
                  ? "border-border bg-card"
                  : "border-border bg-background"
            }`}
          >
            {/* Inner progress sliver */}
            <motion.div
              aria-hidden
              className="absolute inset-y-0 left-0 bg-gold/15"
              initial={false}
              animate={{ width: `${stepProgress * 100}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Step {s.id}
              </p>
              <p className="mt-1 text-sm">{s.name}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                {s.caption}
              </p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
