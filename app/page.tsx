"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe } from "@/components/globe/Globe";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/store";
import { enableAudio } from "@/lib/audio";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

export default function IntroPage() {
  const setAudioEnabled = useDemoStore((s) => s.setAudioEnabled);
  const audioEnabled = useDemoStore((s) => s.audioEnabled);

  async function start() {
    if (!audioEnabled) {
      await enableAudio();
      setAudioEnabled(true);
    }
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <Globe />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
      <motion.section
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex h-full flex-col items-center justify-center text-center px-8"
      >
        <motion.p
          variants={CHILD_RISE}
          className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4"
        >
          {/* <DOMAIN_PLACEHOLDER>: eyebrow text */}
          &lt;DOMAIN_PLACEHOLDER&gt;
        </motion.p>
        <motion.h1
          variants={CHILD_RISE}
          className="text-5xl md:text-7xl font-semibold tracking-tight max-w-4xl"
        >
          {/* <DOMAIN_PLACEHOLDER>: hero headline */}
          &lt;DOMAIN_PLACEHOLDER&gt;
        </motion.h1>
        <motion.p
          variants={CHILD_RISE}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          {/* <DOMAIN_PLACEHOLDER>: hero subhead */}
          &lt;DOMAIN_PLACEHOLDER&gt;
        </motion.p>
        <motion.div variants={CHILD_RISE} className="mt-10">
          <Button size="lg" onClick={start} asChild>
            <Link href="/problem">Begin</Link>
          </Button>
        </motion.div>
      </motion.section>
    </main>
  );
}
