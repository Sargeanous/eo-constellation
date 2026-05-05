"use client";
import { ORBITAL_GEOMETRY, CONSTELLATION } from "@/lib/data";
import { palette } from "@/lib/data";

// Walker-Delta 11P/2S illustration — oblique-2D view of Earth with 11
// orbital planes, each rotated by 360/11° around the polar axis, all
// inclined at 38°. Two satellites per plane sit 180° apart.
//
// Static SVG; no live data, no animation. The numbers (11 / 2 / 22 /
// 38°) come from ORBITAL_GEOMETRY + CONSTELLATION so a future config
// change updates the diagram caption automatically.

export function OrbitTab() {
  const { totalPlanes, satellitesPerPlane, ascendingNodeSpacingDeg } =
    ORBITAL_GEOMETRY;

  // Geometry
  const cx = 400;
  const cy = 240;
  const earthR = 70;
  const orbitRx = 220; // along the orbital plane "in plane" axis
  const orbitRy = 70; // perpendicular — projection of inclination

  // 11 planes, RAAN evenly spaced around the polar axis.
  const planes = Array.from({ length: totalPlanes }, (_, i) => {
    const raan = (360 / totalPlanes) * i;
    return raan;
  });

  return (
    <div className="grid w-full gap-8 md:grid-cols-[1.4fr_1fr]">
      <figure className="relative">
        <svg
          viewBox="0 0 800 480"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Walker-Delta 11P/2S orbital geometry"
          className="w-full"
        >
          {/* Background star dust */}
          <defs>
            <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="80%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <radialGradient id="atmosGrad" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor={palette.accentSky} stopOpacity="0" />
              <stop offset="100%" stopColor={palette.accentSky} stopOpacity="0.45" />
            </radialGradient>
          </defs>

          {/* Polar axis hint (for reading orientation only) */}
          <line
            x1={cx}
            y1={cy - 130}
            x2={cx}
            y2={cy + 130}
            stroke={palette.borderSubtle}
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Equator hint */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={earthR + 8}
            ry={4}
            fill="none"
            stroke={palette.borderSubtle}
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* 11 orbit ellipses, rotated around (cx, cy). Earlier indices
              behind, later indices in front to give an oblique read. */}
          {planes.map((raan, i) => {
            const opacity = 0.18 + (i / planes.length) * 0.35;
            return (
              <ellipse
                key={`orbit-${i}`}
                cx={cx}
                cy={cy}
                rx={orbitRx}
                ry={orbitRy}
                fill="none"
                stroke={palette.accentSky}
                strokeOpacity={opacity}
                strokeWidth="1.2"
                transform={`rotate(${raan} ${cx} ${cy})`}
              />
            );
          })}

          {/* Earth */}
          <circle cx={cx} cy={cy} r={earthR + 12} fill="url(#atmosGrad)" />
          <circle cx={cx} cy={cy} r={earthR} fill="url(#earthGrad)" />
          <circle
            cx={cx}
            cy={cy}
            r={earthR}
            fill="none"
            stroke={palette.borderSubtle}
            strokeWidth="0.8"
          />

          {/* 2 satellites per plane, sky-blue dots, 180° apart in plane.
              We place them on the major axis of each rotated ellipse. */}
          {planes.flatMap((raan, i) =>
            Array.from({ length: satellitesPerPlane }, (_, s) => {
              const sign = s === 0 ? 1 : -1;
              // Local position along the ellipse's major axis at TA=0/180°
              const lx = cx + sign * orbitRx;
              const ly = cy;
              // Rotate around (cx, cy) by raan
              const rad = (raan * Math.PI) / 180;
              const x = Math.cos(rad) * (lx - cx) - Math.sin(rad) * (ly - cy) + cx;
              const y = Math.sin(rad) * (lx - cx) + Math.cos(rad) * (ly - cy) + cy;
              return (
                <g key={`sat-${i}-${s}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill={palette.accentSky}
                    fillOpacity="0.18"
                  />
                  <circle cx={x} cy={y} r="2.5" fill={palette.accentSky} />
                </g>
              );
            }),
          )}

          {/* Highlight one plane in gold to label "1 of 11" */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={orbitRx}
            ry={orbitRy}
            fill="none"
            stroke={palette.accentGold}
            strokeWidth="1.6"
            strokeOpacity="0.85"
            transform={`rotate(0 ${cx} ${cy})`}
          />

          {/* Labels */}
          <g
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="11"
            fill={palette.textMuted}
          >
            <text x={cx + orbitRx + 8} y={cy + 4}>
              Plane 1 / {totalPlanes}
            </text>
            <text x={cx - earthR - 10} y={cy - earthR - 14} textAnchor="end">
              Earth
            </text>
            <text x={cx} y={cy - 150} textAnchor="middle" fill={palette.text}>
              {ORBITAL_GEOMETRY.walkerDeltaNotation}
            </text>
            <text
              x={cx}
              y={cy - 134}
              textAnchor="middle"
              fontSize="10"
              fill={palette.textMuted}
            >
              Walker-Delta class · {totalPlanes} planes ×{" "}
              {satellitesPerPlane} sats = {CONSTELLATION.totalSatellites}
            </text>
          </g>

          {/* RAAN spacing call-out */}
          <g
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="10"
            fill={palette.textMuted}
          >
            <text x={20} y={460}>
              RAAN spacing: {ascendingNodeSpacingDeg.toFixed(2)}°
            </text>
            <text x={20} y={446}>
              Inclination: {CONSTELLATION.inclinationDeg}° ±
              {CONSTELLATION.inclinationToleranceDeg}°
            </text>
            <text x={20} y={432}>
              Altitude: {CONSTELLATION.altitudeKm} km
            </text>
          </g>
        </svg>
      </figure>

      <figcaption className="space-y-4 self-center text-sm text-muted-foreground">
        <p>
          A <span className="text-foreground">Walker-Delta</span> constellation
          spreads satellites across multiple inclined planes that share the
          same inclination and altitude. Right ascension of the ascending node
          (RAAN) is offset evenly so passes interleave instead of stacking.
        </p>
        <p>
          We use{" "}
          <span className="text-gold">
            {ORBITAL_GEOMETRY.walkerDeltaNotation}
          </span>
          : {totalPlanes} orbital planes, {satellitesPerPlane} satellites
          per plane, {CONSTELLATION.totalSatellites} satellites total.
          Each plane is offset by{" "}
          <span className="font-mono">
            {ascendingNodeSpacingDeg.toFixed(2)}°
          </span>{" "}
          around the polar axis. The two satellites in each plane sit 180°
          apart in true anomaly.
        </p>
      </figcaption>
    </div>
  );
}
