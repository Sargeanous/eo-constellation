import { create } from "zustand";

export type MissionPhase =
  | "idle"
  | "tasking"
  | "uplink"
  | "imaging"
  | "downlink"
  | "delivered";

export type CtaMode = "theatrical" | "neutral";

interface DemoState {
  /** Index into the 6-screen flow (0 = intro, 5 = decision). The
   *  persistent dock at the bottom of every page reads this to highlight
   *  the active step and to fan out next/prev affordances. */
  screenIndex: number;
  setScreenIndex: (i: number) => void;

  /** Audio gate. Tone.js requires a user gesture before AudioContext
   *  can start; once enabled it stays on. Persisted to localStorage so
   *  a refresh keeps the user's choice. Default OFF (PRD §13.2). */
  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;

  /** Mission animation timeline state. The 60-second Run Mission
   *  animation broadcasts here so multiple components (stopwatch,
   *  globe markers, timeline rail) can subscribe to the same clock. */
  missionPhase: MissionPhase;
  missionElapsedMs: number;
  setMissionPhase: (p: MissionPhase) => void;
  tickMission: (deltaMs: number) => void;
  resetMission: () => void;

  /** /decision CTA copy. Theatrical default ("Approve & Begin
   *  Mobilization"); the rehearsal hamburger swaps to neutral
   *  ("Begin Conversation"). Persisted (PRD §13.4). */
  ctaMode: CtaMode;
  setCtaMode: (m: CtaMode) => void;

  /** /constellation tap-to-inspect selection. Null when nothing is
   *  selected. Setting one clears the other so the satellite tooltip
   *  and the AOI side panel can never both be open. */
  selectedSatId: string | null;
  selectedAOIId: string | null;
  setSelectedSat: (id: string | null) => void;
  setSelectedAOI: (id: string | null) => void;

  /** Debug flags surfaced via the rehearsal hamburger. */
  debug: {
    showFps: boolean;
  };
  setDebug: (patch: Partial<DemoState["debug"]>) => void;
}

const AUDIO_KEY = "eoc.audioEnabled.v1";
const CTA_KEY = "eoc.ctaMode.v1";

function readCtaMode(): CtaMode {
  if (typeof window === "undefined") return "theatrical";
  const v = localStorage.getItem(CTA_KEY);
  return v === "neutral" ? "neutral" : "theatrical";
}

export const useDemoStore = create<DemoState>((set) => ({
  screenIndex: 0,
  setScreenIndex: (i) => set({ screenIndex: i }),

  audioEnabled:
    typeof window !== "undefined" && localStorage.getItem(AUDIO_KEY) === "1",
  setAudioEnabled: (v) => {
    try {
      localStorage.setItem(AUDIO_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
    set({ audioEnabled: v });
  },

  missionPhase: "idle",
  missionElapsedMs: 0,
  setMissionPhase: (p) => set({ missionPhase: p }),
  tickMission: (deltaMs) =>
    set((s) => ({ missionElapsedMs: s.missionElapsedMs + deltaMs })),
  resetMission: () => set({ missionPhase: "idle", missionElapsedMs: 0 }),

  ctaMode: readCtaMode(),
  setCtaMode: (m) => {
    try {
      localStorage.setItem(CTA_KEY, m);
    } catch {
      /* ignore */
    }
    set({ ctaMode: m });
  },

  selectedSatId: null,
  selectedAOIId: null,
  setSelectedSat: (id) =>
    set({ selectedSatId: id, selectedAOIId: id ? null : undefined }),
  setSelectedAOI: (id) =>
    set({ selectedAOIId: id, selectedSatId: id ? null : undefined }),

  debug: { showFps: false },
  setDebug: (patch) => set((s) => ({ debug: { ...s.debug, ...patch } })),
}));
