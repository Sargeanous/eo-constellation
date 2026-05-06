"use client";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { motion } from "framer-motion";
import { AOIS, CONSTELLATION, GROUND_STATIONS, palette } from "@/lib/data";
import {
  buildConstellation,
  buildOrbitPlanes,
  nextAOIForSat,
  positionToLatLng,
} from "@/lib/orbit";
import { useDemoStore } from "@/lib/store";

// Equirectangular Plate Carrée projection of the Blue Marble texture
// + AOI dots + satellite sub-points + per-plane ground-track polylines.
//
// Performance: pan and zoom updates fire at 60+ Hz off pointer events.
// We pay the cost of one React re-render per tick on the FlatMap
// component itself (so the transform updates), but the heavy children
// (background image, ground tracks SVG, all 29 marker glyphs) are
// memoised - they receive stable, position-only props and don't
// re-render on pan/zoom. Inverse-zoom for the marker glyphs flows
// through a CSS variable (--inv-zoom) so the transform updates
// purely in CSS without React touching each glyph.

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const DRAG_THRESHOLD_PX = 4;

interface SubSat {
  id: string;
  lat: number;
  lng: number;
}

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

/** Split a ground-track polyline at antimeridian crossings (where
 *  consecutive points jump > 180° in longitude) so SVG doesn't draw
 *  a horizontal "wrap" line across the whole map. */
function splitAntimeridian(
  pts: Array<{ lat: number; lng: number }>,
): Array<Array<{ lat: number; lng: number }>> {
  const out: Array<Array<{ lat: number; lng: number }>> = [];
  let current: Array<{ lat: number; lng: number }> = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!;
    if (current.length > 0) {
      const prev = current[current.length - 1]!;
      if (Math.abs(p.lng - prev.lng) > 180) {
        out.push(current);
        current = [];
      }
    }
    current.push(p);
  }
  if (current.length > 1) out.push(current);
  return out;
}

