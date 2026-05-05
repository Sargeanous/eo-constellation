"use client";
import { TARGET_CLUSTERING, palette } from "@/lib/data";

// "Ground-track strips" plot. Coloured horizontal stripes represent
// orbital ground tracks; target points scatter across them. The
// outlier (T34) sits between strips in amber.
//
// Static SVG. Numbers and counts pull from TARGET_CLUSTERING so the
// figure caption stays in sync with the data.

interface Target {
  id: string;
  x: number; // 0..1 across the plot width
  strip: number; // 0..(N-1) row index, with -1 = outlier
  highlighted?: boolean;
}

// Deterministic pseudo-random scatter so the picture is the same every
// render. We seed by the target index.
function scatter(
  total: number,
  ascendingPasses: number,
  descendingPasses: number,
): Target[] {
  const stripeCount = ascendingPasses + descendingPasses; // 11 + 15 = 26 conceptually
  // Fold to a smaller renderable count (8 stripes total: 4 asc + 4 desc),
  // which keeps the picture readable. The counts in the caption still
  // reference the underlying TARGET_CLUSTERING numbers.
  const stripeRows = 8;

  const targets: Target[] = [];
  for (let i = 1; i <= total; i++) {
    // Deterministic LCG-ish position
    const a = (i * 9301 + 49297) % 233280;
    const x = (a / 233280) * 0.9 + 0.05;
    const b = ((i + 7) * 49297 + 9301) % 233280;
    const stripeBias = b / 233280;
    const strip = Math.floor(stripeBias * stripeRows);
    targets.push({
      id: `T${i}`,
      x,
      strip: Math.max(0, Math.min(stripeRows - 1, strip)),
    });
  }

  // Force one target onto a deterministic outlier slot (between rows).
  const outlierIdx = total - 1; // T35 → index 34
  if (targets[outlierIdx]) {
    targets[outlierIdx]!.strip = -1;
    targets[outlierIdx]!.highlighted = true;
    targets[outlierIdx]!.x = 0.74; // sit it visually away from the cluster
  }

  // Mark T34 as the named outlier per the brief.
  if (total >= 34 && targets[33]) {
    // Move T35 back into a stripe; designate T34 as outlier.
    if (targets[outlierIdx]) {
      targets[outlierIdx]!.strip = 4;
      targets[outlierIdx]!.highlighted = false;
      // Re-pick a deterministic x so T35 doesn't sit exactly where T34 was.
      const a = (total * 9301 + 49297) % 233280;
      targets[outlierIdx]!.x = (a / 233280) * 0.9 + 0.05;
    }
    targets[33]!.strip = -1;
    targets[33]!.highlighted = true;
    targets[33]!.x = 0.78;
  }

  return targets;
}

