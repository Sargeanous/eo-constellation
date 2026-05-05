"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

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
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
            {/* <DOMAIN_PLACEHOLDER>: problem headline */}
            &lt;DOMAIN_PLACEHOLDER&gt;
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {/* <DOMAIN_PLACEHOLDER>: problem narrative */}
            &lt;DOMAIN_PLACEHOLDER&gt;
          </p>
        </motion.header>

        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} variants={CHILD_RISE}>
              <Card>
                <CardHeader>
                  <CardTitle>&lt;DOMAIN_PLACEHOLDER&gt;</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {/* <DOMAIN_PLACEHOLDER>: pain-point card body */}
                  &lt;DOMAIN_PLACEHOLDER&gt;
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={CHILD_RISE} className="flex justify-end">
          <Button asChild>
            <Link href="/mission">Continue</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
