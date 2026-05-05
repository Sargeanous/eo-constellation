"use client";
import { COST_USD, CONSTELLATION, palette } from "@/lib/data";

// Horizontal stacked bar showing the cost buildup. Labels live ABOVE
// each segment with a leader line dropping into the bar, so the small
// Ops segment (~0.7% of width) stays legible. PRD §7 + operator
// feedback (2026-05-06).

const W = 800;
const BAR_TOP = 88;
const BAR_H = 56;
const PAD_X = 24;

function fmtUsd(n: number): string {
  return `$${(n / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`;
}

interface Segment {
  key: string;
  shortLabel: string;
  amount: number;
  fill: string;
  fillOp: number;
}

export function CostWaterfall() {
  const segments: Segment[] = [
    {
      key: "sats",
      shortLabel: `${CONSTELLATION.totalSatellites} × SAR satellites`,
      amount: COST_USD.satellitesTotal,
      fill: palette.accentSky,
      fillOp: 0.55,
    },
    {
      key: "ops",
      shortLabel: "Operations & Control",
      amount: COST_USD.opsAndControl,
      fill: palette.accentGold,
      fillOp: 0.85,
    },
  ];

  const total = COST_USD.grandTotal;
  const span = W - PAD_X * 2;

  // Pre-compute segment x ranges so we can reference them in labels.
  let cursor = PAD_X;
  const placed = segments.map((s) => {
    const w = (s.amount / total) * span;
    const x = cursor;
    cursor += w;
    return { ...s, x, w, midX: x + w / 2 };
  });

  // Total SVG height: top label band (40) + bar (56) + bottom label band (40) + grand-total (28)
  const SVG_H = BAR_TOP + BAR_H + 70;

  return (
    <div className="space-y-4">
      <svg
        viewBox={`0 0 ${W} ${SVG_H}`}
        className="w-full"
        role="img"
        aria-label="Cost buildup waterfall"
      >
        {/* Top labels with leader lines */}
        {placed.map((s, i) => {
          // For the small segment (Ops), shove the label slightly to the
          // right of the segment so it doesn't sit on the boundary.
          const labelX =
            s.w < 80 ? Math.min(s.x + s.w + 14, W - PAD_X - 80) : s.midX;
          const labelAnchor: "middle" | "start" =
            s.w < 80 ? "start" : "middle";
          const leaderTargetX = s.midX;
          return (
            <g key={`label-${i}`}>
              <text
                x={labelX}
                y={20}
                textAnchor={labelAnchor}
                fontFamily="ui-monospace, Menlo, monospace"
                fontSize="11"
                fill={palette.text}
              >
                {s.shortLabel}
              </text>
              <text
                x={labelX}
                y={36}
                textAnchor={labelAnchor}
                fontFamily="ui-monospace, Menlo, monospace"
                fontSize="13"
                fontWeight="600"
                fill={s.fill}
              >
                {fmtUsd(s.amount)}
              </text>
              {/* Leader line: from label down to the segment top */}
              <line
                x1={
                  labelAnchor === "middle"
                    ? labelX
                    : Math.min(labelX, leaderTargetX)
                }
                y1={44}
                x2={leaderTargetX}
                y2={BAR_TOP - 2}
                stroke={s.fill}
                strokeOpacity="0.55"
                strokeWidth="0.8"
              />
            </g>
          );
        })}

        {/* The bar itself */}
        {placed.map((s, i) => (
          <rect
            key={`seg-${i}`}
            x={s.x}
            y={BAR_TOP}
            width={s.w}
            height={BAR_H}
            fill={s.fill}
            fillOpacity={s.fillOp}
            stroke={s.fill}
            strokeOpacity="0.9"
            strokeWidth="0.7"
          />
        ))}

        {/* Grand-total annotation below the bar */}
        <g transform={`translate(0 ${BAR_TOP + BAR_H + 18})`}>
          <line
            x1={PAD_X}
            y1={0}
            x2={PAD_X + span}
            y2={0}
            stroke={palette.accentGold}
            strokeOpacity="0.6"
            strokeWidth="0.7"
          />
          <text
            x={PAD_X + span / 2}
            y={22}
            textAnchor="middle"
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="14"
            fontWeight="600"
            fill={palette.accentGold}
          >
            Grand total · {fmtUsd(total)}
          </text>
        </g>
      </svg>

      <p className="rounded-md border border-border bg-card/40 px-4 py-3 text-sm italic text-muted-foreground">
        {COST_USD.marketComparisonNote} The 350 km altitude is the lever:
        lower mass, lower launch cost, faster iteration.
      </p>
    </div>
  );
}
