"use client";
import { TIMELINE_PHASES, palette } from "@/lib/data";

// 27-month implementation Gantt. All sub-tasks are visible at a
// glance: each phase header sits above its own grouped sub-task rows.
// No expand-collapse. PRD §7 + operator feedback (2026-05-06).

const TOTAL_MONTHS = 30; // Year 1 + Year 2 + 3 month ops runoff
const W = 880;
const PAD_LEFT = 240; // wide left gutter for task labels
const PAD_RIGHT = 24;
const PAD_TOP = 32;
const PAD_BOTTOM = 36;

const PHASE_HEADER_H = 32;
const TASK_ROW_H = 22;
const PHASE_GAP = 14;

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
  // Pre-compute the y-position of every phase header and every sub-task
  // so the chart is a single render pass with no state.
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

  return (
    <div className="space-y-4">
      <svg
        viewBox={`0 0 ${W} ${svgH}`}
        className="w-full"
        role="img"
        aria-label="27-month implementation timeline"
      >
        {/* Vertical month axis lines */}
        {[0, 6, 12, 18, 24, 27].map((m) => {
          const isYear = m % 12 === 0;
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

        {/* Year labels above the chart */}
        <g
          fontFamily="ui-monospace, Menlo, monospace"
          fontSize="9"
          fill={palette.textMuted}
        >
          <text x={monthToX(6)} y={PAD_TOP - 18} textAnchor="middle">
            YEAR 1
          </text>
          <text x={monthToX(18)} y={PAD_TOP - 18} textAnchor="middle">
            YEAR 2
          </text>
          <text x={monthToX(28.5)} y={PAD_TOP - 18} textAnchor="middle">
            OPS
          </text>
        </g>

        {/* Rows */}
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
                {/* Phase label on the left gutter */}
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

                {/* Phase bar */}
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

          // Task row
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
              {/* Task name */}
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
              {/* Range badge before the bar */}
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

        {/* Month axis labels at the bottom */}
        {[0, 6, 12, 18, 24, 27].map((m) => (
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
      </svg>
    </div>
  );
}
