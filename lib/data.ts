// EO-CONSTELLATION — single source of truth for all rendered content.
// No network. No backend. Editable in the IDE, hot-reload-friendly.
// Numbers trace to the source deck:
// reference/source_deck.pptx (Sovereign Constellation Plan, Cost
// Optimization with Sub-Hour Revisit Capability).

// ────────────────────────────────────────────────────────────────────
// 6-screen narrative — used by the bottom dock.
// ────────────────────────────────────────────────────────────────────

export type ScreenId =
  | "intro"
  | "problem"
  | "mission"
  | "constellation"
  | "investment"
  | "decision";

export interface Screen {
  id: ScreenId;
  index: number;
  title: string;
  subtitle: string;
  href: string;
}

export const SCREENS: Screen[] = [
  {
    id: "intro",
    index: 0,
    title: "EO-CONSTELLATION",
    subtitle: "Sub-1-Hour MENA Revisit. Sovereign by design.",
    href: "/",
  },
  {
    id: "problem",
    index: 1,
    title: "The Problem",
    subtitle: "You've tried this before. Here's why it failed.",
    href: "/problem",
  },
  {
    id: "mission",
    index: 2,
    title: "The 1-Hour SLA — Live",
    subtitle: "Watch this.",
    href: "/mission",
  },
  {
    id: "constellation",
    index: 3,
    title: "The Constellation",
    subtitle: "22 satellites. 350 km. 38 degrees.",
    href: "/constellation",
  },
  {
    id: "investment",
    index: 4,
    title: "The Cost & Timeline",
    subtitle: "$225.7M. 27 months to first light.",
    href: "/investment",
  },
  {
    id: "decision",
    index: 5,
    title: "The Decision",
    subtitle: "Sovereign. AI-native. Built for MENA.",
    href: "/decision",
  },
];

// ────────────────────────────────────────────────────────────────────
// Palette — mirror of the CSS tokens for code that needs raw hex
// (Three.js materials, Recharts strokes, Tone.js debug overlays).
// ────────────────────────────────────────────────────────────────────

export const palette = {
  bg: "#020617",
  bgPanel: "#0F172A",
  bgPanelHi: "#1E293B",
  text: "#F1F5F9",
  textMuted: "#94A3B8",
  accentGold: "#D4A949",
  accentAmber: "#F59E0B",
  accentRed: "#E11D48",
  accentGreen: "#10B981",
  accentSky: "#38BDF8",
  borderSubtle: "#1E293B",
} as const;

// ────────────────────────────────────────────────────────────────────
// Constellation — the canonical 22-SAR config (cost slide).
// ────────────────────────────────────────────────────────────────────

export const CONSTELLATION = {
  name: "EDGE Sovereign EO Constellation",
  shortName: "EO-CONSTELLATION",
  totalSatellites: 22,
  satelliteType: "SAR" as const,
  altitudeKm: 350,
  inclinationDeg: 38,
  inclinationToleranceDeg: 3,
  frequencyBand: "X-Band",
  orbitalPlanes: 11,
  satellitesPerPlane: 2,
  resolutionMeters: { spotlight: 0.3, stripmap: 0.5 },
  satelliteWeightKg: 150,
  dimensionsM: { l: 3.655, w: 2.325, h: 0.668 },
  nesz: "<-20dB",
  polarization: "VV",
  isSunSynchronous: false,
  dailyCoverageKm2: 17_800_000,
  meanRevisitHours: { min: 0.83, avg: 1.03, max: 1.19 },
  dataLatencyHours: { min: 0.5, avg: 1.0 },
} as const;

// Earth radius used for all in-scene math (km).
export const EARTH_RADIUS_KM = 6371;

// ────────────────────────────────────────────────────────────────────
// Cost (USD).
// ────────────────────────────────────────────────────────────────────