export function FlatMap() {
  const selectedSatId = useDemoStore((s) => s.selectedSatId);
  const setSelectedSat = useDemoStore((s) => s.setSelectedSat);
  const setSelectedAOI = useDemoStore((s) => s.setSelectedAOI);

  const subSats = useMemo<SubSat[]>(() => {
    return buildConstellation().map((s) => {
      const ll = positionToLatLng(s.position);
      return { id: s.id, lat: ll.lat, lng: ll.lng };
    });
  }, []);

  const groundTrackPaths = useMemo(() => {
    const paths: string[] = [];
    for (const plane of buildOrbitPlanes(192)) {
      const ll = plane.points.map((v) => positionToLatLng(v));
      for (const seg of splitAntimeridian(ll)) {
        const d = seg
          .map((p, i) => {
            const x = p.lng + 180;
            const y = 90 - p.lat;
            return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
          })
          .join(" ");
        paths.push(d);
      }
    }
    return paths;
  }, []);

  const selectedSat = subSats.find((s) => s.id === selectedSatId) ?? null;

  // ───── zoom + pan ─────
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    baseTx: number;
    baseTy: number;
    moved: boolean;
  } | null>(null);

  const clampPan = useCallback((z: number, x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const w = el.clientWidth;
    const h = el.clientHeight;
    const maxX = ((z - 1) * w) / 2;
    const maxY = ((z - 1) * h) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const setView = useCallback(
    (z: number, x: number, y: number) => {
      const cz = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
      const c = clampPan(cz, x, y);
      setZoom(cz);
      setTx(c.x);
      setTy(c.y);
    },
    [clampPan],
  );

  const zoomBy = useCallback(
    (factor: number, focusX?: number, focusY?: number) => {
      const el = containerRef.current;
      if (!el) {
        setView(zoom * factor, tx, ty);
        return;
      }
      const rect = el.getBoundingClientRect();
      const fx = focusX ?? rect.width / 2;
      const fy = focusY ?? rect.height / 2;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));
      const baseX = (fx - rect.width / 2 - tx) / zoom;
      const baseY = (fy - rect.height / 2 - ty) / zoom;
      const newTx = fx - rect.width / 2 - baseX * newZoom;
      const newTy = fy - rect.height / 2 - baseY * newZoom;
      setView(newZoom, newTx, newTy);
    },
    [zoom, tx, ty, setView],
  );

  const reset = useCallback(() => setView(1, 0, 0), [setView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      const rect = el.getBoundingClientRect();
      zoomBy(factor, e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomBy]);

  function onPointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("button")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseTx: tx,
      baseTy: ty,
      moved: false,
    };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (
      !dragRef.current.moved &&
      Math.hypot(dx, dy) > DRAG_THRESHOLD_PX
    ) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      setView(
        zoom,
        dragRef.current.baseTx + dx,
        dragRef.current.baseTy + dy,
      );
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    const wasDragging = dragRef.current?.moved ?? false;
    dragRef.current = null;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (!wasDragging) {
      setSelectedSat(null);
    }
  }

  // Stable callbacks for memoised children. Selecting a satellite or
  // AOI is the only thing that re-renders Markers.
  const onSatClick = useCallback(
    (id: string) => {
      setSelectedSat(selectedSatId === id ? null : id);
    },
    [selectedSatId, setSelectedSat],
  );
  const onAOIClick = useCallback(
    (id: string) => {
      setSelectedSat(null);
      setSelectedAOI(id);
    },
    [setSelectedAOI, setSelectedSat],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none overflow-hidden bg-deep-space"
      style={{
        cursor: dragRef.current?.moved ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={reset}
    >
      <div
        className="absolute inset-0"
        style={
          {
            transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: dragRef.current ? "none" : "transform 0.18s ease",
            "--inv-zoom": String(1 / zoom),
          } as React.CSSProperties
        }
      >
        <MapBackground groundTrackPaths={groundTrackPaths} />
        <Markers
          subSats={subSats}
          selectedSatId={selectedSatId}
          onSatClick={onSatClick}
          onAOIClick={onAOIClick}
        />
      </div>

      {selectedSat && (
        <SatelliteTooltipFlat
          sat={selectedSat}
          zoom={zoom}
          tx={tx}
          ty={ty}
          containerRef={containerRef}
          onClose={() => setSelectedSat(null)}
        />
      )}

      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => zoomBy(1.4)}
          aria-label="Zoom in"
          className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-md hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1 / 1.4)}
          aria-label="Zoom out"
          className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-md hover:text-foreground"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset view"
          className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-md hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────
// Memoised children: never depend on zoom/pan state, so they don't
// re-render during pointer drag or wheel events.
// ────────────────────────────────────────────────────────────────────

