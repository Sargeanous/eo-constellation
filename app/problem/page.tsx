"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";
import {
  STATUS_QUO_FRICTIONS,
  STATUS_QUO_HOURS,
  FINAL_MISSION_TIME,
} from "@/lib/data";

// Phase 1 placeholder. Phase 4 replaces with the side-by-side
// horizontal-bar timeline rendered through Recharts (PRD §6).

export default function ProblemPage() {
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
            01 / Problem
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {STATUS_QUO_HOURS}+ hours today.{" "}
            <span className="text-gold">{FINAL_MISSION_TIME}</span> with
            EO-CONSTELLATION.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            You&apos;ve tried this before. Here&apos;s why it failed — and why
            this time is different.
          </p>
        </motion.header>

        <div className="grid gap-4 md:grid-cols-2">
          {STATUS_QUO_FRICTIONS.map((f, i) => (
            <motion.div key={i} variants={CHILD_RISE}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    <span className="font-mono text-xs text-sovred">
                      {f.hours[0]}–{f.hours[1]}h
                    </span>
                    <span className="ml-2">{f.label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {f.friction}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={CHILD_RISE}
          className="text-xs text-muted-foreground"
        >
          Phase 4 replaces these cards with the side-by-side comparison bars.
        </motion.p>

        <motion.div variants={CHILD_RISE} className="flex justify-end">
          <Button asChild>
            <Link href="/mission">Continue</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