export const COST_USD = {
  perSatellite: 10_189_000,
  satellitesTotal: 224_158_000,
  opsAndControl: 1_563_000,
  grandTotal: 225_721_000,
  marketComparisonNote:
    "40-50% below market for comparable LEO EO constellations.",
} as const;

// ────────────────────────────────────────────────────────────────────
// SLA — the 1-hour mission, broken into 4 narrated steps.
// demoSeconds defines the compressed-time budget on screen 3.
// Sum of demoSeconds is 60 (per §13.1, locked).
// ────────────────────────────────────────────────────────────────────

export interface SLASubstep {
  name: string;
  durationMin: number;
}

export interface SLAStep {
  id: 1 | 2 | 3 | 4;
  name: string;
  caption: string;
  boundMinutes: number;
  demoSeconds: number;
  startMissionSeconds: number;
  endMissionSeconds: number;
  startDemoMs: number;
  endDemoMs: number;
  substeps?: SLASubstep[];
}

// Real timing (mission seconds, integer):
// Step 1 ends at 0:42 (42s)
// Step 2 ends at 58:00 (3480s)  — internal: tasking 0:42→3:00, revisit 3:00→48:00, capture/downlink 48:00→58:00
// Step 3 ends at 58:30 (3510s)
// Step 4 ends at 58:42 (3522s)
// Demo timing (demo ms): step 1 = 4s, step 2 = 50s, step 3 = 4s, step 4 = 2s — total 60s.

export const SLA_STEPS: SLAStep[] = [
  {
    id: 1,
    name: "Situation Awareness & Intel Generation",
    caption: "OSINT + GEOINT fusion. AI agent classifies and prioritizes.",
    boundMinutes: 1,
    demoSeconds: 4,
    startMissionSeconds: 0,
    endMissionSeconds: 42,
    startDemoMs: 0,
    endDemoMs: 4_000,
  },
  {
    id: 2,
    name: "Satellite Tasking & Data Capture",
    caption: "Sovereign tasking, no foreign approval. SAR-07 acknowledged.",
    boundMinutes: 55,
    demoSeconds: 50,
    startMissionSeconds: 42,
    endMissionSeconds: 3_480,
    startDemoMs: 4_000,
    endDemoMs: 54_000,
    substeps: [
      { name: "Tasking", durationMin: 2 },
      { name: "Revisit", durationMin: 45 },
      { name: "Capture & Downlink", durationMin: 8 },
    ],
  },
  {
    id: 3,
    name: "Automated Analytics & Validation",
    caption: "Onboard CV models. No human in the loop. No foreign cloud.",
    boundMinutes: 3,
    demoSeconds: 4,
    startMissionSeconds: 3_480,
    endMissionSeconds: 3_510,
    startDemoMs: 54_000,
    endDemoMs: 58_000,
  },
  {
    id: 4,
    name: "Report on Desk/Screen",
    caption: "Branded report, AR + EN, on the desk.",
    boundMinutes: 1,
    demoSeconds: 2,
    startMissionSeconds: 3_510,
    endMissionSeconds: 3_522,
    startDemoMs: 58_000,
    endDemoMs: 60_000,
  },
];

export const MISSION_TOTAL_DEMO_MS = 60_000;
export const MISSION_TOTAL_SECONDS = 3_522;
export const FINAL_MISSION_TIME = "58:42";
export const STATUS_QUO_HOURS = 72;
export const SPEEDUP_PCT = 7388;

// ────────────────────────────────────────────────────────────────────
// Areas of Interest.
// ────────────────────────────────────────────────────────────────────

export interface AOI {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dailyPasses: number;
}

export const AOIS: AOI[] = [
  { id: "palestine", name: "Palestine", lat: 31.95, lng: 35.23, dailyPasses: 33 },
  { id: "tehran", name: "Tehran", lat: 35.69, lng: 51.39, dailyPasses: 54 },
  { id: "hormuz", name: "Strait of Hormuz", lat: 26.57, lng: 56.25, dailyPasses: 24 },
  { id: "gulfofoman", name: "Gulf of Oman", lat: 24.5, lng: 58.5, dailyPasses: 21 },
];

