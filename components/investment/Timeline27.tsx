"use client";
import { TIMELINE_PHASES, palette } from "@/lib/data";

// Implementation Gantt with two viewing modes:
//
//   "scratch" - the canonical 22-bird programme as a green-field build.
//               Full saturation, all phase bars and task ranges visible.
//
//   "now"     - same chart structure, but every phase / task bar is
//               dimmed to a near-invisible ghost. A bright dashed gold
//               rectangle from M14 -> M20 (six months wide) overlays
//               the chart: left border labelled WE ARE NOW, right
//               border labelled SATELLITE FLYING. The visual point is
//               that the partner is mid-build today and the deposit
//               drops us straight into the back end of an in-flight
//               line - operational in six months instead of waiting
//               out the full programme.
//
// Both modes share the same geometry so the toggle reads as a seamless
// emphasis swap, not a chart switch.

const TOTAL_MONTHS = 24;
const W = 880;
const PAD_LEFT = 240;
const PAD_RIGHT = 24;
const PAD_TOP = 32;
const PAD_BOTTOM = 36;

const PHASE_HEADER_H = 32;
const TASK_ROW_H = 22;
const PHASE_GAP = 14;

const NOW_WINDOW = { startMonth: 14, endMonth: 20 } as const;

const PHASE_COLORS = {
  design: palette.accentSky,
  execution: palette.accentGold,
  operations: palette.accentGreen,
} as const;

function monthToX(m: number): number {
  const span = W - PAD_LEFT - PAD_RIGHT;
  return PAD_LEFT + (m / TOTAL_MONTHS) * span;
}

export type TimelineMode = "scratch" | "now";

interface Timeline27Props {
  mode?: TimelineMode;
}

export function Timeline27({ mode = "scratch" }: Timeline27Props) {
  type Row =
    | { kind: "phase"; phase: (typeof TIMELINE_PHASES)[number]; y: number }
    | {
        kind: "task";
        phaseId: keyof typeof PHASE_COLORS;
        task: (typeof TIMELINE_PHASES)[number]["tasks"][number];
        y: number;
      };

  const rows: Row[] = [];
  let cursorY = PAD_TOP;
  for (const phase of TIMELINE_PHASES) {
    rows.push({ kind: "phase", phase, y: cursorY });
    cursorY += PHASE_HEADER_H;
    for (const task of phase.tasks) {
      rows.push({ kind: "task", phaseId: phase.id, task, y: cursorY });
      cursorY += TASK_ROW_H;
    }
    cursorY += PHASE_GAP;
  }
  const svgH = cursorY + PAD_BOTTOM;
  const axisY = svgH - PAD_BOTTOM;

  // Dim factor applied to every saturation/alpha in "now" mode. CSS
  // transition on opacity gives the seamless mode swap.
  const isNow = mode === "now";

  return (
    <div className="space-y-4">
      <svg
        viewBox={`0 0 ${W} ${svgH}`}
        className="w-full"
        role="img"
        aria-label={
          isNow
            ? "Implementation timeline with the partner build window highlighted"
            : "Implementation timeline, full programme"
        }
      >
        {/* Body group: dimmed in "now" mode so the highlight rectangle
            owns the eye. CSS transition keeps the swap seamless. */}
        <g
          style={{
            opacity: isNow ? 0.18 : 1,
            transition: "opacity 0.45s ease",
          }}
        >
          {/* Vertical month axis lines */}
          {[0, 6, 12, 18, 20].map((m) => {
            const isYear = m % 12 === 0 || m === 20;
            return (
              <line
                key={m}
                x1={monthToX(m)}
                y1={PAD_TOP - 12}
                x2={monthToX(m)}
                y2={axisY}
                stroke={palette.borderSubtle}
                strokeWidth={isYear ? 0.8 : 0.4}
                strokeDasharray={isYear ? "0" : "2 4"}
              />
            );
          })}

          {/* Year labels */}
          <g
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="9"
            fill={palette.textMuted}
          >
            <text x={monthToX(6)} y={PAD_TOP - 18} textAnchor="middle">
              YEAR 1
            </text>
            <text x={monthToX(16)} y={PAD_TOP - 18} textAnchor="middle">
              YEAR 2
            </text>
            <text x={monthToX(22)} y={PAD_TOP - 18} textAnchor="middle">
              OPS
            </text>
          </g>

          {/* Phase rows + task rows */}
          {rows.map((row, i) => {
            if (row.kind === "phase") {
              const start = row.phase.startMonth;
              const end = row.phase.durationMonths
                ? row.phase.startMonth + row.phase.durationMonths
                : TOTAL_MONTHS;
              const x = monthToX(start);
              const w = monthToX(end) - x;
              const color = PHASE_COLORS[row.phase.id];
              return (
                <g key={`phase-${i}`}>
                  <text
                    x={PAD_LEFT - 12}
                    y={row.y + PHASE_HEADER_H / 2 + 4}
                    textAnchor="end"
                    fontFamily="ui-monospace, Menlo, monospace"
                    fontSize="11"
                    fontWeight="600"
                    fill={palette.text}
                  >
                    {row.phase.name.toUpperCase()}
                  </text>
                  <text
                    x={PAD_LEFT - 12}
                    y={row.y + PHASE_HEADER_H / 2 - 9}
                    textAnchor="end"
                    fontFamily="ui-monospace, Menlo, monospace"
                    fontSize="9"
                    fill={palette.textMuted}
                  >
                    {row.phase.durationMonths
                      ? `${row.phase.durationMonths} months`
                      : "ongoing"}
                  </text>
                  <rect
                    x={x}
                    y={row.y + 4}
                    width={w}
                    height={PHASE_HEADER_H - 8}
                    fill={color}
                    fillOpacity={0.32}
                    stroke={color}
                    strokeOpacity="0.85"
                    strokeWidth="0.8"
                    rx="3"
                  />
                </g>
              );
            }

            const tStart = monthToX(row.task.months[0]);
            const tEnd =
              row.task.months[1] === null
                ? monthToX(TOTAL_MONTHS)
                : monthToX(row.task.months[1]);
            const tw = Math.max(2, tEnd - tStart);
            const color = PHASE_COLORS[row.phaseId];
            const start = row.task.months[0];
            const end = row.task.months[1];
            const range =
              end === null
                ? `M${start}+`
                : start === end
                  ? `M${start}`
                  : `M${start}-M${end}`;
            return (
              <g key={`task-${i}`}>
                <text
                  x={PAD_LEFT - 12}
                  y={row.y + TASK_ROW_H / 2 + 3.5}
                  textAnchor="end"
                  fontFamily="ui-monospace, Menlo, monospace"
                  fontSize="10"
                  fill={palette.textMuted}
                >
                  {row.task.name}
                </text>
                <rect
                  x={tStart}
                  y={row.y + 6}
                  width={tw}
                  height={TASK_ROW_H - 12}
                  fill={color}
                  fillOpacity="0.7"
                  rx="2"
                />
                <text
                  x={tEnd + 6}
                  y={row.y + TASK_ROW_H / 2 + 3.5}
                  fontFamily="ui-monospace, Menlo, monospace"
                  fontSize="9"
                  fill={palette.textMuted}
                >
                  {range}
                </text>
              </g>
            );
          })}

          {/* Month axis labels */}
          {[0, 6, 12, 18, 20].map((m) => (
            <text
              key={`axis-${m}`}
              x={monthToX(m)}
              y={axisY + 18}
              textAnchor="middle"
              fontFamily="ui-monospace, Menlo, monospace"
              fontSize="10"
              fill={palette.textMuted}
            >
              M{m}
            </text>
          ))}
        </g>

        {/* "Now" overlay: dashed rectangle + edge labels. Fades in
            seamlessly when the mode flips. */}
        <g
          style={{
            opacity: isNow ? 1 : 0,
            transition: "opacity 0.45s ease",
            pointerEvents: "none",
          }}
        >
          <NowWindow axisY={axisY} />
        </g>
      </svg>
    </div>
  );
}

