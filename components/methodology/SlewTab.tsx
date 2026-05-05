"use client";
import { SATELLITE_CAPABILITY, palette } from "@/lib/data";

// ±30° off-nadir slew cone. Satellite icon at the top, cone descending
// to the Earth surface, three target dots inside the footprint.
//
// Animation: a "sweep" arc inside the cone whose stroke-dashoffset
// loops, plus a soft pulse on the cone edges. All SVG SMIL: no JS,
// no framer-motion: so it renders the same in the modal regardless
// of mount order.

export function SlewTab() {
  const slew = SATELLITE_CAPABILITY.slewAngleDeg;

  // Geometry
  const cx = 400;
  const satY = 90;
  const groundY = 360;
  // Tan of slew angle scaled so the half-cone half-width at the ground
  // looks generous on screen. Real geometry would compute from altitude
  //: this is illustrative.
  const halfCone = Math.tan((slew * Math.PI) / 180) * (groundY - satY) * 1.0;

  const leftFoot = cx - halfCone;
  const rightFoot = cx + halfCone;

  // Target dots inside the footprint (3 locations)
  const targets = [
    { x: cx - halfCone * 0.55, y: groundY - 6, label: "T-A" },
    { x: cx + halfCone * 0.05, y: groundY - 18, label: "T-B" },
    { x: cx + halfCone * 0.65, y: groundY - 4, label: "T-C" },
  ];

  return (
    <div className="grid w-full gap-8 md:grid-cols-[1.4fr_1fr]">
      <figure className="relative">
        <svg
          viewBox="0 0 800 480"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={`Off-nadir slew cone, ±${slew} degrees`}
          className="w-full"
        >
          <defs>
            <linearGradient id="coneFill" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={palette.accentSky} stopOpacity="0.20" />
              <stop offset="100%" stopColor={palette.accentSky} stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="sweepFill" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={palette.accentGold} stopOpacity="0.55" />
              <stop offset="100%" stopColor={palette.accentGold} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Ground plane */}
          <line
            x1={40}
            y1={groundY}
            x2={760}
            y2={groundY}
            stroke={palette.borderSubtle}
            strokeWidth="1"
          />
          {/* Ground tick marks */}
          {Array.from({ length: 9 }, (_, i) => {
            const x = 80 + i * 80;
            return (
              <line
                key={`tick-${i}`}
                x1={x}
                y1={groundY}
                x2={x}
                y2={groundY + 6}
                stroke={palette.borderSubtle}
                strokeWidth="1"
              />
            );
          })}

          {/* Static full cone (left edge → footprint → right edge) */}
          <path
            d={`M ${cx} ${satY} L ${leftFoot} ${groundY} L ${rightFoot} ${groundY} Z`}
            fill="url(#coneFill)"
            stroke={palette.accentSky}
            strokeOpacity="0.5"
            strokeWidth="1"
          />

          {/* Nadir line (vertical from satellite straight down) */}
          <line
            x1={cx}
            y1={satY}
            x2={cx}
            y2={groundY}
            stroke={palette.borderSubtle}
            strokeWidth="1"
            strokeDasharray="3 4"
          />

          {/* Sweep wedge: animates left-to-right inside the cone */}
          <g>
            <path
              d={`M ${cx} ${satY} L ${cx - halfCone * 0.18} ${groundY} L ${cx + halfCone * 0.18} ${groundY} Z`}
              fill="url(#sweepFill)"
              stroke={palette.accentGold}
              strokeOpacity="0.9"
              strokeWidth="1.2"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from={`${-slew} ${cx} ${satY}`}
                to={`${slew} ${cx} ${satY}`}
                dur="3.4s"
                repeatCount="indefinite"
                values={`${-slew} ${cx} ${satY}; ${slew} ${cx} ${satY}; ${-slew} ${cx} ${satY}`}
                keyTimes="0;0.5;1"
                calcMode="spline"
                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
              />
            </path>
          </g>

          {/* Cone edge labels */}
          <g
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="10"
            fill={palette.textMuted}
          >
            <text x={leftFoot - 6} y={groundY - 6} textAnchor="end">
              −{slew}°
            </text>
            <text x={rightFoot + 6} y={groundY - 6}>
              +{slew}°
            </text>
            <text x={cx} y={groundY + 22} textAnchor="middle">
              nadir
            </text>
          </g>

          {/* Targets inside the footprint */}
          {targets.map((t, i) => (
            <g key={i}>
              <circle
                cx={t.x}
                cy={t.y}
                r="9"
                fill={palette.accentGold}
                fillOpacity="0.18"
              />
              <circle cx={t.x} cy={t.y} r="3.5" fill={palette.accentGold} />
              <text
                x={t.x}
                y={t.y - 14}
                textAnchor="middle"
                fontFamily="ui-monospace, Menlo, monospace"
                fontSize="10"
                fill={palette.text}
              >
                {t.label}
              </text>
            </g>
          ))}

          {/* Satellite icon */}
          <g transform={`translate(${cx - 22} ${satY - 22})`}>
            <rect
              x="14"
              y="14"
              width="16"
              height="16"
              fill={palette.bgPanelHi}
              stroke={palette.accentSky}
              strokeWidth="1.3"
              rx="2"
            />
            {/* Solar panels */}
            <rect
              x="-4"
              y="18"
              width="14"
              height="8"
              fill="none"
              stroke={palette.accentSky}
              strokeWidth="1"
            />
            <rect
              x="34"
              y="18"
              width="14"
              height="8"
              fill="none"
              stroke={palette.accentSky}
              strokeWidth="1"
            />
            {/* Antenna */}
            <line
              x1="22"
              y1="14"
              x2="22"
              y2="6"
              stroke={palette.accentSky}
              strokeWidth="1"
            />
            <circle cx="22" cy="6" r="2" fill={palette.accentSky} />
          </g>

          {/* Title */}
          <g
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="11"
            fill={palette.textMuted}
          >
            <text x={cx} y={50} textAnchor="middle" fill={palette.text}>
              ±{slew}° off-nadir slew envelope
            </text>
          </g>
        </svg>
      </figure>

      <figcaption className="space-y-4 self-center text-sm text-muted-foreground">
        <p>
          Each satellite can tilt up to{" "}
          <span className="text-gold">±{slew}°</span> off-nadir, enabling it
          to image multiple targets in a single pass without changing orbit.
        </p>
        <p>
          The sweep wedge (gold) shows the steerable instrument boresight. As
          the satellite passes overhead, the wedge selects which targets in
          the footprint to capture: typically two or three priority POIs per
          pass.
        </p>
        <p className="text-xs italic">
          Imaging modes: {SATELLITE_CAPABILITY.imagingModes.join(" · ")}.
          Polarization: {SATELLITE_CAPABILITY.polarization}. Swath:{" "}
          {SATELLITE_CAPABILITY.swathKm.spotlight ?? "-"} km spotlight ·{" "}
          {SATELLITE_CAPABILITY.swathKm.stripmap ?? "-"} km stripmap.
        </p>
      </figcaption>
    </div>
  );
}
