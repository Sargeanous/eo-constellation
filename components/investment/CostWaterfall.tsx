"use client";
import { FOREIGN_VENDOR_BENCHMARK, palette } from "@/lib/data";

// Per-satellite cost comparison: foreign-vendor benchmark vs the EDGE
// SAR bird. The headline is the saving, not the absolute price. We
// deliberately do NOT show the $225M constellation grand total here:
// the operator wanted the per-satellite saving as the lede so MoD
// reads "sovereign at a fraction of the cost", not "another big budget
// line". The why-cheaper bullets sit beside the chart.

const W = 800;
const PAD_X = 24;
const ROW_H = 56;
const ROW_GAP = 18;
const TOP_PAD = 32;

function fmtUsd(n: number): string {
  return `$${(n / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`;
}

export function CostWaterfall() {
  const foreign = FOREIGN_VENDOR_BENCHMARK.perSatelliteUsd;
  const ours = FOREIGN_VENDOR_BENCHMARK.ourPerSatelliteUsd;
  const saving = FOREIGN_VENDOR_BENCHMARK.savingFraction;

  const span = W - PAD_X * 2;
  const fxToWidth = (n: number) => (n / foreign) * span;

  const foreignY = TOP_PAD + 18;
  const oursY = foreignY + ROW_H + ROW_GAP + 18;
  const SVG_H = oursY + ROW_H + 28;

  const oursW = Math.max(8, fxToWidth(ours));

  return (
    <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
      <svg
        viewBox={`0 0 ${W} ${SVG_H}`}
        className="w-full"
        role="img"
        aria-label="Per-satellite build cost: foreign vendor benchmark vs EDGE SAR"
      >
        {/* Foreign vendor row */}
        <text
          x={PAD_X}
          y={foreignY - 6}
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="10"
          fill={palette.textMuted}
        >
          FOREIGN VENDOR · PER SATELLITE
        </text>
        <rect
          x={PAD_X}
          y={foreignY}
          width={span}
          height={ROW_H}
          fill={palette.accentRed}
          fillOpacity="0.18"
          stroke={palette.accentRed}
          strokeOpacity="0.55"
          strokeWidth="0.7"
        />
        <text
          x={PAD_X + span - 12}
          y={foreignY + ROW_H / 2 + 5}
          textAnchor="end"
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="14"
          fontWeight="600"
          fill={palette.text}
        >
          {fmtUsd(foreign)}
        </text>

        {/* Ours row */}
        <text
          x={PAD_X}
          y={oursY - 6}
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="10"
          fill={palette.accentGold}
        >
          EDGE SAR · PER SATELLITE
        </text>
        <rect
          x={PAD_X}
          y={oursY}
          width={oursW}
          height={ROW_H}
          fill={palette.accentGold}
          fillOpacity="0.55"
          stroke={palette.accentGold}
          strokeOpacity="0.95"
          strokeWidth="0.8"
        />
        <text
          x={PAD_X + oursW + 10}
          y={oursY + ROW_H / 2 + 5}
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="14"
          fontWeight="600"
          fill={palette.accentGold}
        >
          {fmtUsd(ours)}
        </text>

        {/* Saving callout, anchored to the gap between the two bars */}
        <text
          x={PAD_X + span - 12}
          y={oursY + ROW_H + 18}
          textAnchor="end"
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="11"
          fill={palette.accentGreen}
        >
          {Math.round(saving * 100)}% saving · sovereign build
        </text>
      </svg>

      <div className="space-y-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Why this is cheaper
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Three structural reasons, not a discount.
          </p>
        </div>
        <ul className="space-y-2">
          {FOREIGN_VENDOR_BENCHMARK.whyCheaperBullets.map((b) => (
            <li
              key={b.title}
              className="rounded-md border border-border bg-background px-3 py-2"
            >
              <p className="text-sm text-foreground">{b.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
