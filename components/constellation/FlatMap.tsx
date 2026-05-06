"use client";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { AOIS, CONSTELLATION, GROUND_STATIONS } from "@/lib/data";
import {
  buildConstellation,
  nextAOIForSat,
  positionToLatLng,
} from "@/lib/orbit";
import { useDemoStore } from "@/lib/store";

// Equirectangular Plate Carrée projection of the Blue Marble texture
// + AOI dots + satellite sub-points. Replaces the live 3D globe in
// the constellation section: hard to mis-place a dot on a flat map
// since lat/lng → (x,y) is one line of math each, and the operator
// can read each label without rotating anything.
//
// Conventions:
//   x = ((lng + 180) / 360) * width
//   y = ((90  - lat) /  180) * height
//
// The Blue Marble image we ship is full-world equirectangular north-up,
// so the same projection lines up with the texture exactly.

function project(lat: number, lng: number) {
  return {
    xPct: ((lng + 180) / 360) * 100,
    yPct: ((90 - lat) / 180) * 100,
  };
}

function fmtLat(lat: number) {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
}
function fmtLng(lng: number) {
  return `${Math.abs(lng).toFixed(2)}°${lng >= 0 ? "E" : "W"}`;
}

export function FlatMap() {
  const selectedSatId = useDemoStore((s) => s.selectedSatId);
  const setSelectedSat = useDemoStore((s) => s.setSelectedSat);
  const setSelectedAOI = useDemoStore((s) => s.setSelectedAOI);

  // Sub-satellite points: project each 3D position to a (lat, lng).
  const subSats = useMemo(() => {
    return buildConstellation().map((s) => {
      const ll = positionToLatLng(s.position);
      return { ...s, lat: ll.lat, lng: ll.lng };
    });
  }, []);

  const selectedSat = subSats.find((s) => s.id === selectedSatId) ?? null;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-deep-space"
      onClick={() => setSelectedSat(null)}
    >
      {/* Background map */}
      <img
        src="/textures/earth-day.jpg"
        alt="Equirectangular world map"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover opacity-90"
      />
      {/* Soft sovereign-tinted overlay so the typography reads */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.25) 0%, rgba(2,6,23,0) 30%, rgba(2,6,23,0) 70%, rgba(2,6,23,0.45) 100%)",
        }}
      />

      {/* Graticule: very faint lat/lng grid every 30° / 30° */}
      <svg
        viewBox="0 0 360 180"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      >
        {[...Array(11)].map((_, i) => {
          const lng = -180 + (i + 1) * 30;
          const x = lng + 180;
          return (
            <line
              key={`m-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={180}
              stroke="#94A3B8"
              strokeWidth="0.2"
            />
          );
        })}
        {[...Array(5)].map((_, i) => {
          const lat = 90 - (i + 1) * 30;
          const y = 90 - lat;
          return (
            <line
              key={`p-${i}`}
              x1={0}
              y1={y}
              x2={360}
              y2={y}
              stroke="#94A3B8"
              strokeWidth="0.2"
            />
          );
        })}
        <line
          x1={0}
          y1={90}
          x2={360}
          y2={90}
          stroke="#94A3B8"
          strokeWidth="0.4"
          strokeDasharray="2 2"
        />
      </svg>

      {/* Ground station markers (UAE) - small mast glyphs */}
      {GROUND_STATIONS.map((g) => {
        const { xPct, yPct } = project(g.lat, g.lng);
        return (
          <div
            key={g.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className="block h-2 w-2 rotate-45 border border-sovsky bg-deepspace"
              />
              <span className="mt-1 whitespace-nowrap rounded-sm bg-background/70 px-1 font-mono text-[8px] uppercase tracking-[0.18em] text-sovsky/85 backdrop-blur-md">
                {g.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* AOI markers - large gold pulsing dots with labels */}
      {AOIS.map((aoi) => {
        const { xPct, yPct } = project(aoi.lat, aoi.lng);
        return (
          <button
            type="button"
            key={aoi.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSat(null);
              setSelectedAOI(aoi.id);
            }}
            aria-label={`AOI ${aoi.name}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <span
              aria-hidden
              className="absolute inset-0 -m-3 animate-pulse rounded-full bg-gold/20 blur-[2px]"
            />
            <span className="relative block h-3 w-3 rounded-full border-2 border-gold bg-gold/60 shadow-[0_0_10px_-2px_hsl(var(--gold-500))] transition-transform group-hover:scale-125" />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-gold/40 bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold backdrop-blur-md">
              {aoi.name}
            </span>
          </button>
        );
      })}

      {/* Satellite sub-points - small sky dots, click to inspect */}
      {subSats.map((sat) => {
        const { xPct, yPct } = project(sat.lat, sat.lng);
        const isSelected = selectedSatId === sat.id;
        return (
          <button
            type="button"
            key={sat.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSat(isSelected ? null : sat.id);
            }}
            aria-label={`Satellite ${sat.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <span
              aria-hidden
              className={`block rounded-full border transition-all ${
                isSelected
                  ? "h-3 w-3 border-sovsky bg-sovsky shadow-[0_0_12px_-2px_hsl(var(--sky-500))]"
                  : "h-2 w-2 border-sovsky/80 bg-sovsky/70 hover:scale-150"
              }`}
            />
          </button>
        );
      })}

      {/* Tooltip for the selected satellite */}
      {selectedSat && (
        <SatelliteTooltipFlat
          sat={selectedSat}
          onClose={() => setSelectedSat(null)}
        />
      )}
    </div>
  );
}

function SatelliteTooltipFlat({
  sat,
  onClose,
}: {
  sat: { id: string; lat: number; lng: number };
  onClose: () => void;
}) {
  const { xPct, yPct } = project(sat.lat, sat.lng);
  const nextAOI = nextAOIForSat(sat.id);
  // Pin to the right of the dot if it's in the left 70% of the map,
  // otherwise pin to the left so it doesn't overflow the container.
  const pinLeft = xPct > 70;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute z-30 w-[240px] -translate-y-1/2 rounded-lg border border-gold/40 bg-background/95 p-3 shadow-2xl backdrop-blur-md"
      style={{
        left: pinLeft ? "auto" : `calc(${xPct}% + 14px)`,
        right: pinLeft ? `calc(${100 - xPct}% + 14px)` : "auto",
        top: `${yPct}%`,
      }}
      role="tooltip"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
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
          value={`${CONSTELLATION.inclinationDeg}° + ${CONSTELLATION.inclinationToleranceDeg}°`}
        />
        <Row
          label="Sub-sat point"
          value={`${fmtLat(sat.lat)} · ${fmtLng(sat.lng)}`}
        />
        <Row
          label="Next AOI"
          value={`${nextAOI.aoiName} · T+${nextAOI.etaMin} min`}
          highlight
        />
      </dl>
    </motion.div>
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
