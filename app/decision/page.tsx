"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";
import { DIFFERENTIATORS } from "@/lib/data";
import { useDemoStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";

// Phase 1 placeholder. Phase 4 replaces with the theatrical close
// modal + the 4 differentiator tiles laid out cinematically. Honours
// the ctaMode toggle from the rehearsal menu (PRD §13.4).

const CTA_LABELS: Record<"theatrical" | "neutral", string> = {
  theatrical: "Approve & Begin Mobilization",
  neutral: "Begin Conversation",
};

export default function DecisionPage() {
  const ctaMode = useDemoStore((s) => s.ctaMode);
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
          This is yours. Approve and we begin mobilization tomorrow.
        </motion.p>

        <motion.div
          variants={CHILD_RISE}
          className="mt-10 grid w-full gap-4 md:grid-cols-2"
        >
          {DIFFERENTIATORS.map((d) => (
            <Card key={d.id} className="text-left">
              <CardContent className="pt-6">
                <p className="font-display text-lg font-semibold">{d.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={CHILD_RISE} className="mt-10 flex gap-3">
          <Button
            size="lg"
            className="bg-gold text-primary-foreground hover:bg-gold/90 px-10"
          >
            {CTA_LABELS[ctaMode]}
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Restart</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
