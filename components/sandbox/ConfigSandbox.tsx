"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SIMULATION_CONFIGS, palette } from "@/lib/data";

// Interactive teaching tool. Move the inclination slider 36° -> 44°
// and a tiny bar chart updates with the interpolated revisit time
// (PRD §5: "Interpolated from 4 simulation runs"). The slider does
// NOT re-render the 3D globe -- the canonical 22-SAR / 38° geometry
// is the platform's truth, and the sandbox is a "why this and not
// something else" explainer.

const I_MIN = 36;
const I_MAX = 44;
const STEP = 0.5;

// Curve fit for the 12 SAR + 12 Optical baseline series:
//   38° -> 1.5h, 40° -> 1.6h, 42° -> 1.7h
// Slope = +0.05 h/° (gently worse with higher inclination because
// MENA passes get fewer per day). Linear extrapolation either side.
function interpRevisitH(inclinationDeg: number): number {
  return +(1.5 + (inclinationDeg - 38) * 0.05).toFixed(2);
}

// 5 anchor inclinations for the bar chart.
const BAR_INCLS = [36, 38, 40, 42, 44];

// The selected canonical config (22 SAR @ 38°, 1.03h) is plotted as
// a separate gold marker so the Chairman can see "we beat the curve
// because we changed the payload, not the inclination".
const SELECTED = SIMULATION_CONFIGS.find((c) => c.selected)!;

export function ConfigSandbox() {
  const [inclination, setInclination] = useState(38);
  const interp = interpRevisitH(inclination);
  const allRevisitsH = BAR_INCLS.map(interpRevisitH);
  const maxH = Math.max(...allRevisitsH, 1.8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Why 38°?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Move the slider. The bars below show the interpolated MENA-region
          average revisit for a 12 SAR + 12 Optical baseline at each
          inclination. Our final 22-SAR-only configuration sits well below
          the curve: that is the gold marker.
        </p>

        {/* Slider */}
        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <label htmlFor="incl">Inclination</label>
            <span className="font-mono text-gold">
              {inclination.toFixed(1)}°
            </span>
          </div>
          <Slider
            id="incl"
            min={I_MIN}
            max={I_MAX}
            step={STEP}
            value={[inclination]}
            onValueChange={([v]) => v != null && setInclination(v)}
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>{I_MIN}°</span>
            <span>{I_MAX}°</span>
          </div>
        </div>

        {/* Interpolated value */}
        <div className="grid grid-cols-2 gap-px rounded-md border border-border bg-border">
          <div className="bg-card p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Baseline revisit
            </p>
            <p className="mt-1 font-display text-2xl font-semibold">
              {interp.toFixed(2)}h
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              12 SAR + 12 Optical · interpolated
            </p>
          </div>
          <div className="bg-card p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Selected · 22 SAR @ 38°
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-gold">
              {SELECTED.avgRevisitH.toFixed(2)}h
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              cost-optimized
            </p>
          </div>
        </div>

        {/* Tiny bar chart */}
        <BarChart
          incls={BAR_INCLS}
          values={allRevisitsH}
          maxH={maxH}
          selectedIncl={inclination}
          benchmarkH={SELECTED.avgRevisitH}
        />

        <p className="text-[11px] italic text-muted-foreground">
          Interpolated from 4 simulation runs. Full physics in{" "}
          partner physics simulator.
        </p>
      </CardContent>
    </Card>
  );
}

interface BarChartProps {
  incls: number[];
  values: number[];
  maxH: number;
  selectedIncl: number;
  benchmarkH: number;
}

function BarChart({
  incls,
  values,
  maxH,
  selectedIncl,
  benchmarkH,
}: BarChartProps) {
  // Find the bar nearest the slider value to highlight it.
  const nearestIdx = incls.reduce(
    (best, val, i) =>
      Math.abs(val - selectedIncl) < Math.abs(incls[best]! - selectedIncl)
        ? i
        : best,
    0,
  );

  const W = 320;
  const H = 120;
  const PAD_X = 24;
  const PAD_TOP = 12;
  const PAD_BOTTOM = 22;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  const plotW = W - PAD_X * 2;
  const slot = plotW / incls.length;
  const barW = slot * 0.62;

  const hToY = (h: number) =>
    PAD_TOP + plotH - (h / maxH) * plotH;
  const benchmarkY = hToY(benchmarkH);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Revisit time by inclination"
    >
      {/* Bars */}
      {incls.map((deg, i) => {
        const cx = PAD_X + i * slot + slot / 2;
        const x = cx - barW / 2;
        const y = hToY(values[i]!);
        const h = PAD_TOP + plotH - y;
        const isSelected = i === nearestIdx;
        return (
          <g key={deg}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              fill={isSelected ? palette.accentSky : palette.accentSky}
              fillOpacity={isSelected ? 0.55 : 0.22}
              stroke={palette.accentSky}
              strokeOpacity={isSelected ? 0.95 : 0.5}
              strokeWidth="0.8"
            />
            <text
              x={cx}
              y={y - 4}
              textAnchor="middle"
              fontFamily="ui-monospace, Menlo, monospace"
              fontSize="9"
              fill={isSelected ? palette.accentSky : palette.textMuted}
            >
              {values[i]!.toFixed(2)}h
            </text>
            <text
              x={cx}
              y={H - 6}
              textAnchor="middle"
              fontFamily="ui-monospace, Menlo, monospace"
              fontSize="9"
              fill={palette.textMuted}
            >
              {deg}°
            </text>
          </g>
        );
      })}

      {/* Gold benchmark line for the 22-SAR selection */}
      <line
        x1={PAD_X}
        x2={W - PAD_X}
        y1={benchmarkY}
        y2={benchmarkY}
        stroke={palette.accentGold}
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <text
        x={W - PAD_X - 4}
        y={benchmarkY - 4}
        textAnchor="end"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="9"
        fill={palette.accentGold}
      >
        22 SAR · {benchmarkH.toFixed(2)}h
      </text>
    </svg>
  );
}
