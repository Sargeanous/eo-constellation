"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  BarChart3,
  ArrowRight,
  MousePointerClick,
} from "lucide-react";
import { Globe } from "@/components/globe/Globe";
import { ConfigSandbox } from "@/components/sandbox/ConfigSandbox";
import { MethodologyModal } from "@/components/methodology/MethodologyModal";
import { AOIPanel } from "@/components/constellation/AOIPanel";
import { SimulationComparison } from "@/components/constellation/SimulationComparison";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

// /constellation layout:
//   - Left ~ 60%: live 3D globe (interactive, with tap-to-inspect
//     hint). The Flat-map toggle was removed: it surfaced a
//     STAR.VISION partner watermark on a sovereign-capability pitch,
//     which is exactly the framing the audit flagged.
//   - Right ~ 40%: sidebar with inclination sandbox + "Why this
//     geometry?" card + Continue button.
// Bottom-left: methodology / why-these-numbers buttons.

export default function ConstellationPage() {
  const [methodOpen, setMethodOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid h-screen max-w-[1400px] grid-cols-1 gap-6 px-6 pb-28 pt-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]"
      >
        <motion.section
          variants={CHILD_RISE}
          className="relative min-h-[60vh] overflow-hidden rounded-2xl border border-border bg-deep-space"
        >
          <Globe interactive autoRotate={false} />
          {/* Tap-to-inspect hint: top-left so it doesn't compete with
              the bottom-left button stack on smaller iPad widths. */}
          <div className="pointer-events-none absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-background/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-md">
            <MousePointerClick className="h-3 w-3 text-gold" />
            Tap a satellite or AOI to inspect
          </div>
        </motion.section>

        <motion.aside
          variants={CHILD_RISE}
          className="flex min-w-0 flex-col gap-4 overflow-y-auto"
        >
          <header>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              03 / Constellation
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              22 satellites. 350 km. 38°.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Counter-countermeasure orbit. SAR-only. Sovereign by design.
            </p>
          </header>

          <ConfigSandbox />

          <Card className="border-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base">
                Why this geometry?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Walker-Delta{" "}
                <span className="font-mono text-foreground">11P / 2S</span> at
                38° +3° tolerance, 350 km circular. Non-sun-synchronous so
                overpass times stay unpredictable.
              </p>
              <button
                onClick={() => setSimOpen(true)}
                className="group inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gold hover:text-gold/80"
              >
                See the four configurations
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button asChild>
              <Link href="/investment">See the investment</Link>
            </Button>
          </div>
        </motion.aside>
      </motion.div>

      {/* Bottom-left buttons: both phrased as questions MoD might ask. */}
      <div className="cinematic-surface fixed bottom-24 left-6 z-40 flex flex-col items-start gap-2">
        <button
          className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/80 px-4 py-2 font-display text-sm text-gold backdrop-blur-md hover:border-gold"
          aria-label="How was this designed?"
          onClick={() => setMethodOpen(true)}
        >
          <Layers className="h-4 w-4" />
          How was this designed?
        </button>
        <button
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 font-display text-xs text-muted-foreground backdrop-blur-md hover:text-foreground"
          aria-label="Why these numbers?"
          onClick={() => setSimOpen(true)}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Why these numbers?
        </button>
      </div>

      <MethodologyModal open={methodOpen} onOpenChange={setMethodOpen} />
      <SimulationComparison open={simOpen} onOpenChange={setSimOpen} />
      <AOIPanel />
    </main>
  );
}
