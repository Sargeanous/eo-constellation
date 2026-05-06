// EO-CONSTELLATION: single source of truth for all rendered content.
// No network. No backend. Editable in the IDE, hot-reload-friendly.
// Numbers trace to the source deck:
// reference/source_deck.pptx (Sovereign Constellation Plan, Cost
// Optimization with Sub-Hour Revisit Capability).

// ────────────────────────────────────────────────────────────────────
// 6-screen narrative: used by the bottom dock.
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
    title: "The 1-Hour SLA: Live",
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
// Palette: mirror of the CSS tokens for code that needs raw hex
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
// Constellation: the canonical 22-SAR config (cost slide).
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
// SLA: the sub-1-hour mission, broken into 4 narrated steps.
//
// Two clocks per step, decoupled:
//   - The mission clock advances from startMissionSeconds to
//     endMissionSeconds over the [startDemoMs, clockEndDemoMs] window.
//   - The step's content (alert card, globe inset, bounding boxes,
//     report) renders over the full [startDemoMs, endDemoMs] window.
// After clockEndDemoMs the clock holds at endMissionSeconds while
// the rest of the step finishes. This lets the clock tick at a
// natural "1 mission minute = 1 real second" pace during steps 1 / 3
// / 4 (which span well under a minute of mission time, so the clock
// finishes in a fraction of a real second) without the content
// being cut off mid-render.
//
// Step 2 has no hold: clockEndDemoMs == endDemoMs, so the clock
// advances continuously and visibly fast-forwards through the
// 57-minute revisit window. That's the speedup beat.
//
// Pacing target:
//   Step 1 / 3 / 4 clock-active rate: ~60 mission sec per real sec
//                                     (= 1 mission minute per real
//                                     second, what the operator
//                                     called "normal")
//   Step 2 clock-active rate         : ~265 mission sec per real sec
//                                     (~4.4× normal, clear speedup)
//
// Total demo time: 20 sec.
// ────────────────────────────────────────────────────────────────────

export interface SLASubstep {
  name: string;
  durationMin: number;
  /** Demo-time window of this substep within its parent step's
   *  demoMs range. Used by the Step 2 sub-animations to drive the
   *  tasking → revisit → capture/downlink choreography. */
  startDemoMs: number;
  endDemoMs: number;
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
  /** Demo-time at which the mission clock REACHES endMissionSeconds
   *  and starts holding. For steps where clock = step (no hold),
   *  set this equal to endDemoMs. */
  clockEndDemoMs: number;
  substeps?: SLASubstep[];
}

export const SLA_STEPS: SLAStep[] = [
  {
    id: 1,
    name: "Situation Awareness & Intel Generation",
    caption: "OSINT + GEOINT fusion. AI agent classifies and prioritizes.",
    boundMinutes: 1,
    demoSeconds: 3,
    startMissionSeconds: 0,
    endMissionSeconds: 42,
    startDemoMs: 0,
    endDemoMs: 3_000,
    // Clock advances 0:00 → 0:42 over 700ms (60x), holds at 0:42 for
    // the remaining 2.3s while the alert card + AI agent tile finish
    // animating in.
    clockEndDemoMs: 700,
  },
  {
    id: 2,
    name: "Satellite Tasking & Data Capture",
    caption: "Sovereign tasking, no foreign approval. SAR-07 acknowledged.",
    boundMinutes: 55,
    demoSeconds: 13,
    startMissionSeconds: 42,
    endMissionSeconds: 3_480,
    startDemoMs: 3_000,
    endDemoMs: 16_000,
    // Clock advances throughout step 2 (no hold). Average rate:
    // 3438 mission sec / 13 demo sec ≈ 264 mission sec/real sec ≈
    // 4.4× normal. This is the visible fast-forward.
    clockEndDemoMs: 16_000,
    substeps: [
      {
        name: "Tasking",
        durationMin: 2,
        startDemoMs: 3_000,
        endDemoMs: 4_500,
      },
      {
        name: "Revisit",
        durationMin: 45,
        startDemoMs: 4_500,
        endDemoMs: 14_000,
      },
      {
        name: "Capture & Downlink",
        durationMin: 10,
        startDemoMs: 14_000,
        endDemoMs: 16_000,
      },
    ],
  },
  {
    id: 3,
    name: "Automated Analytics & Validation",
    caption: "Onboard CV models. No human in the loop. No foreign cloud.",
    boundMinutes: 3,
    demoSeconds: 2,
    startMissionSeconds: 3_480,
    endMissionSeconds: 3_510,
    startDemoMs: 16_000,
    endDemoMs: 18_000,
    // Clock advances 58:00 → 58:30 over 500ms (60x), holds the rest
    // (1.5s) while bounding boxes appear.
    clockEndDemoMs: 16_500,
  },
  {
    id: 4,
    name: "Report on Desk/Screen",
    caption: "Branded report, AR + EN, on the desk.",
    boundMinutes: 1,
    demoSeconds: 2,
    startMissionSeconds: 3_510,
    endMissionSeconds: 3_522,
    startDemoMs: 18_000,
    endDemoMs: 20_000,
    // Clock advances 58:30 → 58:42 over 200ms (60x), holds at 58:42
    // for 1.8s while the report PDF preview slides up. The next tick
    // after this holds the FinalBeat takes over.
    clockEndDemoMs: 18_200,
  },
];

