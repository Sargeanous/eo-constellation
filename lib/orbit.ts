// Simple Keplerian propagation for the 22 SAR satellites.
// Per PRD §14: SGP4 is explicitly out of scope. We compute circular
// orbits at fixed inclination and altitude, with 11 evenly-spaced
// orbital planes (RAAN), 2 satellites per plane (true anomaly 180°
// apart). Phase 1 only needs static positions and the orbit polyline;
// Phase 3 will animate by stepping true anomaly with time.
//
// All math returns positions in the Earth-centred frame in **scene
// units** where Earth radius = 1. Satellite radius = 1 + altitudeKm /
// EARTH_RADIUS_KM.

import * as THREE from "three";
import { CONSTELLATION, EARTH_RADIUS_KM, AOIS } from "./data";

const DEG = Math.PI / 180;

export interface SatellitePosition {
  id: string;
  planeIndex: number; // 0..10
  slotIndex: number; // 0..1 within the plane
  position: THREE.Vector3; // scene units, Earth radius = 1
  raanDeg: number;
  trueAnomalyDeg: number;
}

export interface OrbitPlane {
  index: number;
  raanDeg: number;
  /** N polyline points in scene units describing the full orbit. */
  points: THREE.Vector3[];
}

const SAT_RADIUS = 1 + CONSTELLATION.altitudeKm / EARTH_RADIUS_KM;
const INCLINATION_RAD = CONSTELLATION.inclinationDeg * DEG;

/**
 * Convert orbital elements (RAAN, inclination, true anomaly, radius)
 * to a Cartesian position. We assume a circular orbit so eccentricity
 * is zero and argument-of-periapsis can be folded into the true
 * anomaly. Frame: Earth-centred, Z up (north pole), X toward 0°
 * longitude / 0° latitude.
 */
function orbitalToCartesian(
  raanRad: number,
  inclinationRad: number,
  trueAnomalyRad: number,
  radius: number,
): THREE.Vector3 {
  // Position in the orbital plane (perifocal frame).
  const xp = radius * Math.cos(trueAnomalyRad);
  const yp = radius * Math.sin(trueAnomalyRad);
  // Rotate by inclination about the X axis, then by RAAN about Z.
  const cosI = Math.cos(inclinationRad);
  const sinI = Math.sin(inclinationRad);
  const cosO = Math.cos(raanRad);
  const sinO = Math.sin(raanRad);
  const x = cosO * xp - sinO * cosI * yp;
  const y = sinO * xp + cosO * cosI * yp;
  const z = sinI * yp;
  return new THREE.Vector3(x, y, z);
}

/**
 * Compute positions for all 22 satellites at t = 0 (true anomaly 0
 * for slot 0, 180° for slot 1). Phase 1 leaves these static.
 */
export function buildConstellation(): SatellitePosition[] {
  const planes = CONSTELLATION.orbitalPlanes; // 11
  const perPlane = CONSTELLATION.satellitesPerPlane; // 2
  const sats: SatellitePosition[] = [];
  for (let p = 0; p < planes; p++) {
    const raanDeg = (360 / planes) * p;
    const raanRad = raanDeg * DEG;
    for (let s = 0; s < perPlane; s++) {
      const trueAnomalyDeg = (360 / perPlane) * s;
      const taRad = trueAnomalyDeg * DEG;
      sats.push({
        id: `EDGE-SAR-${(p * perPlane + s + 1).toString().padStart(2, "0")}`,
        planeIndex: p,
        slotIndex: s,
        position: orbitalToCartesian(raanRad, INCLINATION_RAD, taRad, SAT_RADIUS),
        raanDeg,
        trueAnomalyDeg,
      });
    }
  }
  return sats;
}

/**
 * One polyline per orbital plane. Sweep true anomaly 0..2π in N
 * segments; the polyline closes automatically because Three.js Line
 * draws an open path so we duplicate the first point at the end.
 */
