"use client";
import { useMemo } from "react";
import { Html } from "@react-three/drei";
import { useDemoStore } from "@/lib/store";
import {
  buildConstellation,
  positionToLatLng,
  nextAOIForSat,
} from "@/lib/orbit";
import { CONSTELLATION } from "@/lib/data";
import { X } from "lucide-react";

// drei <Html> tooltip mounted at the selected satellite's local
// position. Lives inside the same parent group as Satellites/Orbit/AOI
// so it inherits the world rotation and tracks correctly under the
// camera.

function fmtLat(lat: number) {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
}
function fmtLng(lng: number) {
  return `${Math.abs(lng).toFixed(2)}°${lng >= 0 ? "E" : "W"}`;
}

export function SatelliteTooltip() {
  const selected = useDemoStore((s) => s.selectedSatId);
  const setSelected = useDemoStore((s) => s.setSelectedSat);

  // Recompute the constellation memoised: same call as Satellites.
  const sats = useMemo(() => buildConstellation(), []);
  const sat = sats.find((s) => s.id === selected);

  if (!sat) return null;

  const { lat, lng } = positionToLatLng(sat.position);
  const nextAOI = nextAOIForSat(sat.id);

  return (
    <Html
      position={[sat.position.x, sat.position.y, sat.position.z]}
      center
      occlude={false}
      zIndexRange={[100, 0]}
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="cinematic-surface relative w-[240px] -translate-y-[110%] rounded-lg border border-gold/40 bg-background/90 p-3 shadow-2xl backdrop-blur-md"
        role="tooltip"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setSelected(null)}
          aria-label="Close"
          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          Satellite
        </p>
        <p className="mt-1 font-display text-sm font-semibold text-gold">
          {sat.id}
        </p>
        <dl className="mt-3 space-y-1.5 text-[11px]">
          <Row label="Altitude" value={`${CONSTELLATION.altitudeKm} km`} />
          <Row
            label="Inclination"
            value={`${CONSTELLATION.inclinationDeg}° +${CONSTELLATION.inclinationToleranceDeg}°`}
          />
          <Row
            label="Sub-sat point"
            value={`${fmtLat(lat)} · ${fmtLng(lng)}`}
          />
          <Row
            label="Next AOI"
            value={`${nextAOI.aoiName} · T+${nextAOI.etaMin} min`}
            highlight
          />
        </dl>
      </div>
    </Html>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between font-mono">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={highlight ? "text-gold" : "text-foreground"}>{value}</dd>
    </div>
  );
}
