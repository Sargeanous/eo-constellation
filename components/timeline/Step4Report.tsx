"use client";
import { motion } from "framer-motion";
import { REPORT_HEADER, REPORT_FOOTER, FINAL_MISSION_TIME } from "@/lib/data";
import { SARScene, SAR_VESSELS } from "./SARScene";

// Step 4: Report on Desk/Screen. PRD §4.
// 1-page A-aspect preview slides up. Header + cover image + summary +
// recommended action + footer. Branded per §13.3 (locked):
//   header: "EDGE Sovereign EO Constellation: Mission Report"
//   footer: "Powered by Origen | A TACTICA Capability"

export function Step4Report() {
  const date = "5 May 2026";

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="flex w-full justify-center"
    >
      <div className="relative w-full max-w-[480px]">
        {/* Stacked-paper shadow */}
        <div className="absolute inset-x-3 top-3 bottom-0 rounded-md bg-black/40 blur-sm" />

        <div
          className="selectable relative aspect-[1/1.414] overflow-hidden rounded-md bg-[#F8FAFC] text-[#0F172A] shadow-2xl"
          role="document"
          aria-label="EDGE Sovereign EO Constellation Mission Report"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#0F172A]/15 px-5 py-3">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#0F172A]/60">
                Mission report
              </p>
              <p className="mt-0.5 font-display text-[12px] font-semibold leading-tight">
                {REPORT_HEADER}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#0F172A]/60">
                {date}
              </p>
              <p className="mt-0.5 font-mono text-[8px] text-[#0F172A]/60">
                Classification · Restricted
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-3 px-5 py-3">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#0F172A]/60">
                Subject
              </p>
              <p className="font-display text-[14px] font-semibold">
                Strait of Hormuz: vessel of interest
              </p>
              <p className="mt-0.5 font-mono text-[8px] text-[#0F172A]/60">
                26.57°N · 56.25°E · EDGE-SAR-07 · spotlight 0.3 m
              </p>
            </div>

            {/* Cover image: the SAR scene with bounding boxes baked in */}
            <div className="relative">
              <div className="overflow-hidden rounded">
                <SARScene steady />
              </div>
              <div className="pointer-events-none absolute inset-0">
                {SAR_VESSELS.map((v, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${((v.x - 6) / 600) * 100}%`,
                      top: `${((v.y - 6) / 400) * 100}%`,
                      width: `${((v.w + 12) / 600) * 100}%`,
                      height: `${((v.h + 12) / 400) * 100}%`,
                      border: "1px solid #D4A949",
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#0F172A]/60">
                Summary
              </p>
              <p className="mt-1 text-[10px] leading-snug text-[#0F172A]">
                Three vessels detected within the cued AOI. One container
                ship (89%), one frigate (76%), one tanker (82%). No vessels
                under AIS dark mode. Classifications generated on-board by
                sovereign CV; no foreign cloud egress.
              </p>
            </div>

            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#0F172A]/60">
                Recommended action
              </p>
              <p className="mt-1 text-[10px] leading-snug text-[#0F172A]">
                Maintain re-tasking cadence on the frigate (priority track).
                Re-image at next ascending pass (T + 47 min) for movement
                vector confirmation.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#0F172A]/15 pt-2">
              <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#0F172A]/60">
                End-to-end
              </p>
              <p className="font-display text-[14px] font-semibold text-[#0F172A]">
                {FINAL_MISSION_TIME}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute inset-x-0 bottom-0 border-t border-[#0F172A]/15 px-5 py-2">
            <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-[#0F172A]/55">
              {REPORT_FOOTER}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
