"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";
import {
  STATUS_QUO_FRICTIONS,
  EOC_TIMELINE,
  STATUS_QUO_HOURS,
  FINAL_MISSION_TIME,
  SPEEDUP_PCT,
  palette,
} from "@/lib/data";

// PRD §6: the side-by-side comparison. Both timelines share a 0-80h
// horizontal scale so the EO-CONSTELLATION row reads as a sliver
// against the status quo's full bar. That sliver is the screenshot
// MoD remembers.
//
// Plain SVG over Recharts: Recharts adds layout overhead for what is
// just two stacked horizontal segments at known positions, and we get
// perfect scale alignment between the two rows.

const SCALE_H = 80; // hours on the x-axis
const SVG_W = 760;
const SVG_PAD_X = 24;
const SVG_BAR_H = 36;
const SVG_BAR_GAP = 18;

function hoursToX(h: number): number {
  const span = SVG_W - SVG_PAD_X * 2;
  return SVG_PAD_X + (h / SCALE_H) * span;
}
function hoursToWidth(h: number): number {
  const span = SVG_W - SVG_PAD_X * 2;
  return Math.max(2, (h / SCALE_H) * span);
}

export default function ProblemPage() {
  const statusQuoEnd = STATUS_QUO_HOURS;
  const eocEnd =
    EOC_TIMELINE[EOC_TIMELINE.length - 1]?.hours[1] ?? 1;
  const eocPercent = ((eocEnd / statusQuoEnd) * 100).toFixed(2);

  const totalRows = 2;
  const svgH = SVG_BAR_GAP * 3 + SVG_BAR_H * totalRows + 40;

  return (
    <main className="min-h-screen px-8 py-16 pb-32">
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl space-y-12"
      >
        <motion.header variants={CHILD_RISE}>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            01 / Problem
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {STATUS_QUO_HOURS}+ hours today.{" "}
            <span className="text-gold">{FINAL_MISSION_TIME}</span> with
            EO-CONSTELLATION.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            You&apos;ve tried this before. Here&apos;s why it failed: and why
            this time is different.
          </p>
        </motion.header>

        {/* Gigantic comparison block */}
        <motion.div
          variants={CHILD_RISE}
          className="grid grid-cols-1 items-center gap-6 rounded-xl border border-border bg-card p-8 md:grid-cols-[1fr_auto_1fr]"
        >
          <div className="text-center md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Status quo
            </p>
            <p className="mt-1 tabular font-mono text-5xl font-semibold text-muted-foreground md:text-6xl">
              {STATUS_QUO_HOURS}+ h
            </p>
          </div>
          <ArrowRight className="mx-auto h-8 w-8 text-gold" />
          <div className="text-center md:text-left">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              EO-CONSTELLATION
            </p>
            <p className="mt-1 tabular font-mono text-5xl font-semibold text-gold md:text-6xl">
              {FINAL_MISSION_TIME}
            </p>
          </div>
          <p className="md:col-span-3 text-center font-display text-base text-amber md:text-lg">
            EO-CONSTELLATION is {eocPercent}% the duration. You are{" "}
            {SPEEDUP_PCT.toLocaleString()}% faster.
          </p>
        </motion.div>

        {/* Side-by-side timeline at shared 0-80h scale */}
        <motion.div
          variants={CHILD_RISE}
          className="space-y-3 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Same scale · 0-{SCALE_H}h
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              hours →
            </p>
          </div>

          <svg
            viewBox={`0 0 ${SVG_W} ${svgH}`}
            className="w-full"
            role="img"
            aria-label="Status quo vs EO-CONSTELLATION timeline at the same scale"
          >
            {/* Hour grid lines + labels */}
            {[0, 12, 24, 36, 48, 60, 72].map((h) => (
              <g key={h}>
                <line
                  x1={hoursToX(h)}
                  y1={0}
                  x2={hoursToX(h)}
                  y2={svgH - 24}
                  stroke={palette.borderSubtle}
                  strokeWidth="0.5"
                />
                <text
                  x={hoursToX(h)}
                  y={svgH - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                  fill={palette.textMuted}
                >
                  {h}
                </text>
              </g>
            ))}

            {/* Row 1: status quo */}
            <g transform={`translate(0 ${SVG_BAR_GAP})`}>
              <text
                x={SVG_PAD_X}
                y={-4}
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fill={palette.accentRed}
                opacity="0.85"
              >
                STATUS QUO · 72+ HOURS
              </text>
              {STATUS_QUO_FRICTIONS.map((f, i) => {
                const x = hoursToX(f.hours[0]);
                const w = hoursToWidth(f.hours[1] - f.hours[0]);
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={0}
                      width={w}
                      height={SVG_BAR_H}
                      fill={palette.accentRed}
                      fillOpacity={0.18 + i * 0.07}
                      stroke={palette.accentRed}
                      strokeOpacity="0.5"
                      strokeWidth="0.6"
                    />
                  </g>
                );
              })}
              {/* The trailing "+" past 72h */}
              <text
                x={hoursToX(STATUS_QUO_HOURS) + 6}
                y={SVG_BAR_H / 2 + 4}
                fontSize="14"
                fontFamily="ui-monospace, monospace"
                fill={palette.accentRed}
              >
                +
              </text>
            </g>

            {/* Row 2: EO-CONSTELLATION */}
            <g
              transform={`translate(0 ${
                SVG_BAR_GAP * 2 + SVG_BAR_H
              })`}
            >
              <text
                x={SVG_PAD_X}
                y={-4}
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fill={palette.accentGold}
                opacity="0.85"
              >
                EO-CONSTELLATION · 58:42
              </text>
              {EOC_TIMELINE.map((seg, i) => {
                const x = hoursToX(seg.hours[0]);
                const w = hoursToWidth(seg.hours[1] - seg.hours[0]);
                return (
                  <rect
                    key={i}
                    x={x}
                    y={0}
                    width={w}
                    height={SVG_BAR_H}
                    fill={palette.accentGreen}
                    fillOpacity={0.4 + i * 0.12}
                    stroke={palette.accentGreen}
                    strokeOpacity="0.6"
                    strokeWidth="0.6"
                  />
                );
              })}
              {/* Annotation pointing at the sliver */}
              <line
                x1={hoursToX(eocEnd) + 4}
                y1={SVG_BAR_H / 2}
                x2={hoursToX(eocEnd) + 60}
                y2={-12}
                stroke={palette.accentGold}
                strokeWidth="0.7"
              />
              <text
                x={hoursToX(eocEnd) + 64}
                y={-12}
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                fill={palette.accentGold}
              >
                {eocPercent}% of status-quo width
              </text>
            </g>
          </svg>
        </motion.div>

        {/* Itemised friction (status quo) + check (EOC) lists */}
        <motion.div
          variants={CHILD_RISE}
          className="grid gap-6 md:grid-cols-2"
        >
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="mr-2 text-sovred">●</span>
              How it works today
            </p>
            <ul className="space-y-2">
              {STATUS_QUO_FRICTIONS.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-sovred/30 bg-sovred/5 p-3"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-sovred" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-mono text-xs text-sovred">
                        {f.hours[0]}-{f.hours[1]}h
                      </span>
                      <span className="ml-3">{f.label}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {f.friction}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="mr-2 text-sovgreen">●</span>
              How it works with EO-CONSTELLATION
            </p>
            <ul className="space-y-2">
              {EOC_TIMELINE.map((seg, i) => {
                const start = Math.round(seg.hours[0] * 60);
                const end = Math.round(seg.hours[1] * 60);
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-md border border-sovgreen/30 bg-sovgreen/5 p-3"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sovgreen" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-mono text-xs text-sovgreen">
                          {start}-{end} min
                        </span>
                        <span className="ml-3">{seg.label}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {seg.friction}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        <motion.div variants={CHILD_RISE} className="flex justify-end">
          <Button asChild>
            <Link href="/mission">Continue</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