function NowWindow({ axisY }: { axisY: number }) {
  const xL = monthToX(NOW_WINDOW.startMonth);
  const xR = monthToX(NOW_WINDOW.endMonth);
  const yT = PAD_TOP - 6;
  const yB = axisY + 4;

  return (
    <g>
      {/* Dashed rectangle frame */}
      <rect
        x={xL}
        y={yT}
        width={xR - xL}
        height={yB - yT}
        fill={palette.accentGold}
        fillOpacity="0.06"
        stroke={palette.accentGold}
        strokeWidth="1.6"
        strokeDasharray="6 5"
        rx="2"
      />

      {/* Left border label: "WE ARE NOW" */}
      <g>
        <text
          x={xL + 8}
          y={yT - 6}
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="10"
          fontWeight="600"
          fill={palette.accentGold}
        >
          ◆ WE ARE NOW · M{NOW_WINDOW.startMonth}
        </text>
        <text
          x={xL + 8}
          y={yB + 16}
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="9"
          fill={palette.accentGold}
          opacity="0.8"
        >
          deposit locks the slot
        </text>
      </g>

      {/* Right border label: "SATELLITE FLYING" */}
      <g>
        <text
          x={xR - 8}
          y={yT - 6}
          textAnchor="end"
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="10"
          fontWeight="600"
          fill={palette.accentGold}
        >
          SATELLITE FLYING · M{NOW_WINDOW.endMonth} ◆
        </text>
        <text
          x={xR - 8}
          y={yB + 16}
          textAnchor="end"
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="9"
          fill={palette.accentGold}
          opacity="0.8"
        >
          first light · sovereign data
        </text>
      </g>

      {/* Span caption mid-window */}
      <text
        x={(xL + xR) / 2}
        y={(yT + yB) / 2}
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="11"
        fontWeight="600"
        fill={palette.accentGold}
      >
        6 MONTHS · partner build already in flight
      </text>
    </g>
  );
}
