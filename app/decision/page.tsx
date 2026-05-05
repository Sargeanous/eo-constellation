"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Shuffle, Cpu, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";
import { DIFFERENTIATORS } from "@/lib/data";
import { useDemoStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { DecisionModal } from "@/components/decision/DecisionModal";

const CTA_LABELS: Record<"theatrical" | "neutral", string> = {
  theatrical: "Approve & Begin Mobilization",
  neutral: "Begin Conversation",
};

const ICON_MAP = {
  shield: Shield,
  shuffle: Shuffle,
  cpu: Cpu,
  link: Link2,
} as const;

export default function DecisionPage() {
  const ctaMode = useDemoStore((s) => s.ctaMode);
  const [modalOpen, setModalOpen] = useState(false);

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

        <motion.div variants={CHILD_RISE} className="mt-10 flex gap-3">
          <Button
            size="lg"
            className="bg-gold px-10 text-primary-foreground hover:bg-gold/90"
            onClick={() => setModalOpen(true)}
          >
            {CTA_LABELS[ctaMode]}
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Restart</Link>
          </Button>
        </motion.div>
      </motion.div>

      <DecisionModal open={modalOpen} onOpenChange={setModalOpen} />
    </main>
  );
}
