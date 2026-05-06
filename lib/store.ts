import { create } from "zustand";

export type MissionPhase =
  | "idle"
  | "tasking"
  | "uplink"
  | "imaging"
  | "downlink"
  | "analytics"
  | "report"
  | "delivered";

interface DemoState {
  /** Index into the 6-screen flow (0 = intro, 5 = decision). */
  screenIndex: number;
  setScreenIndex: (i: number) => void;

  /** Audio gate. Tone.js requires a user gesture before AudioContext
   *  can start; once enabled it stays on. Persisted to localStorage so
   *  a refresh keeps the user's choice. Default OFF (PRD §13.2). */
  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;

  /** Mission animation timeline state. */
  missionPhase: MissionPhase;
  missionElapsedMs: number;
  /** True when the operator has tapped Stop mid-run. Freezes the RAF
   *  loop and the visible clock at the current elapsed/phase, but does
   *  NOT reset progress. Resume (or Run Again) clears this. */
  missionPaused: boolean;
  setMissionPhase: (p: MissionPhase) => void;
  tickMission: (deltaMs: number) => void;
  pauseMission: () => void;
  resumeMission: () => void;
  resetMission: () => void;

  /** /constellation tap-to-inspect selection. Null when nothing is
   *  selected. Setting one clears the other so the satellite tooltip
   *  and the AOI side panel can never both be open. */
  selectedSatId: string | null;
  selectedAOIId: string | null;
  setSelectedSat: (id: string | null) => void;
  setSelectedAOI: (id: string | null) => void;

  /** Debug flags. */
  debug: {
    showFps: boolean;
  };
  setDebug: (patch: Partial<DemoState["debug"]>) => void;
}

const AUDIO_KEY = "eoc.audioEnabled.v1";

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
  missionPaused: false,
  setMissionPhase: (p) => set({ missionPhase: p }),
  tickMission: (deltaMs) =>
    set((s) => ({ missionElapsedMs: s.missionElapsedMs + deltaMs })),
  pauseMission: () => set({ missionPaused: true }),
  resumeMission: () => set({ missionPaused: false }),
  resetMission: () =>
    set({ missionPhase: "idle", missionElapsedMs: 0, missionPaused: false }),

  selectedSatId: null,
  selectedAOIId: null,
  setSelectedSat: (id) =>
    set({ selectedSatId: id, selectedAOIId: id ? null : undefined }),
  setSelectedAOI: (id) =>
    set({ selectedAOIId: id, selectedSatId: id ? null : undefined }),

  debug: { showFps: false },
  setDebug: (patch) => set((s) => ({ debug: { ...s.debug, ...patch } })),
}));
