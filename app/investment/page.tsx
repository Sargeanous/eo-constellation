"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { COST_USD, CONSTELLATION } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

// Phase 1 placeholder. Phase 4 replaces this with the cost waterfall
// (Recharts horizontal stacked bar) and the 27-month Gantt strip.

function formatUsd(n: number): string {
  return `$${(n / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`;
}

export default function InvestmentPage() {
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
            04 / Investment
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            ${(COST_USD.grandTotal / 1_000_000).toFixed(1)}M.{" "}
            <span className="text-muted-foreground">27 months to first light.</span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {COST_USD.marketComparisonNote}
          </p>
        </motion.header>

        <motion.div variants={CHILD_RISE} className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cost breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                <li className="flex items-baseline justify-between py-3">
                  <span>
                    {CONSTELLATION.totalSatellites} × SAR satellites @{" "}
                    {formatUsd(COST_USD.perSatellite)}
                  </span>
                  <span className="tabular font-mono">
                    {formatUsd(COST_USD.satellitesTotal)}
                  </span>
                </li>
                <li className="flex items-baseline justify-between py-3">
                  <span>Operations & Control System</span>
                  <span className="tabular font-mono">
                    {formatUsd(COST_USD.opsAndControl)}
                  </span>
                </li>
                <li className="flex items-baseline justify-between py-3 text-gold">
                  <span className="font-semibold">Grand total</span>
                  <span className="tabular font-mono text-xl">
                    {formatUsd(COST_USD.grandTotal)}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground">Design — 9 months.</span>{" "}
                Constellation simulation, system design, regulatory.
              </p>
              <p>
                <span className="text-foreground">Execution — 17.5 months.</span>{" "}
                Manufacturing, ground segment, launch.
              </p>
              <p>
                <span className="text-foreground">Operations — ongoing.</span>{" "}
                Defense-cloud hosting, maintenance, upgrades.
              </p>
              <p className="pt-2 text-xs">
                Phase 4 will render the full Gantt with tappable phases.
              </p>
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
