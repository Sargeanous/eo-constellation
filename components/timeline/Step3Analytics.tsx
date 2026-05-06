"use client";
import { motion } from "framer-motion";
import { Cpu, ShieldCheck } from "lucide-react";
import { SARScene, SAR_VESSELS } from "./SARScene";
import { BaseerPill } from "./BaseerPill";

// Step 3: Automated Analytics & Validation. PRD §4.
// Bounding boxes around each detected vessel, classifications appear,
// caption: "Onboard CV models. No human in the loop. No foreign cloud."
// BASEER pill in the corner: detections feed back into BASEER.

export function Step3Analytics() {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="relative grid w-full gap-6 md:grid-cols-[1.4fr_1fr]"
    >
      <BaseerPill role="analytics" />
      <div className="relative">
        <SARScene steady />
        {/* Bounding boxes overlay: viewBox 600x400 in scene units; we
            render absolute-positioned boxes converted to %. */}
        <div className="pointer-events-none absolute inset-0">
          {SAR_VESSELS.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2 + i * 0.25,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute"
              style={{
                left: `${((v.x - 6) / 600) * 100}%`,
                top: `${((v.y - 6) / 400) * 100}%`,
                width: `${((v.w + 12) / 600) * 100}%`,
                height: `${((v.h + 12) / 400) * 100}%`,
              }}
            >
              <div className="absolute inset-0 rounded-sm border border-gold" />
              <p className="absolute -top-5 left-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
                {v.label} · {(v.confidence * 100).toFixed(0)}%
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Step 3 · Onboard analytics
          </p>
          <p className="mt-2 font-display text-base font-semibold">
            CV models on the bird. No human in the loop.
          </p>
        </div>

        <ul className="space-y-3 text-sm">
          {SAR_VESSELS.map((v, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.25 }}
              className="flex items-baseline justify-between rounded-md border border-border bg-background px-3 py-2"
            >
              <span>{v.label}</span>
              <span className="font-mono text-xs text-gold">
                {(v.confidence * 100).toFixed(0)}%
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2 rounded-md border border-border bg-background p-3">
            <Cpu className="h-4 w-4 text-sovsky" />
            <div>
              <p className="text-foreground">Onboard CV</p>
              <p className="text-muted-foreground">EDGE-SAR-07 GPU</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-md border border-border bg-background p-3">
            <ShieldCheck className="h-4 w-4 text-sovgreen" />
            <div>
              <p className="text-foreground">Sovereign cloud</p>
              <p className="text-muted-foreground">No foreign egress</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