const MapBackground = memo(function MapBackground({
  groundTrackPaths,
}: {
  groundTrackPaths: string[];
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/textures/earth-day.jpg"
        alt="Equirectangular world map"
        draggable={false}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <svg
        viewBox="0 0 360 180"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {/* Graticule */}
        <g opacity="0.18">
          {[...Array(11)].map((_, i) => {
            const x = -180 + (i + 1) * 30 + 180;
            return (
              <line
                key={`m-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={180}
                stroke="#94A3B8"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {[...Array(5)].map((_, i) => {
            const y = 90 - (90 - (i + 1) * 30);
            return (
              <line
                key={`p-${i}`}
                x1={0}
                y1={y}
                x2={360}
                y2={y}
                stroke="#94A3B8"
                strokeWidth="0.2"
                vectorEffect="non-scaling-stroke"
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
            vectorEffect="non-scaling-stroke"
          />
        </g>
        {/* Ground tracks */}
        <g>
          {groundTrackPaths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={palette.accentGreen}
              strokeOpacity="0.55"
              strokeWidth="0.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.25) 0%, rgba(2,6,23,0) 30%, rgba(2,6,23,0) 70%, rgba(2,6,23,0.45) 100%)",
        }}
      />
    </>
  );
});

const Markers = memo(function Markers({
  subSats,
  selectedSatId,
  onSatClick,
  onAOIClick,
}: {
  subSats: SubSat[];
  selectedSatId: string | null;
  onSatClick: (id: string) => void;
  onAOIClick: (id: string) => void;
}) {
  return (
    <>
      {/* Ground station mast glyphs */}
      {GROUND_STATIONS.map((g) => {
        const { xPct, yPct } = project(g.lat, g.lng);
        return (
          <div
            key={g.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <div className="flex flex-col items-center">
              <span
                aria-hidden
                className="block h-2 w-2 border border-sovsky bg-deepspace gs-glyph"
              />
              <span className="mt-1 whitespace-nowrap rounded-sm bg-background/70 px-1 font-mono text-[8px] uppercase tracking-[0.18em] text-sovsky/85 backdrop-blur-md gs-label">
                {g.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* AOI dots */}
      {AOIS.map((aoi) => {
        const { xPct, yPct } = project(aoi.lat, aoi.lng);
        return (
          <button
            type="button"
            key={aoi.id}
            onClick={(e) => {
              e.stopPropagation();
              onAOIClick(aoi.id);
            }}
            aria-label={`AOI ${aoi.name}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <div className="aoi-glyph">
              <span
                aria-hidden
                className="absolute inset-0 -m-3 animate-pulse rounded-full bg-gold/20 blur-[2px]"
              />
              <span className="relative block h-3 w-3 rounded-full border-2 border-gold bg-gold/60 shadow-[0_0_10px_-2px_hsl(var(--gold-500))] transition-transform group-hover:scale-125" />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-gold/40 bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold backdrop-blur-md">
                {aoi.name}
              </span>
            </div>
          </button>
        );
      })}

      {/* Satellite sub-points */}
      {subSats.map((sat) => {
        const { xPct, yPct } = project(sat.lat, sat.lng);
        const isSelected = selectedSatId === sat.id;
        return (
          <button
            type="button"
            key={sat.id}
            onClick={(e) => {
              e.stopPropagation();
              onSatClick(sat.id);
            }}
            aria-label={`Satellite ${sat.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <span
              aria-hidden
              className={`block rounded-full border sat-glyph ${
                isSelected
                  ? "h-3 w-3 border-sovsky bg-sovsky shadow-[0_0_12px_-2px_hsl(var(--sky-500))]"
                  : "h-2 w-2 border-sovsky/80 bg-sovsky/70"
              }`}
            />
          </button>
        );
      })}

      {/* Inline style block: drives the inverse-zoom transform via a
          CSS variable on the wrapper so glyphs stay readable at any
          zoom level without any of these markers re-rendering when
          zoom changes. */}
      <style>{`
        .gs-glyph { transform: rotate(45deg) scale(var(--inv-zoom)); transform-origin: center; }
        .gs-label { transform: scale(var(--inv-zoom)); transform-origin: center top; }
        .aoi-glyph { transform: scale(var(--inv-zoom)); transform-origin: center; }
        .sat-glyph { transform: scale(var(--inv-zoom)); transform-origin: center; }
      `}</style>
    </>
  );
});

// ────────────────────────────────────────────────────────────────────
// Tooltip pinned to the selected satellite.
// ────────────────────────────────────────────────────────────────────

function SatelliteTooltipFlat({
  sat,
  zoom,
  tx,
  ty,
  containerRef,
  onClose,
}: {
  sat: SubSat;
  zoom: number;
  tx: number;
  ty: number;
  containerRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}) {
  const [pos, setPos] = useState<{ x: number; y: number; pinLeft: boolean }>({
    x: 0,
    y: 0,
    pinLeft: false,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const baseX = ((sat.lng + 180) / 360) * w;
    const baseY = ((90 - sat.lat) / 180) * h;
    const cx = w / 2;
    const cy = h / 2;
    const screenX = cx + (baseX - cx) * zoom + tx;
    const screenY = cy + (baseY - cy) * zoom + ty;
    setPos({ x: screenX, y: screenY, pinLeft: screenX > w * 0.65 });
  }, [sat.lat, sat.lng, zoom, tx, ty, containerRef]);

  const nextAOI = nextAOIForSat(sat.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute z-30 w-[240px] -translate-y-1/2 rounded-lg border border-gold/40 bg-background/95 p-3 shadow-2xl backdrop-blur-md"
      style={{
        left: pos.pinLeft ? "auto" : pos.x + 14,
        right: pos.pinLeft
          ? (containerRef.current?.clientWidth ?? 0) - pos.x + 14
          : "auto",
        top: pos.y,
      }}
      role="tooltip"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
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
