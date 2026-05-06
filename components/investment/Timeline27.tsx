"use client";
import { TIMELINE_PHASES, palette } from "@/lib/data";

// Implementation Gantt with two viewing modes:
//
//   "scratch" - the canonical 22-bird programme as a green-field build.
//               Full saturation, all phase bars and task ranges visible.
//
//   "now"     - same chart structure, but the design + operations rows
//               dim to ghosts. The Mission Execution phase + its tasks
//               stay at full saturation - that's where the partner is
//               today, mid-build. A dashed gold rectangle from M14 ->
//               M20 frames the six-month "if enabled now" window:
//                 * left border  = WE ARE NOW (M14)
//                 * right border = SATELLITE FLYING (M20, first light)
//
// Both modes share the same geometry so the toggle reads as a seamless
// emphasis swap, not a chart switch.

const TOTAL_MONTHS = 24;
const W = 880;
const PAD_LEFT = 240;
const PAD_RIGHT = 24;
const PAD_TOP = 64; // headroom for the "6 MONTHS" caption + year labels
const PAD_BOTTOM = 64; // footroom for M-month axis + subcaptions

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
  type PhaseRow = {
    kind: "phase";
    phase: (typeof TIMELINE_PHASES)[number];
    y: number;
  };
  type TaskRow = {
    kind: "task";
    phaseId: keyof typeof PHASE_COLORS;
    task: (typeof TIMELINE_PHASES)[number]["tasks"][number];
    y: number;
  };
  type Row = PhaseRow | TaskRow;

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

  const isNow = mode === "now";

  // In "now" mode, design + operations rows fade to ghosts; execution
  // rows stay bright. We render them in two passes (dim group + bright
  // group) so the opacity transition CSS targets only the dim ones.
  const isDimRow = (row: Row): boolean =>
    isNow &&
    (row.kind === "phase"
      ? row.phase.id !== "execution"
      : row.phaseId !== "execution");

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
        {/* Axis grid + year/month labels: dim in "now" mode. */}
        <g
          style={{
            opacity: isNow ? 0.28 : 1,
            transition: "opacity 0.45s ease",
          }}
        >
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

        {/* Two row passes: dim rows + bright rows. */}
        {[true, false].map((dimPass) => (
          <g
            key={dimPass ? "dim" : "bright"}
            style={{
              opacity: dimPass && isNow ? 0.16 : 1,
              transition: "opacity 0.45s ease",
            }}
          >
            {rows.map((row, i) => {
              const rowIsDim = isDimRow(row);
              if (dimPass !== rowIsDim) return null;
              return renderRow(row, i);
            })}
          </g>
        ))}

        {/* "Now" overlay: dashed rectangle + edge labels. */}
        <g
          style={{
            opacity: isNow ? 1 : 0,
            transition: "opacity 0.45s ease",
            pointerEvents: "none",
          }}
        >
          <NowWindow axisY={axisY} svgH={svgH} />
        </g>
      </svg>
    </div>
  );

  function renderRow(row: Row, i: number) {
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
  }
}

function NowWindow({ axisY }: { svgH: number; axisY: number }) {
  const xL = monthToX(NOW_WINDOW.startMonth);
  const xR = monthToX(NOW_WINDOW.endMonth);
  const yT = PAD_TOP - 8;
  const yB = axisY + 6;
  // Border labels sit OUTSIDE the rectangle, parallel to each border
  // and roughly halfway down so they read like axis annotations - not
  // overlapping any of the dimmed or bright phase rows behind them.
  const labelMidY = yT + (yB - yT) * 0.5;

  return (
    <g>
      {/* Dashed rectangle frame */}
      <rect
        x={xL}
        y={yT}
        width={xR - xL}
        height={yB - yT}
        fill={palette.accentGold}
        fillOpacity="0.05"
        stroke={palette.accentGold}
        strokeWidth="1.6"
        strokeDasharray="6 5"
        rx="2"
      />

      {/* Top caption: short enough to fit above the M14-M20 span even
          when the chart container is narrow. */}
      <text
        x={(xL + xR) / 2}
        y={yT - 26}
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="11"
        fontWeight="700"
        fill={palette.accentGold}
      >
        6 MONTHS · ALREADY IN FLIGHT
      </text>
      <text
        x={(xL + xR) / 2}
        y={yT - 12}
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="9"
        fill={palette.accentGold}
        opacity="0.85"
      >
        deposit today → first light in 6 months
      </text>

      {/* LEFT BORDER label: vertical text OUTSIDE the rectangle on the
          left, reading bottom-up. Anchored to the rectangle midline so
          it visually attaches to the border. */}
      <g transform={`translate(${xL - 12}, ${labelMidY}) rotate(-90)`}>
        <text
          textAnchor="middle"
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="12"
          fontWeight="700"
          fill={palette.accentGold}
        >
          WE ARE HERE
        </text>
      </g>

      {/* RIGHT BORDER label: vertical text OUTSIDE the rectangle on
          the right, reading top-down. */}
      <g transform={`translate(${xR + 12}, ${labelMidY}) rotate(90)`}>
        <text
          textAnchor="middle"
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="12"
          fontWeight="700"
          fill={palette.accentGold}
        >
          SATELLITE FLYING
        </text>
      </g>
    </g>
  );
}
