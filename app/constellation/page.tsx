"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe as Globe3D,
  Layers,
  Map as MapIcon,
  BarChart3,
  ArrowRight,
  MousePointerClick,
} from "lucide-react";
import { Globe } from "@/components/globe/Globe";
import { MissionVideo } from "@/components/video/MissionVideo";
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

type Surface = "globe" | "flat";

// /constellation layout:
//   - Left ~ 60%: hero surface. In Globe mode, the live 3D globe
//     fills the area, tappable, with a small "tap a satellite or AOI"
//     hint to teach the affordance. In Flat-map mode, the partner
//     STAR.VISION video takes the same area at full opacity with a
//     prominent attribution header (the §4 framing) so the reference
//     is the focal point, not a tucked-away background.
//   - Right ~ 40%: sidebar with the inclination sandbox + the "Why
//     this geometry?" card + the Continue button.
// Bottom-left: methodology / why-these-numbers buttons.
// Bottom-right: surface toggle (Globe / Flat map).

export default function ConstellationPage() {
  const [surface, setSurface] = useState<Surface>("globe");
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
        {/* HERO PANEL: globe in globe mode, flat-map video in flat mode */}
        <motion.section
          variants={CHILD_RISE}
          className="relative min-h-[60vh] overflow-hidden rounded-2xl border border-border bg-deep-space"
        >
          {surface === "globe" ? (
            <>
              <Globe interactive autoRotate={false} />
              {/* Tap-to-inspect hint: small floating chip, bottom-left of
                  the globe panel. Teaches the gesture without being
                  patronising. */}
              <div className="pointer-events-none absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-background/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-md">
                <MousePointerClick className="h-3 w-3 text-gold" />
                Tap a satellite or AOI to inspect
              </div>
            </>
          ) : (
            <>
              {/* Attribution header: clear, prominent, reads as
                  supporting evidence. */}
              <div className="absolute left-0 right-0 top-0 z-20 border-b border-gold/30 bg-background/85 px-5 py-2.5 backdrop-blur-md">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                  <span className="mr-2 text-gold">●</span>
                  Partner reference · STAR.VISION simulation · not platform
                  output
                </p>
              </div>
              <MissionVideo
                videoId="ground_tracks_flat"
                preload="metadata"
                className="!absolute inset-0 h-full w-full"
                attribution="STAR.VISION simulation"
                attributionPlacement="bottom-right"
              />
              <p className="absolute bottom-4 left-4 z-20 max-w-[60%] text-xs leading-snug text-muted-foreground">
                22 SAR / 350 km / 38° canonical config. The clip pre-dates
                this configuration and is included as evidence of the
                partner&apos;s simulation capability.
              </p>
            </>
          )}
        </motion.section>

        {/* SIDEBAR */}
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
                38° + 3° tolerance, 350 km circular. Non-sun-synchronous so
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

      {/* Surface toggle: globe vs flat ground tracks. */}
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
