"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIMELINE_PHASES, palette } from "@/lib/data";

// 27-month Gantt strip. Three phases over a Year 1 / Year 2 axis.
// Tap a phase row to reveal sub-tasks. PRD §7.

const TOTAL_MONTHS = 30; // Year 1 + Year 2 + 6m of operations runoff
const W = 820;
const PAD_LEFT = 110;
const PAD_RIGHT = 24;
const ROW_H = 56;
const ROW_GAP = 14;

const PHASE_COLORS = {
  design: palette.accentSky,
  execution: palette.accentGold,
  operations: palette.accentGreen,
} as const;

function monthToX(m: number): number {
  const span = W - PAD_LEFT - PAD_RIGHT;
  return PAD_LEFT + (m / TOTAL_MONTHS) * span;
}

export function Timeline27() {
  const [openPhase, setOpenPhase] = useState<string | null>(null);

  const svgH = ROW_GAP + (ROW_H + ROW_GAP) * TIMELINE_PHASES.length + 50;

  return (
    <div className="space-y-4">
      <svg
        viewBox={`0 0 ${W} ${svgH}`}
        className="w-full"
        role="img"
        aria-label="27-month implementation timeline"
      >
        {/* Year axis */}
        {[0, 6, 12, 18, 24, 27].map((m) => {
          const isYear = m % 12 === 0;
          return (
            <g key={m}>
              <line
                x1={monthToX(m)}
                y1={ROW_GAP - 6}
                x2={monthToX(m)}
                y2={svgH - 30}
                stroke={palette.borderSubtle}
                strokeWidth={isYear ? 0.8 : 0.4}
                strokeDasharray={isYear ? "0" : "2 4"}
              />
              <text
                x={monthToX(m)}
                y={svgH - 14}
                textAnchor="middle"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fill={palette.textMuted}
              >
                M{m}
              </text>
            </g>
          );
        })}
        {/* Phase 1 / Phase 2 dividers */}
        <text
          x={monthToX(4.5)}
          y={svgH - 30}
          textAnchor="middle"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          fill={palette.textMuted}
        >
          YEAR 1
        </text>
        <text
          x={monthToX(18)}
          y={svgH - 30}
          textAnchor="middle"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          fill={palette.textMuted}
        >
          YEAR 2
        </text>
        <text
          x={monthToX(28)}
          y={svgH - 30}
          textAnchor="middle"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          fill={palette.textMuted}
        >
          OPS
        </text>

        {/* Phase rows */}
        {TIMELINE_PHASES.map((phase, i) => {
          const y = ROW_GAP + i * (ROW_H + ROW_GAP);
          const start = phase.startMonth;
          const end = phase.durationMonths
            ? phase.startMonth + phase.durationMonths
            : TOTAL_MONTHS;
          const x = monthToX(start);
          const w = monthToX(end) - x;
          const color = PHASE_COLORS[phase.id];
          const isOpen = openPhase === phase.id;

          return (
            <g
              key={phase.id}
              onClick={() => setOpenPhase(isOpen ? null : phase.id)}
              style={{ cursor: "pointer" }}
            >
              {/* Phase label on the left */}
              <text
                x={PAD_LEFT - 12}
                y={y + ROW_H / 2 + 4}
                textAnchor="end"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fill={isOpen ? palette.text : palette.textMuted}
              >
                {phase.id.toUpperCase()}
              </text>
              <text
                x={PAD_LEFT - 12}
                y={y + ROW_H / 2 - 8}
                textAnchor="end"
                fontSize="9"
                fontFamily="ui-monospace, monospace"
                fill={palette.textMuted}
              >
                {phase.durationMonths
                  ? `${phase.durationMonths} mo`
                  : "ongoing"}
              </text>

              {/* Phase bar */}
              <rect
                x={x}
                y={y + ROW_H / 2 - 14}
                width={w}
                height={28}
                fill={color}
                fillOpacity={isOpen ? 0.45 : 0.28}
                stroke={color}
                strokeOpacity="0.9"
                strokeWidth="0.8"
                rx="3"
              />
              <text
                x={x + 10}
                y={y + ROW_H / 2 + 4}
                fontSize="11"
                fontFamily="ui-monospace, monospace"
                fill={palette.text}
              >
                {phase.name}
              </text>

              {/* Sub-task ticks (faint) */}
              {phase.tasks.map((t, ti) => {
                const tStart = monthToX(t.months[0]);
                const tEnd =
                  t.months[1] === null
                    ? monthToX(TOTAL_MONTHS)
                    : monthToX(t.months[1]);
                return (
                  <line
                    key={ti}
                    x1={tStart}
                    y1={y + ROW_H / 2 + 16}
                    x2={tEnd}
                    y2={y + ROW_H / 2 + 16}
                    stroke={color}
                    strokeOpacity="0.55"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Open phase: show its task list below the chart */}
      <AnimatePresence mode="wait">
        {openPhase && (
          <motion.div
            key={openPhase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="rounded-md border border-border bg-card p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {openPhase} · sub-tasks
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-1 text-sm md:grid-cols-2">
              {TIMELINE_PHASES.find((p) => p.id === openPhase)?.tasks.map(
                (t, i) => {
                  const start = t.months[0];
                  const end = t.months[1];
                  return (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5"
                    >
                      <span>{t.name}</span>
                      <span className="tabular font-mono text-xs text-muted-foreground">
                        M{start}
                        {end !== null ? `-M${end}` : "+"}
                      </span>
                    </li>
                  );
                },
              )}
            </ul>
          </motion.div>
        )}
        {!openPhase && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground"
          >
            Tap a phase row to expand its sub-tasks.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