export function buildOrbitPlanes(segments = 192): OrbitPlane[] {
  const planes: OrbitPlane[] = [];
  for (let p = 0; p < CONSTELLATION.orbitalPlanes; p++) {
    const raanDeg = (360 / CONSTELLATION.orbitalPlanes) * p;
    const raanRad = raanDeg * DEG;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const ta = (i / segments) * Math.PI * 2;
      points.push(
        orbitalToCartesian(raanRad, INCLINATION_RAD, ta, SAT_RADIUS),
      );
    }
    planes.push({ index: p, raanDeg, points });
  }
  return planes;
}

/**
 * Place AOI markers on the Earth surface. lat/lng in degrees → scene
 * unit vector on a unit sphere. Conventional mapping for an
 * equirectangular Blue Marble texture (lng 0 at +X, north pole at +Y
 * for Three.js scenes — but our orbit math has +Z up. We rotate to
 * match the scene convention applied by `EarthMesh` below.)
 */
export function aoiToVector(lat: number, lng: number): THREE.Vector3 {
  const phi = (90 - lat) * DEG; // polar angle from +Z (north pole)
  const theta = lng * DEG;
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.sin(phi) * Math.sin(theta);
  const z = Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const AOI_VECTORS = AOIS.map((a) => ({
  ...a,
  vec: aoiToVector(a.lat, a.lng),
}));

/**
 * MENA-face-on camera target. Roughly centred on (lat 25°N, lng 50°E).
 */
export const MENA_CENTRE = aoiToVector(25, 50);

// ────────────────────────────────────────────────────────────────────
// Tap-to-inspect helpers (Phase 3).
// PRD §14: real Keplerian propagation, no SGP4. Sub-satellite-point
// math is the inverse of `aoiToVector`. Next-pass timings are
// deterministic plausible stubs — not real propagation. They read as
// sub-hour SLA evidence and stay stable across clicks (so the same
// AOI always shows the same next 3 passes inside one session).
// ────────────────────────────────────────────────────────────────────

const DEG_TO_DEG = 180 / Math.PI;

export function positionToLatLng(v: THREE.Vector3): {
  lat: number;
  lng: number;
} {
  // Inverse of `aoiToVector` — assumes v is in the orbit frame
  // (Z = north pole), which is how SatellitePosition.position is stored.
  const norm = v.clone().normalize();
  const lat = 90 - Math.acos(norm.z) * DEG_TO_DEG;
  const lng = Math.atan2(norm.y, norm.x) * DEG_TO_DEG;
  return { lat, lng };
}

function hashString(s: string): number {
  let h = 2_166_136_261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16_777_619) >>> 0;
  }
  return h;
}

export interface NextPass {
  satId: string;
  etaMin: number;
}

/**
 * 3 deterministic plausible "next pass" entries for an AOI. Stays
 * stable for a given aoiId — same input, same output, always.
 */
export function nextPassesForAOI(aoiId: string, count = 3): NextPass[] {
  const seed = hashString(aoiId);
  const passes: NextPass[] = [];
  for (let i = 0; i < count; i++) {
    const satIdx = ((seed >>> (i * 4)) % 22) + 1;
    const etaBase = 6 + ((seed >>> (i * 5)) % 18);
    const eta = etaBase + i * 19;
    passes.push({
      satId: `EDGE-SAR-${satIdx.toString().padStart(2, "0")}`,
      etaMin: eta,
    });
  }
  return passes;
}

/**
 * For a given satellite, the next AOI it'll image. Deterministic.
 */
export function nextAOIForSat(satId: string): {
  aoiId: string;
  aoiName: string;
  etaMin: number;
} {
  const seed = hashString(satId);
  const aoi = AOIS[seed % AOIS.length]!;
  const eta = 7 + (seed % 28);
  return { aoiId: aoi.id, aoiName: aoi.name, etaMin: eta };
}
