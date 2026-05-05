"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Globe as Globe3D, Layers, MapPin, Map as MapIcon } from "lucide-react";
import { Globe } from "@/components/globe/Globe";
import { MissionVideo } from "@/components/video/MissionVideo";
import { ConfigSandbox } from "@/components/sandbox/ConfigSandbox";
import { MethodologyModal } from "@/components/methodology/MethodologyModal";
import { AOIReferenceDialog } from "@/components/constellation/AOIReferenceDialog";
import { Button } from "@/components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

type Surface = "globe" | "flat";

export default function ConstellationPage() {
  const [surface, setSurface] = useState<Surface>("globe");
  const [methodOpen, setMethodOpen] = useState(false);
  const [aoiRefOpen, setAoiRefOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background surface — 3D globe (canonical platform output) or
          flat ground-tracks loop (partner reference). The flat-map
          mode renders an explicit attribution chip and a header bar so
          the video reads as supporting evidence, never as a platform
          feature (§4 override decision, 2026-05-05). */}
      <div className="absolute inset-0 opacity-80">
        {surface === "globe" ? (
          <Globe interactive autoRotate={false} />
        ) : (
          <>
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 border-b border-gold/30 bg-background/85 px-6 py-2 backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                <span className="mr-2 text-gold">●</span>
                Partner reference · STAR.VISION simulation · not platform output
              </p>
            </div>
            <MissionVideo
              videoId="ground_tracks_flat"
              preload="metadata"
              className="!absolute inset-0 h-full w-full"
              attribution="STAR.VISION simulation"
              attributionPlacement="bottom-right"
            />
          </>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />

      <motion.div
        variants={STAGGER_CHILDREN}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid max-w-6xl gap-10 px-8 py-16 pb-32 md:grid-cols-2"
      >
        <motion.header variants={CHILD_RISE} className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            03 / Constellation
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            22 satellites. 350 km. 38 degrees.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Counter-countermeasure orbit. SAR-only. Sovereign by design.
            Phase 3 adds tap-to-inspect satellites + AOIs and the simulation
            comparison panel.
          </p>
        </motion.header>

        <motion.div variants={CHILD_RISE} className="md:col-span-1">
          <ConfigSandbox />
        </motion.div>

        <motion.div
          variants={CHILD_RISE}
          className="md:col-span-1 flex flex-col items-end justify-end gap-3"
        >
          <Button asChild>
            <Link href="/investment">Continue</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Surface toggle — globe vs flat ground tracks. Bottom-right
          so it doesn't collide with the methodology button (Phase
          modal work) which lives bottom-left. */}
      <div className="cinematic-surface fixed bottom-24 right-6 z-40 rounded-full border border-border bg-background/80 p-1 backdrop-blur-md">
        <ToggleGroup
          type="single"
          value={surface}
          onValueChange={(v) => v && setSurface(v as Surface)}
          aria-label="Surface"
        >
          <ToggleGroupItem value="globe" aria-label="3D globe" size="sm">
            <Globe3D className="h-4 w-4" />
            <span className="ml-2 text-xs">Globe</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="flat" aria-label="Flat map" size="sm">
            <MapIcon className="h-4 w-4" />
            <span className="ml-2 text-xs">Flat map</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* "How was this designed?" entry — opens the full-screen
          methodology modal (Q1 confirmed: full-screen modal, Q2: text
          button, Q3: static SVG only). */}
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
          aria-label="Tehran reference pass"
          onClick={() => setAoiRefOpen(true)}
        >
          <MapPin className="h-3.5 w-3.5" />
          Tehran reference pass
        </button>
      </div>

      <MethodologyModal open={methodOpen} onOpenChange={setMethodOpen} />
      <AOIReferenceDialog open={aoiRefOpen} onOpenChange={setAoiRefOpen} />
    </main>
  );
}