// ────────────────────────────────────────────────────────────────────
// Simulation comparison (sandbox table on /constellation).
// 4 configs tested; the 22-SAR one is selected.
// ────────────────────────────────────────────────────────────────────

export interface SimulationConfig {
  id: string;
  inclinationDeg: number;
  sar: number;
  optical: number;
  avgRevisitH: number;
  coverageMaxLatDeg: number;
  selected: boolean;
  note?: string;
}

export const SIMULATION_CONFIGS: SimulationConfig[] = [
  {
    id: "c1",
    inclinationDeg: 38,
    sar: 12,
    optical: 12,
    avgRevisitH: 1.5,
    coverageMaxLatDeg: 41,
    selected: false,
  },
  {
    id: "c2",
    inclinationDeg: 40,
    sar: 12,
    optical: 12,
    avgRevisitH: 1.6,
    coverageMaxLatDeg: 43,
    selected: false,
  },
  {
    id: "c3",
    inclinationDeg: 42,
    sar: 12,
    optical: 12,
    avgRevisitH: 1.7,
    coverageMaxLatDeg: 45,
    selected: false,
  },
  {
    id: "c4",
    inclinationDeg: 38,
    sar: 22,
    optical: 0,
    avgRevisitH: 1.03,
    coverageMaxLatDeg: 41,
    selected: true,
    note: "Final cost-optimized configuration. SAR-only at 38°+3°, $225.7M total.",
  },
];

export interface POIRevisitC1 {
  sar: string;
  opt: string;
  total: string;
}
export interface POIRevisitC4 {
  total: string;
}
export interface POIRevisit {
  poi: string;
  c1: POIRevisitC1;
  c4: POIRevisitC4;
}

export const POI_REVISITS: POIRevisit[] = [
  {
    poi: "P2",
    c1: { sar: "12-15", opt: "4", total: "16-19" },
    c4: { total: "11-28" },
  },
  {
    poi: "P5",
    c1: { sar: "15-17", opt: "4-6", total: "19-23" },
    c4: { total: "16-37" },
  },
  {
    poi: "P6",
    c1: { sar: "13", opt: "3-4", total: "16-17" },
    c4: { total: "15-28" },
  },
  {
    poi: "P13",
    c1: { sar: "11-13", opt: "3-4", total: "14-17" },
    c4: { total: "15-20" },
  },
  {
    poi: "P14",
    c1: { sar: "12-15", opt: "3-4", total: "15-19" },
    c4: { total: "14-35" },
  },
];

// ────────────────────────────────────────────────────────────────────
// Differentiator tiles on /decision.
// ────────────────────────────────────────────────────────────────────

export interface Differentiator {
  id: "sovereign" | "counter" | "ai_native" | "tactica_synergy";
  title: string;
  body: string;
  icon: "shield" | "shuffle" | "cpu" | "link";
}

export const DIFFERENTIATORS: Differentiator[] = [
  {
    id: "sovereign",
    title: "Sovereign Data Control",
    body: "End-to-end UAE control. Encryption, audit trails, sovereign cloud. Zero foreign dependency.",
    icon: "shield",
  },
  {
    id: "counter",
    title: "Counter-Countermeasure Orbit",
    body: "Non-sun-synchronous orbit makes overpass times unpredictable. Adversary evasion playbooks become useless.",
    icon: "shuffle",
  },
  {
    id: "ai_native",
    title: "AI-Native by Design",
    body: "First AI-native EO constellation in the region. Onboard CV, automated analytics, no human-in-the-loop bottleneck.",
    icon: "cpu",
  },
  {
    id: "tactica_synergy",
    title: "Synergy with TACTICA",
    body: "TACTICA is the brain. EO-CONSTELLATION is the actuator. The two together close the OODA loop in under an hour.",
    icon: "link",
  },
];

