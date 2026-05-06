"use client";
import { motion } from "framer-motion";
import { Shield, Shuffle, Cpu, Link2 } from "lucide-react";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";
import { DIFFERENTIATORS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

// /decision is the closing beat. No CTA button: a Chairman doesn't tap
// "Approve & Begin Mobilization" in front of MoD; that decision is made
// in conversation, not via a tap target. The four differentiator tiles
// + the headline are the closing argument; the dock + rehearsal menu
// remain available for navigation.

const ICON_MAP = {
  shield: Shield,
  shuffle: Shuffle,
  cpu: Cpu,
  link: Link2,
} as const;

export default function DecisionPage() {
  return (
    <main className="min-h-screen px-8 py-16 pb-32">
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center text-center"
      >
        <motion.p
          variants={CHILD_RISE}
          className="text-xs uppercase tracking-[0.4em] text-muted-foreground"
        >
          05 / Decision
        </motion.p>
        <motion.h1
          variants={CHILD_RISE}
          className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-6xl"
        >
          Sovereign. AI-native. Built for MENA.
        </motion.h1>
        <motion.p
          variants={CHILD_RISE}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          The decision is yours.
        </motion.p>

        <motion.div
          variants={CHILD_RISE}
          className="mt-10 grid w-full gap-4 md:grid-cols-2"
        >
          {DIFFERENTIATORS.map((d) => {
            const Icon = ICON_MAP[d.icon];
            return (
              <Card key={d.id} className="text-left">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold">
                      {d.title}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {d.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      </motion.div>
    </main>
  );
}
