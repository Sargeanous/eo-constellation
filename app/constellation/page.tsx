"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe } from "@/components/globe/Globe";
import { ConfigSandbox } from "@/components/sandbox/ConfigSandbox";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

export default function ConstellationPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 opacity-80">
        <Globe interactive autoRotate={false} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid max-w-6xl gap-10 px-8 py-16 pb-32 md:grid-cols-2"
      >
        <motion.header variants={CHILD_RISE} className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            03 / Constellation
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            22 satellites. 350 km. 38 degrees.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Counter-countermeasure orbit. SAR-only. Sovereign by design.
            Tap a satellite or AOI to inspect. Phase 3 lands tap-to-inspect
            and the simulation comparison.
          </p>
        </motion.header>

        <motion.div variants={CHILD_RISE} className="md:col-span-1">
          <ConfigSandbox />
        </motion.div>

        <motion.div
          variants={CHILD_RISE}
          className="md:col-span-1 flex items-end justify-end"
        >
          <Button asChild>
            <Link href="/investment">Continue</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
