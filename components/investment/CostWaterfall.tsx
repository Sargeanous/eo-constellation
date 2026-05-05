"use client";
import { COST_USD, CONSTELLATION, palette } from "@/lib/data";

// Horizontal stacked bar showing the cost buildup. Plain SVG over
// Recharts: we want exact control over segment widths, labels, and
// the call-out tooltip on the right. Numbers from COST_USD.

const W = 800;
const H = 90;
const PAD_X = 24;

function fmtUsd(n: number): string {
  return `$${(n / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`;
}

export function CostWaterfall() {
  const segments = [
    {
      key: "sats",
      label: `${CONSTELLATION.totalSatellites} × SAR satellites @ ${fmtUsd(COST_USD.perSatellite)}`,
      shortLabel: "22 × SAR satellites",
      amount: COST_USD.satellitesTotal,
      fill: palette.accentSky,
      fillOp: 0.55,
    },
    {
      key: "ops",
      label: "Operations & Control System",
      shortLabel: "Ops & Control",
      amount: COST_USD.opsAndControl,
      fill: palette.accentGold,
      fillOp: 0.85,
    },
  ];

  const total = COST_USD.grandTotal;
  const span = W - PAD_X * 2;
  let cursor = PAD_X;

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${W} ${H + 40}`} className="w-full" role="img" aria-label="Cost buildup waterfall">
        {/* The single horizontal stacked bar */}
        <g transform={`translate(0 12)`}>
          {segments.map((s) => {
            const w = (s.amount / total) * span;
            const x = cursor;
            cursor += w;
            return (
              <g key={s.key}>
                <rect
                  x={x}
                  y={0}
                  width={w}
                  height={H * 0.55}
                  fill={s.fill}
                  fillOpacity={s.fillOp}
                  stroke={s.fill}
                  strokeOpacity="0.85"
                  strokeWidth="0.7"
                />
                <text
                  x={x + 8}
                  y={H * 0.55 / 2 + 4}
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  fill={palette.text}
                >
                  {s.shortLabel}
                </text>
                <text
                  x={x + 8}
                  y={H * 0.55 + 16}
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  fill={s.fill}
                >
                  {fmtUsd(s.amount)}
                </text>
              </g>
            );
          })}
          {/* End-cap: grand total label */}
          <text
            x={PAD_X + span}
            y={H * 0.55 / 2 + 4}
            textAnchor="end"
            fontSize="14"
            fontFamily="ui-monospace, monospace"
            fontWeight="600"
            fill={palette.accentGold}
            transform={`translate(0 0)`}
            opacity="0"
          >
            {fmtUsd(total)}
          </text>
        </g>
        {/* Total annotation below */}
        <g transform={`translate(0 ${H + 4})`}>
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
            y={18}
            textAnchor="middle"
            fontSize="13"
            fontFamily="ui-monospace, monospace"
            fontWeight="600"
            fill={palette.accentGold}
          >
            Grand total · {fmtUsd(total)}
          </text>
        </g>
      </svg>

      <p className="rounded-md border border-border bg-card/40 px-4 py-3 text-sm italic text-muted-foreground">
        {COST_USD.marketComparisonNote} The 350 km altitude is the lever —
        lower mass, lower launch cost, faster iteration.
      </p>
    </div>
  );
}
