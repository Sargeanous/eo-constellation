"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { INVESTMENT } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

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
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            {/* <DOMAIN_PLACEHOLDER>: investment headline */}
            &lt;DOMAIN_PLACEHOLDER&gt;
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {/* <DOMAIN_PLACEHOLDER>: investment narrative */}
            &lt;DOMAIN_PLACEHOLDER&gt;
          </p>
        </motion.header>

        <motion.div variants={CHILD_RISE}>
          <Card>
            <CardHeader>
              <CardTitle>&lt;DOMAIN_PLACEHOLDER&gt;</CardTitle>
            </CardHeader>
            <CardContent>
              {INVESTMENT.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {/* <DOMAIN_PLACEHOLDER>: investment line items go in lib/data.ts */}
                  &lt;DOMAIN_PLACEHOLDER&gt;
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {INVESTMENT.map((line) => (
                    <li
                      key={line.id}
                      className="flex items-baseline justify-between py-3"
                    >
                      <span>{line.label}</span>
                      <span className="font-mono">
                        {line.amountAed.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
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
