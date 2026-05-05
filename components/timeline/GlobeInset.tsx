"use client";
import { useDemoStore } from "@/lib/store";
import { SLA_STEPS } from "@/lib/data";

// Side-on 2D globe inset for Step 2's revisit beat. We deliberately
// don't reuse the 3D globe: too heavy to mount inside an animated
// step, and it's the wrong viewpoint anyway. A 2D limb-on view with
// a curved orbit overlay reads cleanly at a small size.
//
// Drives the satellite's position from the store's missionElapsedMs:
// at startDemoMs the satellite is at orbit-angle 200° (well before
// Hormuz); at endDemoMs it's at orbit-angle 0° (overhead Hormuz).

const STEP2 = SLA_STEPS.find((s) => s.id === 2)!;
const REVISIT = STEP2.substeps?.find((s) => s.name === "Revisit")!;

const REVISIT_START_DEG = 200;
const REVISIT_END_DEG = 0;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function GlobeInset() {
  const elapsed = useDemoStore((s) => s.missionElapsedMs);

  // Clamp t into the revisit window: the inset is mounted only during
  // step 2, but the satellite stays valid during tasking + capture too.
  const tRaw =
    (elapsed - REVISIT.startDemoMs) /
    (REVISIT.endDemoMs - REVISIT.startDemoMs);
  const t = Math.max(0, Math.min(1, tRaw));

  // Geometry
  const cx = 150;
  const cy = 150;
  const earthR = 70;
  const orbitR = 105;
  const angleDeg = lerp(REVISIT_START_DEG, REVISIT_END_DEG, t);
  const angleRad = (angleDeg * Math.PI) / 180;
  const satX = cx + Math.cos(angleRad) * orbitR;
  const satY = cy - Math.sin(angleRad) * orbitR;

  // Sub-satellite point on the surface (radial projection onto Earth)
  const subX = cx + Math.cos(angleRad) * earthR;
  const subY = cy - Math.sin(angleRad) * earthR;

  // Hormuz lives at angle 0 on the orbit ring (target endpoint).
  const hormuzAngleRad = 0;
  const hormuzX = cx + Math.cos(hormuzAngleRad) * earthR;
  const hormuzY = cy - Math.sin(hormuzAngleRad) * earthR;

  // Trace from the start of the revisit to the current position.
  // Sample 32 points along the orbit arc.
  const traceSamples = 32;
  const tracePoints: string[] = [];
  for (let i = 0; i <= traceSamples; i++) {
    const tt = (i / traceSamples) * t;
    const a =
      ((lerp(REVISIT_START_DEG, REVISIT_END_DEG, tt)) * Math.PI) / 180;
    const x = cx + Math.cos(a) * orbitR;
    const y = cy - Math.sin(a) * orbitR;
    tracePoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <svg
      viewBox="0 0 300 300"
      className="h-full w-full"
      role="img"
      aria-label="Satellite advancing toward Hormuz"
    >
      <defs>
        <radialGradient id="insetEarth" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="80%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <radialGradient id="insetAtmos" cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#38BDF8" stopOpacity="0" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
        </radialGradient>
      </defs>
      {/* Atmosphere */}
      <circle cx={cx} cy={cy} r={earthR + 10} fill="url(#insetAtmos)" />
      {/* Earth */}
      <circle cx={cx} cy={cy} r={earthR} fill="url(#insetEarth)" />
      {/* Orbit ring (full) */}
      <circle
        cx={cx}
        cy={cy}
        r={orbitR}
        fill="none"
        stroke="#38BDF8"
        strokeOpacity="0.25"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {/* Trace from revisit start to satellite */}
      <polyline
        points={tracePoints.join(" ")}
        fill="none"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Sub-satellite point on Earth surface */}
      <line
        x1={satX}
        y1={satY}
        x2={subX}
        y2={subY}
        stroke="#38BDF8"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <circle cx={subX} cy={subY} r="2.5" fill="#38BDF8" />
      {/* Hormuz */}
      <g>
        <circle cx={hormuzX} cy={hormuzY} r="6" fill="#D4A949" fillOpacity="0.25" />
        <circle cx={hormuzX} cy={hormuzY} r="3" fill="#D4A949" />
        <text
          x={hormuzX + 8}
          y={hormuzY + 4}
          fontSize="9"
          fill="#D4A949"
          fontFamily="ui-monospace, monospace"
        >
          Hormuz
        </text>
      </g>
      {/* Satellite glyph */}
      <g>
        <circle cx={satX} cy={satY} r="9" fill="#38BDF8" fillOpacity="0.18" />
        <circle cx={satX} cy={satY} r="3.5" fill="#38BDF8" />
        <text
          x={satX + 8}
          y={satY - 6}
          fontSize="9"
          fill="#38BDF8"
          fontFamily="ui-monospace, monospace"
        >
          EDGE-SAR-07
        </text>
      </g>
    </svg>
  );
}
