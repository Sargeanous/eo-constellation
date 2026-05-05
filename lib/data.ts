// EO-CONSTELLATION's only data module. Everything the screens render
// flows from this file. No network. No backend. Editable in the IDE,
// hot-reload-friendly.

export type ScreenId =
  | "intro"
  | "problem"
  | "mission"
  | "constellation"
  | "investment"
  | "decision";

export interface Screen {
  id: ScreenId;
  title: string; // <DOMAIN_PLACEHOLDER>
  subtitle: string; // <DOMAIN_PLACEHOLDER>
  href: string;
}

export const SCREENS: Screen[] = [
  {
    id: "intro",
    title: "<DOMAIN_PLACEHOLDER>",
    subtitle: "<DOMAIN_PLACEHOLDER>",
    href: "/",
  },
  {
    id: "problem",
    title: "<DOMAIN_PLACEHOLDER>",
    subtitle: "<DOMAIN_PLACEHOLDER>",
    href: "/problem",
  },
  {
    id: "mission",
    title: "<DOMAIN_PLACEHOLDER>",
    subtitle: "<DOMAIN_PLACEHOLDER>",
    href: "/mission",
  },
  {
    id: "constellation",
    title: "<DOMAIN_PLACEHOLDER>",
    subtitle: "<DOMAIN_PLACEHOLDER>",
    href: "/constellation",
  },
  {
    id: "investment",
    title: "<DOMAIN_PLACEHOLDER>",
    subtitle: "<DOMAIN_PLACEHOLDER>",
    href: "/investment",
  },
  {
    id: "decision",
    title: "<DOMAIN_PLACEHOLDER>",
    subtitle: "<DOMAIN_PLACEHOLDER>",
    href: "/decision",
  },
];

export interface MissionPhaseSpec {
  id: "tasking" | "uplink" | "imaging" | "downlink" | "delivered";
  startMs: number;
  endMs: number;
  label: string; // <DOMAIN_PLACEHOLDER>
}

// <DOMAIN_PLACEHOLDER>: 5 phases summing to ~50,000 ms.
export const MISSION_TIMELINE: MissionPhaseSpec[] = [
  { id: "tasking", startMs: 0, endMs: 8000, label: "<DOMAIN_PLACEHOLDER>" },
  { id: "uplink", startMs: 8000, endMs: 16000, label: "<DOMAIN_PLACEHOLDER>" },
  {
    id: "imaging",
    startMs: 16000,
    endMs: 32000,
    label: "<DOMAIN_PLACEHOLDER>",
  },
  {
    id: "downlink",
    startMs: 32000,
    endMs: 44000,
    label: "<DOMAIN_PLACEHOLDER>",
  },
  {
    id: "delivered",
    startMs: 44000,
    endMs: 50000,
    label: "<DOMAIN_PLACEHOLDER>",
  },
];

export const MISSION_TOTAL_MS = 50_000;

export interface SatelliteSpec {
  id: string;
  altitudeKm: number;
  inclinationDeg: number;
  raanDeg: number;
}

// <DOMAIN_PLACEHOLDER>: minimal fields for marker rendering, not real orbital math.
export const CONSTELLATION: SatelliteSpec[] = [
  { id: "SAT-A1", altitudeKm: 550, inclinationDeg: 53, raanDeg: 0 },
  { id: "SAT-A2", altitudeKm: 550, inclinationDeg: 53, raanDeg: 60 },
  { id: "SAT-A3", altitudeKm: 550, inclinationDeg: 53, raanDeg: 120 },
  { id: "SAT-A4", altitudeKm: 550, inclinationDeg: 53, raanDeg: 180 },
  { id: "SAT-A5", altitudeKm: 550, inclinationDeg: 53, raanDeg: 240 },
  { id: "SAT-A6", altitudeKm: 550, inclinationDeg: 53, raanDeg: 300 },
];

export interface InvestmentLine {
  id: string;
  label: string; // <DOMAIN_PLACEHOLDER>
  amountAed: number;
  notes?: string;
}

// <DOMAIN_PLACEHOLDER>
export const INVESTMENT: InvestmentLine[] = [];
