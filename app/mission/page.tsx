"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MissionTimeline } from "@/components/timeline/MissionTimeline";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

export default function MissionPage() {
  return (
    <main className="min-h-screen px-8 py-16 pb-32">
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl space-y-10"
      >
        <motion.header variants={CHILD_RISE}>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            02 / Mission
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            {/* <DOMAIN_PLACEHOLDER>: mission headline (sub-1-hour cycle) */}
            &lt;DOMAIN_PLACEHOLDER&gt;
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {/* <DOMAIN_PLACEHOLDER>: mission subhead */}
            &lt;DOMAIN_PLACEHOLDER&gt;
          </p>
        </motion.header>

        <motion.div variants={CHILD_RISE}>
          <MissionTimeline />
        </motion.div>

        <motion.div variants={CHILD_RISE} className="flex justify-end">
          <Button asChild>
            <Link href="/constellation">Continue</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