export const MISSION_TOTAL_DEMO_MS = 20_000;
export const MISSION_TOTAL_SECONDS = 3_522;
/** Headline result the demo lands on. Phrasing kept deliberately
 *  honest: there is no real mission run, so we don't manufacture a
 *  precise minute:second number. */
export const FINAL_MISSION_TIME = "< 1 hour";
export const STATUS_QUO_HOURS = 72;
/** One-line tagline that replaces the "7,388% faster" line. */
export const RESULT_TAGLINE = "End-to-end intelligence cycle, in under one hour.";

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
    friction: "Sensitive AOIs routinely refused by foreign vendors.",
  },
  {
    hours: [8, 56],
    label: "Tasking approval & vendor scheduling",
    friction: "48h is typical for non-urgent tasking.",
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

/** Footnote that anchors the status-quo numbers to a verifiable
 *  source. Shown as small italic text below the friction list. */
export const STATUS_QUO_SOURCE =
  "Industry-typical figures. Source: program briefings + Sovereign Constellation Plan, internal.";

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

export const REPORT_HEADER = "EDGE Sovereign EO Constellation: Mission Report";
export const REPORT_FOOTER = "Powered by Origen | A TACTICA Capability";

// ────────────────────────────────────────────────────────────────────
// Methodology depth: sourced from the partner (STAR.VISION) simulation
// deck and applied to the canonical 22 SAR config. These power the
// "How was this designed?" modal on /constellation.
// ────────────────────────────────────────────────────────────────────

export interface SatelliteCapability {
  /** ±N° off-nadir tilt enabling multi-target imaging in a single pass. */
  slewAngleDeg: number;
  /** SAR-mode-specific swath. Spotlight and StripMap differ; we won't
   *  invent a value: the partner spec sheet (STAR.VISION) lands these.
   *  null → render "-" in the UI. */
  swathKm: {
    spotlight: number | null;
    stripmap: number | null;
  };
  imagingModes: string[];
  polarization: string;
}

export const SATELLITE_CAPABILITY: SatelliteCapability = {
  slewAngleDeg: 30,
  swathKm: {
    spotlight: null, // TODO: source from STAR.VISION SAR spec sheet.
    stripmap: null, // TODO: same.
  },
  imagingModes: ["Spotlight (0.3 m GSD)", "StripMap (0.5 m GSD)"],
  polarization: "VV",
};

export interface OrbitalGeometry {
  /** Walker-Delta convention: total/planes/phasing. We store the
   *  human-readable shorthand in walkerDeltaNotation; the underlying
   *  fields are also exposed for the diagram. */
  walkerDeltaNotation: string;
  ascendingNodeSpacingDeg: number;
  satellitesPerPlane: number;
  totalPlanes: number;
  isWalkerDeltaClass: boolean;
}

export const ORBITAL_GEOMETRY: OrbitalGeometry = {
  walkerDeltaNotation: "11P/2S",
  ascendingNodeSpacingDeg: 360 / 11,
  satellitesPerPlane: 2,
  totalPlanes: 11,
  isWalkerDeltaClass: true,
};

export interface TargetClustering {
  description: string;
  exampleTotalTargets: number;
  exampleAscendingPasses: number;
  exampleDescendingPasses: number;
  exampleOutliers: number;
}

export const TARGET_CLUSTERING: TargetClustering = {
  description:
    "Custom clustering tool groups POIs by their position relative to orbital tracks, aligned with the imaging swath. One satellite pass can image multiple targets via slew, dramatically improving daily revisit efficiency.",
  exampleTotalTargets: 35,
  exampleAscendingPasses: 11,
  exampleDescendingPasses: 15,
  exampleOutliers: 1,
};
