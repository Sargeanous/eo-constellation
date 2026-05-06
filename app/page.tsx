"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe } from "@/components/globe/Globe";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/store";
import { enableAudio } from "@/lib/audio";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";
import { CONSTELLATION } from "@/lib/data";

export default function IntroPage() {
  const setAudioEnabled = useDemoStore((s) => s.setAudioEnabled);
  const audioEnabled = useDemoStore((s) => s.audioEnabled);

  // PRD §13.2: audio defaults OFF and only arms after the audio toggle.
  // The cover-screen Begin tap counts as the user gesture Tone needs to
  // start its AudioContext IF audio is enabled, but it never enables it
  // for the user.
  async function onBegin() {
    if (audioEnabled) {
      try {
        await enableAudio();
      } catch {
        /* swallow: audio is non-essential */
      }
    }
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Cover frames platform identity, not partner footage. Per
          confirmed §4 override: partner video is supporting evidence,
          never a platform feature, so it does not belong behind the
          cover. The 3D globe carries the cover. AutoRotate is OFF
          on the cover so MENA stays framed - operator-reported the
          rotating Earth was scrolling MENA out of view and ending
          on Atlantic / Greenland-area framings. */}
      <Globe autoRotate={false} interactive={false} bloom={false} />

      {/* Vignette so the typography reads against the Earth. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deepspace/30 via-transparent to-deepspace" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-deepspace/40 via-transparent to-deepspace/40" />

      <motion.section
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center"
      >
        <motion.p
          variants={CHILD_RISE}
          className="mb-6 text-xs uppercase tracking-[0.5em] text-gold"
        >
          Sub-1-Hour MENA Revisit
        </motion.p>
        <motion.h1
          variants={CHILD_RISE}
          className="font-display text-5xl font-semibold tracking-tight md:text-7xl"
        >
          {CONSTELLATION.name}
        </motion.h1>

        <motion.div variants={CHILD_RISE} className="mt-12">
          <Button
            asChild
            size="lg"
            className="pulse-gold bg-gold text-primary-foreground hover:bg-gold/90 px-10 h-14 text-base"
          >
            <Link href="/problem" onClick={onBegin}>
              Begin
            </Link>
          </Button>
        </motion.div>

        <motion.p
          variants={CHILD_RISE}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70"
        >
          {CONSTELLATION.totalSatellites} satellites &nbsp;·&nbsp;{" "}
          {CONSTELLATION.altitudeKm} km &nbsp;·&nbsp;{" "}
          {CONSTELLATION.inclinationDeg}°
        </motion.p>
      </motion.section>
    </main>
  );
}
