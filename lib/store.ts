import { create } from "zustand";

export type MissionPhase =
  | "idle"
  | "tasking"
  | "uplink"
  | "imaging"
  | "downlink"
  | "delivered";

interface DemoState {
  /** Index into the 6-screen flow (0 = intro, 5 = decision). The
   *  persistent dock at the bottom of every page reads this to highlight
   *  the active step and to fan out next/prev affordances. */
  screenIndex: number;
  setScreenIndex: (i: number) => void;

  /** Audio gate. Tone.js requires a user gesture before AudioContext
   *  can start; once enabled it stays on. Persisted to localStorage so
   *  a refresh keeps the user's choice. */
  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;

  /** Mission animation timeline state. The 50-second Run Mission
   *  animation broadcasts here so multiple components (stopwatch,
   *  globe markers, timeline rail) can subscribe to the same clock. */
  missionPhase: MissionPhase;
  missionElapsedMs: number;
  setMissionPhase: (p: MissionPhase) => void;
  tickMission: (deltaMs: number) => void;
  resetMission: () => void;

  /** Debug flags. Toggleable via a hidden gesture (e.g. four-finger tap)
   *  for the operator's own QA, never shown to the customer. */
  debug: {
    showFps: boolean;
    showRouteOutlines: boolean;
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
  setMissionPhase: (p) => set({ missionPhase: p }),
  tickMission: (deltaMs) =>
    set((s) => ({ missionElapsedMs: s.missionElapsedMs + deltaMs })),
  resetMission: () => set({ missionPhase: "idle", missionElapsedMs: 0 }),

  debug: { showFps: false, showRouteOutlines: false },
  setDebug: (patch) => set((s) => ({ debug: { ...s.debug, ...patch } })),
}));
