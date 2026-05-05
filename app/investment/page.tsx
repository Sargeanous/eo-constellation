"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { COST_USD } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";
import { CostWaterfall } from "@/components/investment/CostWaterfall";
import { Timeline27 } from "@/components/investment/Timeline27";

// PRD §7. Cost waterfall + 27-month timeline. Both rendered in plain
// SVG so we get exact control over labels and tappable phases without
// pulling Recharts into either component.

export default function InvestmentPage() {
  return (
    <main className="min-h-screen px-8 py-16 pb-32">
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl space-y-10"
      >
        <motion.header variants={CHILD_RISE}>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            04 / Investment
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            ${(COST_USD.grandTotal / 1_000_000).toFixed(1)}M.{" "}
            <span className="text-muted-foreground">
              27 months to first light.
            </span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {COST_USD.marketComparisonNote}
          </p>
        </motion.header>

        <motion.div variants={CHILD_RISE}>
          <Card>
            <CardHeader>
              <CardTitle>Cost buildup</CardTitle>
            </CardHeader>
            <CardContent>
              <CostWaterfall />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={CHILD_RISE}>
          <Card>
            <CardHeader>
              <CardTitle>27-month implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline27 />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={CHILD_RISE} className="flex justify-end">
          <Button asChild>
            <Link href="/decision">Continue</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
