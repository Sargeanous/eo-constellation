"use client";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import {
  FINAL_MISSION_TIME,
  STATUS_QUO_HOURS,
  RESULT_TAGLINE,
} from "@/lib/data";
import { Button } from "@/components/ui/button";

interface FinalBeatProps {
  onRunAgain: () => void;
}

// Final beat: the resolution after the 20s animation. We deliberately
// don't manufacture a precise minute:second number (no real run yet)
// and we don't quote a percent-faster figure (unprofessional). The
// landing is "< 1 hour" and a one-line tagline.

export function FinalBeat({ onRunAgain }: FinalBeatProps) {
  return (
    <motion.div
      key="final-beat"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 flex flex-col items-center gap-6 text-center"
    >
      <p className="font-display text-7xl font-semibold text-gold md:text-8xl">
        {FINAL_MISSION_TIME}
      </p>
      <div className="space-y-2">
        <p className="text-base text-muted-foreground">
          Status quo:{" "}
          <span className="text-foreground">{STATUS_QUO_HOURS}+ hours.</span>
        </p>
        <p className="font-display text-xl text-amber md:text-2xl">
          {RESULT_TAGLINE}
        </p>
      </div>
      <Button
        size="lg"
        onClick={onRunAgain}
        variant="outline"
        className="border-gold/60 text-gold hover:bg-gold/10 hover:text-gold"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Run Again
      </Button>
    </motion.div>
  );
}
