// Tone.js wrappers, gated by the audioEnabled store flag.
// Tone requires a user gesture before AudioContext can start: call
// `enableAudio()` from inside a tap handler.

import type * as ToneNS from "tone";

let tone: typeof ToneNS | null = null;
let started = false;

async function getTone() {
  if (!tone) {
    tone = await import("tone");
  }
  return tone;
}

export async function enableAudio() {
  const T = await getTone();
  if (!started) {
    await T.start();
    started = true;
  }
}

export async function tick() {
  if (!started) return;
  const T = await getTone();
  const synth = new T.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.12 },
  }).toDestination();
  synth.volume.value = -16;
  synth.triggerAttackRelease("C4", "16n");
}

export async function chime() {
  if (!started) return;
  const T = await getTone();
  const synth = new T.PolySynth(T.Synth).toDestination();
  synth.volume.value = -12;
  const now = T.now();
  synth.triggerAttackRelease("E5", "8n", now);
  synth.triggerAttackRelease("A5", "8n", now + 0.12);
}
