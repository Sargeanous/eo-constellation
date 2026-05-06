"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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
// Replaces the live 3D globe in the constellation section: hard to
// mis-place a dot on a flat map since lat/lng → (x,y) is one line of
// math each, and the operator can read each label without rotating
// anything.
//
// Conventions:
//   xPct = ((lng + 180) / 360) * 100
//   yPct = ((90  - lat) /  180) * 100
//
// The Blue Marble image we ship is full-world equirectangular north-up,
// so the same projection lines up with the texture exactly.
//
// Zoom + pan: a controlled transform on an inner wrapper. Wheel zooms
// toward the cursor, drag pans, double-click + the +/- and reset
// buttons in the corner provide explicit controls. Pinch-zoom is
// handled natively on touch surfaces via touch-action: pinch-zoom.

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const DRAG_THRESHOLD_PX = 4;

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
 *  a horizontal "wrap" line across the whole map. Returns one or
 *  more sub-polylines that each stay within a single ±180° band. */
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

  // Sub-satellite points for each of the 22 birds.
  const subSats = useMemo(() => {
    return buildConstellation().map((s) => {
      const ll = positionToLatLng(s.position);
      return { ...s, lat: ll.lat, lng: ll.lng };
    });
  }, []);

  // Ground-track polylines: project each plane's 192 sample points to
  // lat/lng, split at the antimeridian, and convert to SVG path
  // strings in viewBox 360x180 (1 unit = 1 degree).
  const groundTrackPaths = useMemo(() => {
    const paths: string[] = [];
    for (const plane of buildOrbitPlanes(192)) {
      const ll = plane.points.map((v) => positionToLatLng(v));
      const segments = splitAntimeridian(ll);
      for (const seg of segments) {
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

  function clampPan(z: number, x: number, y: number) {
    const el = containerRef.current;
    if (!el) return { x, y };
    const w = el.clientWidth;
    const h = el.clientHeight;
    // Keep the scaled image filling the viewport: max pan = (z-1)*size/2.
    const maxX = ((z - 1) * w) / 2;
    const maxY = ((z - 1) * h) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }

  function setView(z: number, x: number, y: number) {
    const cz = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
    const c = clampPan(cz, x, y);
    setZoom(cz);
    setTx(c.x);
    setTy(c.y);
  }

  function zoomBy(factor: number, focusX?: number, focusY?: number) {
    const el = containerRef.current;
    if (!el) {
      setView(zoom * factor, tx, ty);
      return;
    }
    const rect = el.getBoundingClientRect();
    const fx = focusX ?? rect.width / 2;
    const fy = focusY ?? rect.height / 2;
    // The point under (fx, fy) in scaled space is (fx - tx)/zoom in
    // base coords. After zoom, we want that same base point still at
    // (fx, fy) → solve for new tx/ty.
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * factor));
    const baseX = (fx - rect.width / 2 - tx) / zoom;
    const baseY = (fy - rect.height / 2 - ty) / zoom;
    const newTx = fx - rect.width / 2 - baseX * newZoom;
    const newTy = fy - rect.height / 2 - baseY * newZoom;
    setView(newZoom, newTx, newTy);
  }

  function reset() {
    setView(1, 0, 0);
  }

  // Wheel: prevent default page scroll only when actually zooming
  // (i.e. inside the map container). Attached imperatively so we can
  // call preventDefault with a non-passive listener.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, tx, ty]);

  function onPointerDown(e: React.PointerEvent) {
    // Skip drag if the press started on a button (AOI / sat dot / zoom
    // controls), so taps still work.
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
      // Tap on background → close any open satellite tooltip.
      setSelectedSat(null);
    }
  }
  function onDoubleClick() {
    reset();
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none overflow-hidden bg-deep-space"
      style={{ cursor: dragRef.current?.moved ? "grabbing" : "grab", touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      {/* Zoom transform wrapper. transformOrigin "center" lets us pan
          symmetrically around the centre of the viewport. */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: dragRef.current ? "none" : "transform 0.18s ease",
        }}
      >
        {/* Background map */}
        <img
          src="/textures/earth-day.jpg"
          alt="Equirectangular world map"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90"
        />

        {/* Overlay SVG: graticule + ground tracks. Lives in the same
            zoom layer so the curves and lat/lng grid scale with the
            map. */}
        <svg
          viewBox="0 0 360 180"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {/* Graticule: faint lat/lng grid every 30°/30°. */}
          <g opacity="0.18">
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
                  vectorEffect="non-scaling-stroke"
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

          {/* Ground tracks: one polyline per orbital plane, projected
              from the 3D orbit and split at the antimeridian. Bright
              green like the reference imagery. */}
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

        {/* Soft sovereign-tinted overlay so the typography reads */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(2,6,23,0.25) 0%, rgba(2,6,23,0) 30%, rgba(2,6,23,0) 70%, rgba(2,6,23,0.45) 100%)",
          }}
        />

        {/* Ground station markers (UAE) - small mast glyphs */}
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
                  className="block h-2 w-2 rotate-45 border border-sovsky bg-deepspace"
                  style={{ transform: `rotate(45deg) scale(${1 / zoom})`, transformOrigin: "center" }}
                />
                <span
                  className="mt-1 whitespace-nowrap rounded-sm bg-background/70 px-1 font-mono text-[8px] uppercase tracking-[0.18em] text-sovsky/85 backdrop-blur-md"
                  style={{ transform: `scale(${1 / zoom})`, transformOrigin: "center top" }}
                >
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
              <div
                style={{
                  transform: `scale(${1 / zoom})`,
                  transformOrigin: "center",
                }}
              >
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
                    : "h-2 w-2 border-sovsky/80 bg-sovsky/70"
                }`}
                style={{
                  transform: `scale(${1 / zoom})`,
                  transformOrigin: "center",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Tooltip for the selected satellite. Lives in the un-zoomed
          layer so it stays at a readable size at any zoom level. */}
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

      {/* Zoom controls top-right. Won't fight pointer-down because of
          the closest("button") guard. */}
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

function SatelliteTooltipFlat({
  sat,
  zoom,
  tx,
  ty,
  containerRef,
  onClose,
}: {
  sat: { id: string; lat: number; lng: number };
  zoom: number;
  tx: number;
  ty: number;
  containerRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}) {
  // The dot lives in the zoom-transformed layer; we want the tooltip
  // pinned next to where it appears on the screen but rendered at
  // 1:1 scale. So compute the dot's screen position from container
  // size + zoom + pan + projected (xPct, yPct).
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
    // Same transform applied to the inner wrapper:
    //   screen = center + (base - center) * zoom + pan
    const cx = w / 2;
    const cy = h / 2;
    const screenX = cx + (baseX - cx) * zoom + tx;
    const screenY = cy + (baseY - cy) * zoom + ty;
    const pinLeft = screenX > w * 0.65;
    setPos({ x: screenX, y: screenY, pinLeft });
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
