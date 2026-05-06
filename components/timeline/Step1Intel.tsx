"use client";
import { motion } from "framer-motion";
import { AlertTriangle, Cpu, MapPin } from "lucide-react";
import { BaseerPill } from "./BaseerPill";

// Step 1: Situation Awareness & Intel Generation. PRD §4.
// Alert card slides in, AI agent icon pulses processing, caption
// reads "OSINT + GEOINT fusion. AI agent classifies and prioritizes."
// BASEER pill in the corner: the cued alert originates in BASEER,
// our existing partner intel platform.

export function Step1Intel() {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="relative grid w-full gap-6 md:grid-cols-[1.4fr_1fr]"
    >
      <BaseerPill role="intel" />
      {/* Alert card */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-lg border border-sovred/50 bg-sovred/5 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-sovred/15 text-sovred">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sovred">
              Priority alert · INTEL fusion
            </p>
            <p className="mt-2 font-display text-xl font-semibold">
              Vessel of interest: Strait of Hormuz
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              26.57° N · 56.25° E
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Source</p>
                <p className="mt-1 text-foreground">OSINT + GEOINT</p>
              </div>
              <div>
                <p className="text-muted-foreground">Classification</p>
                <p className="mt-1 text-foreground">AUTO · agent-7</p>
              </div>
              <div>
                <p className="text-muted-foreground">Action</p>
                <p className="mt-1 text-gold">Task SAR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scan-line sweep: gives the alert card a "live feed" feel. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-sovred/60"
          animate={{ y: [0, 140, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* AI agent processing tile */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-center rounded-lg border border-border bg-card p-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="grid h-10 w-10 place-items-center rounded-full bg-sovsky/15 text-sovsky"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(56,189,248,0.55)",
                "0 0 0 14px rgba(56,189,248,0)",
              ],
            }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <Cpu className="h-5 w-5" />
          </motion.div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Sovereign agent
            </p>
            <p className="mt-1 font-display text-base font-semibold">
              Classifying & prioritizing
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          OSINT + GEOINT fusion. The AI agent classifies the vessel, scores
          priority, and selects the next available SAR-capable bird.
        </p>
        <div className="mt-4 space-y-2 font-mono text-[11px] text-muted-foreground">
          <Line label="ais.hits" value="3 / 4" delay={0.55} />
          <Line label="agent.score" value="0.91" delay={0.7} />
          <Line label="next.bird" value="EDGE-SAR-07" delay={0.85} highlight />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Line({
  label,
  value,
  delay,
  highlight,
}: {
  label: string;
  value: string;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-baseline justify-between"
    >
      <span>{label}</span>
      <span className={highlight ? "text-gold" : "text-foreground"}>{value}</span>
    </motion.div>
  );
}
