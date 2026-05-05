"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

export default function DecisionPage() {
  return (
    <main className="min-h-screen px-8 py-16 pb-32">
      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center text-center"
      >
        <motion.p
          variants={CHILD_RISE}
          className="text-xs uppercase tracking-[0.4em] text-muted-foreground"
        >
          05 / Decision
        </motion.p>
        <motion.h1
          variants={CHILD_RISE}
          className="mt-4 text-5xl md:text-6xl font-semibold tracking-tight"
        >
          {/* <DOMAIN_PLACEHOLDER>: decision call-to-action */}
          &lt;DOMAIN_PLACEHOLDER&gt;
        </motion.h1>
        <motion.p
          variants={CHILD_RISE}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          {/* <DOMAIN_PLACEHOLDER>: decision supporting copy */}
          &lt;DOMAIN_PLACEHOLDER&gt;
        </motion.p>
        <motion.div variants={CHILD_RISE} className="mt-10 flex gap-3">
          <Button size="lg">&lt;DOMAIN_PLACEHOLDER&gt;</Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Restart</Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