// ────────────────────────────────────────────────────────────────────
// 27-month timeline.
// ────────────────────────────────────────────────────────────────────

export interface TimelineTask {
  name: string;
  months: [number, number | null];
}

export interface TimelinePhase {
  id: "design" | "execution" | "operations";
  name: string;
  durationMonths: number | null;
  startMonth: number;
  tasks: TimelineTask[];
}

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: "design",
    name: "Constellation & Mission Design",
    durationMonths: 9,
    startMonth: 1,
    tasks: [
      { name: "Constellation Simulation", months: [1, 1] },
      { name: "High-level System Design", months: [2, 2] },
      { name: "Team Mobilization & Logistics", months: [2, 3] },
      { name: "Low-level System Design", months: [3, 5] },
      { name: "Ground Segment Planning", months: [5, 8] },
      { name: "Launch Window Reservation", months: [6, 7] },
      { name: "Regulatory & Licensing Compliance", months: [5, 9] },
      { name: "Risk Management Plan", months: [7, 9] },
    ],
  },
  {
    id: "execution",
    name: "Mission Execution",
    durationMonths: 17.5,
    startMonth: 9,
    tasks: [
      { name: "Satellite Manufacturing", months: [9, 26] },
      { name: "Ground Segment Development", months: [9, 19] },
      { name: "Testing & Validation", months: [22, 26] },
      { name: "Launch Execution", months: [26, 27] },
    ],
  },
  {
    id: "operations",
    name: "Operations & Control",
    durationMonths: null,
    startMonth: 27,
    tasks: [
      { name: "Transition to Operations", months: [27, 28.5] },
      { name: "Data Management on Defense Cloud", months: [27, 29] },
      { name: "Maintenance & Upgrades", months: [29, null] },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────
// Status-quo timeline (left column on /problem).
// ────────────────────────────────────────────────────────────────────

export interface StatusQuoFriction {
  hours: [number, number];
  label: string;
  friction: string;
}

export const STATUS_QUO_FRICTIONS: StatusQuoFriction[] = [
  {
    hours: [0, 8],
    label: "Vendor request & negotiation",
    friction: "Sensitive AOIs refused 3× this year.",
  },
  {
    hours: [8, 56],
    label: "Tasking approval & vendor scheduling",
    friction: "48h average for non-urgent.",
  },
  {
    hours: [56, 68],
    label: "Imagery acquisition & downlink",
    friction: "Routes through foreign ground stations.",
  },
  {
    hours: [68, 72],
    label: "Manual analysis & report",
    friction: "Human-in-the-loop. English-only models.",
  },
];

// ────────────────────────────────────────────────────────────────────
// EO-CONSTELLATION timeline (right column on /problem). Mirrors the
// SLA_STEPS but in the same hour-axis units as STATUS_QUO_FRICTIONS so
// they can plot on a shared horizontal scale.
// ────────────────────────────────────────────────────────────────────

export const EOC_TIMELINE: StatusQuoFriction[] = [
  {
    hours: [0, 1 / 60],
    label: "Sovereign AI agent generates intel",
    friction: "In-house OSINT/GEOINT fusion.",
  },
  {
    hours: [1 / 60, 55 / 60],
    label: "Constellation tasks & captures",
    friction: "Sovereign tasking, no foreign approval.",
  },
  {
    hours: [55 / 60, 58 / 60],
    label: "Onboard analytics",
    friction: "AI-native, sovereign cloud.",
  },
  {
    hours: [58 / 60, 58.7 / 60],
    label: "Report",
    friction: "AR + EN, on the desk.",
  },
];

// ────────────────────────────────────────────────────────────────────
// Report PDF header/footer (per §13.3, decided 2026-05-05).
// ────────────────────────────────────────────────────────────────────

export const REPORT_HEADER = "EDGE Sovereign EO Constellation — Mission Report";
export const REPORT_FOOTER = "Powered by Origen | A TACTICA Capability";