export function ClusteringTab() {
  const {
    description,
    exampleTotalTargets,
    exampleAscendingPasses,
    exampleDescendingPasses,
    exampleOutliers,
  } = TARGET_CLUSTERING;

  // Render frame
  const W = 800;
  const H = 460;
  const padX = 60;
  const padTop = 60;
  const padBottom = 60;

  const stripeCount = 8;
  const stripeH = (H - padTop - padBottom) / stripeCount;
  const stripeW = W - padX * 2;

  const targets = scatter(
    exampleTotalTargets,
    exampleAscendingPasses,
    exampleDescendingPasses,
  );

  return (
    <div className="grid w-full gap-8 md:grid-cols-[1.4fr_1fr]">
      <figure className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Target clustering on orbital ground-track strips"
          className="w-full"
        >
          <defs>
            <linearGradient id="stripeAsc" x1="0%" x2="100%">
              <stop
                offset="0%"
                stopColor={palette.accentSky}
                stopOpacity="0.05"
              />
              <stop
                offset="50%"
                stopColor={palette.accentSky}
                stopOpacity="0.18"
              />
              <stop
                offset="100%"
                stopColor={palette.accentSky}
                stopOpacity="0.05"
              />
            </linearGradient>
            <linearGradient id="stripeDesc" x1="0%" x2="100%">
              <stop
                offset="0%"
                stopColor={palette.accentGreen}
                stopOpacity="0.05"
              />
              <stop
                offset="50%"
                stopColor={palette.accentGreen}
                stopOpacity="0.16"
              />
              <stop
                offset="100%"
                stopColor={palette.accentGreen}
                stopOpacity="0.05"
              />
            </linearGradient>
          </defs>

          {/* Stripes — alternating ascending (sky) and descending (green) */}
          {Array.from({ length: stripeCount }, (_, i) => {
            const isAsc = i % 2 === 0;
            const y = padTop + i * stripeH;
            return (
              <g key={`stripe-${i}`}>
                <rect
                  x={padX}
                  y={y + 4}
                  width={stripeW}
                  height={stripeH - 8}
                  fill={`url(#${isAsc ? "stripeAsc" : "stripeDesc"})`}
                  stroke={
                    isAsc ? palette.accentSky : palette.accentGreen
                  }
                  strokeOpacity="0.25"
                  strokeWidth="1"
                />
                <text
                  x={padX - 8}
                  y={y + stripeH / 2 + 4}
                  textAnchor="end"
                  fontFamily="ui-monospace, Menlo, monospace"
                  fontSize="9"
                  fill={palette.textMuted}
                >
                  {isAsc ? "ASC" : "DESC"}
                </text>
              </g>
            );
          })}

          {/* Targets */}
          {targets.map((t, i) => {
            const x = padX + t.x * stripeW;
            let y: number;
            if (t.strip < 0) {
              // Outlier — sits below all stripes
              y = padTop + stripeCount * stripeH - 6;
            } else {
              y =
                padTop +
                t.strip * stripeH +
                stripeH / 2 +
                ((i % 5) - 2) * 4; // small jitter within a strip
            }
            const fill = t.highlighted
              ? palette.accentAmber
              : palette.accentSky;
            return (
              <g key={t.id}>
                {t.highlighted && (
                  <circle
                    cx={x}
                    cy={y}
                    r="11"
                    fill={palette.accentAmber}
                    fillOpacity="0.18"
                  />
                )}
                <circle cx={x} cy={y} r={t.highlighted ? 4.2 : 2.6} fill={fill} />
                <text
                  x={x + 5}
                  y={y - 5}
                  fontFamily="ui-monospace, Menlo, monospace"
                  fontSize="8.5"
                  fill={t.highlighted ? palette.accentAmber : palette.textMuted}
                >
                  {t.id}
                </text>
              </g>
            );
          })}

          {/* Title */}
          <text
            x={W / 2}
            y={32}
            textAnchor="middle"
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="12"
            fill={palette.text}
          >
            POIs vs. orbital ground tracks
          </text>

          {/* Counts strip at bottom */}
          <g
            fontFamily="ui-monospace, Menlo, monospace"
            fontSize="10"
            fill={palette.textMuted}
          >
            <text x={padX} y={H - 14}>
              <tspan fill={palette.accentSky}>●</tspan> {exampleAscendingPasses}{" "}
              ascending passes
            </text>
            <text x={padX + 200} y={H - 14}>
              <tspan fill={palette.accentGreen}>●</tspan>{" "}
              {exampleDescendingPasses} descending passes
            </text>
            <text x={padX + 420} y={H - 14}>
              <tspan fill={palette.accentAmber}>●</tspan> {exampleOutliers}{" "}
              outlier (T34)
            </text>
          </g>
        </svg>
      </figure>

      <figcaption className="space-y-4 self-center text-sm text-muted-foreground">
        <p>{description}</p>
        <p>
          For an example MENA priority POI set ({exampleTotalTargets} targets),
          our clustering tool slots{" "}
          <span className="text-gold">{exampleAscendingPasses}</span> on
          ascending passes and{" "}
          <span className="text-gold">{exampleDescendingPasses}</span> on
          descending passes. {exampleOutliers} target (T34) needs dedicated
          targeting because it doesn&apos;t align with any orbital track.
        </p>
        <p className="text-xs italic">
          Slew + clustering compound: each pass typically images 2–3 POIs, so
          the apparent revisit gain is ≈3× the satellite count alone would
          suggest.
        </p>
      </figcaption>
    </div>
  );
}
