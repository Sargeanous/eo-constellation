"use client";
import { motion } from "framer-motion";
import { Shield, Shuffle, Cpu, Link2, ExternalLink } from "lucide-react";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";
import { DIFFERENTIATORS } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

// /decision is the closing beat. No CTA button: a Chairman doesn't tap
// "Approve & Begin Mobilization" in front of MoD; that decision is
// made in conversation. The four differentiator tiles + the closing
// headline carry the page; the BASEER button is the bridge into the
// existing intel platform when the conversation moves there.

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

        <motion.div variants={CHILD_RISE} className="mt-10">
          <a
            href="https://gsa.origen.ae/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-14 items-center gap-3 rounded-full border border-gold/50 bg-gold/10 px-8 font-display text-base text-gold transition-colors hover:border-gold hover:bg-gold/15"
          >
            Go to intel platform
            <span className="font-mono text-base font-semibold tracking-[0.18em]">
              BASEER
            </span>
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}
