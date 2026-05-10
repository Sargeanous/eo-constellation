"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  Cpu,
  ExternalLink,
  Layers,
  Link2,
  MousePointerClick,
  Radio,
  Shield,
  Shuffle,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CHILD_RISE, STAGGER_CHILDREN } from "@/components/motion/variants";

// Heavy below-the-fold components are dynamically imported with
// ssr:false so their JS doesn't ship in the initial cover-screen
// payload. The flat map pulls a 1.3 MB Earth texture + projection
// math; MissionRunner pulls three.js for the Step-2 globe inset.
// Both render lazy placeholders until they hydrate, which is what
// the operator was feeling as page slowness.
const FlatMap = dynamic(
  () => import("@/components/constellation/FlatMap").then((m) => m.FlatMap),
  { ssr: false, loading: () => <div className="h-full w-full bg-deep-space" /> },
);
const MissionRunner = dynamic(
  () =>
    import("@/components/timeline/MissionRunner").then((m) => m.MissionRunner),
  { ssr: false, loading: () => <div className="min-h-[420px]" /> },
);
import { CostWaterfall } from "@/components/investment/CostWaterfall";
import {
  Timeline27,
  type TimelineMode,
} from "@/components/investment/Timeline27";
import { BrandMark } from "@/components/shell/BrandMark";
import { MethodologyModal } from "@/components/methodology/MethodologyModal";
import { SimulationComparison } from "@/components/constellation/SimulationComparison";
import { AOIPanel } from "@/components/constellation/AOIPanel";
import { MissionVideo } from "@/components/video/MissionVideo";
import { useDemoStore } from "@/lib/store";
import {
  CONSTELLATION,
  DIFFERENTIATORS,
  EOC_TIMELINE,
  FIRST_LIGHT_MONTHS,
  GROUND_STATIONS,
  STATUS_QUO_FRICTIONS,
  STATUS_QUO_HOURS,
  palette,
} from "@/lib/data";

// Single-page restructure: the platform now lives on one scrolling
// page. The bottom Dock is anchor-nav into the section IDs below.
// Sections in order: cover (page top), problem, mission, constellation,
// investment, decision. There is no separate intro screen any more -
// the platform title and "Begin" CTA both live at the very top of this
// page (the cover hero).

const SCALE_H = 80; // hours x-axis on the problem-page comparison
const SVG_W = 760;
const SVG_PAD_X = 24;
const SVG_BAR_H = 36;
const SVG_BAR_GAP = 18;

function hoursToX(h: number): number {
  const span = SVG_W - SVG_PAD_X * 2;
  return SVG_PAD_X + (h / SCALE_H) * span;
}
function hoursToWidth(h: number): number {
  const span = SVG_W - SVG_PAD_X * 2;
  return Math.max(2, (h / SCALE_H) * span);
}

const ICON_MAP = {
  shield: Shield,
  shuffle: Shuffle,
  cpu: Cpu,
  link: Link2,
} as const;

export default function Home() {
  const [methodOpen, setMethodOpen] = useState(false);
  const [simOpen, setSimOpen] = useState(false);
  const [timelineMode, setTimelineMode] = useState<TimelineMode>("scratch");

  return (
    <main className="relative w-full">
      {/* ─────────── Cover ─────────── */}
      <section
        id="cover"
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-8 text-center"
      >
        {/* Subtle radial backdrop, no globe: the live globe lives in
            the constellation section, where it earns its keep. Two of
            them on one page was both visually noisy and a GPU drag. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 30%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(212,169,73,0.08), transparent 65%)",
          }}
        />
        <motion.div
          variants={STAGGER_CHILDREN}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center"
        >
          <motion.div variants={CHILD_RISE} className="mb-10">
            <BrandMark size="hero" fallbackTitle="EDGE" />
          </motion.div>
          <motion.p
            variants={CHILD_RISE}
            className="font-display text-3xl font-semibold tracking-tight md:text-5xl"
          >
            Sovereign EO Constellation
          </motion.p>
        </motion.div>
      </section>

      {/* ─────────── Problem ─────────── */}
      <section
        id="problem"
        className="scroll-mt-6 px-8 py-20 md:py-24"
      >
        <div className="mx-auto max-w-6xl space-y-12">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              01 / Problem
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              {STATUS_QUO_HOURS}+ hours today.{" "}
              <span className="text-gold">A sovereign hour</span> with
              EO-CONSTELLATION.
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              You&apos;ve tried this before. Here&apos;s why it failed, and why
              this time is different.
            </p>
          </header>

          <div className="space-y-3 rounded-xl border border-border bg-card p-6">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Same scale · 0-{SCALE_H}h
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                hours →
              </p>
            </div>
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_BAR_GAP * 3 + SVG_BAR_H * 2 + 40}`}
              className="w-full"
              role="img"
              aria-label="Status quo vs EO-CONSTELLATION timeline at the same scale"
            >
              {[0, 12, 24, 36, 48, 60, 72].map((h) => (
                <g key={h}>
                  <line
                    x1={hoursToX(h)}
                    y1={0}
                    x2={hoursToX(h)}
                    y2={SVG_BAR_GAP * 3 + SVG_BAR_H * 2}
                    stroke={palette.borderSubtle}
                    strokeWidth="0.5"
                  />
                  <text
                    x={hoursToX(h)}
                    y={SVG_BAR_GAP * 3 + SVG_BAR_H * 2 + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="ui-monospace, monospace"
                    fill={palette.textMuted}
                  >
                    {h}
                  </text>
                </g>
              ))}
              <g transform={`translate(0 ${SVG_BAR_GAP})`}>
                <text
                  x={SVG_PAD_X}
                  y={-4}
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                  fill={palette.accentRed}
                  opacity="0.85"
                >
                  STATUS QUO · 72+ HOURS
                </text>
                {STATUS_QUO_FRICTIONS.map((f, i) => {
                  const x = hoursToX(f.hours[0]);
                  const w = hoursToWidth(f.hours[1] - f.hours[0]);
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={0}
                      width={w}
                      height={SVG_BAR_H}
                      fill={palette.accentRed}
                      fillOpacity={0.18 + i * 0.07}
                      stroke={palette.accentRed}
                      strokeOpacity="0.5"
                      strokeWidth="0.6"
                    />
                  );
                })}
                <text
                  x={hoursToX(STATUS_QUO_HOURS) + 6}
                  y={SVG_BAR_H / 2 + 4}
                  fontSize="14"
                  fontFamily="ui-monospace, monospace"
                  fill={palette.accentRed}
                >
                  +
                </text>
              </g>
              <g
                transform={`translate(0 ${SVG_BAR_GAP * 2 + SVG_BAR_H})`}
              >
                <text
                  x={SVG_PAD_X}
                  y={-4}
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                  fill={palette.accentGreen}
                  opacity="0.85"
                >
                  EO-CONSTELLATION · UNDER 1 HOUR
                </text>
                {EOC_TIMELINE.map((seg, i) => {
                  const x = hoursToX(seg.hours[0]);
                  const w = hoursToWidth(seg.hours[1] - seg.hours[0]);
                  return (
                    <rect
                      key={i}
                      x={x}
                      y={0}
                      width={w}
                      height={SVG_BAR_H}
                      fill={palette.accentGreen}
                      fillOpacity={0.4 + i * 0.12}
                      stroke={palette.accentGreen}
                      strokeOpacity="0.6"
                      strokeWidth="0.6"
                    />
                  );
                })}
              </g>
            </svg>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="mr-2 text-sovred">●</span>
                How it works today
              </p>
              <ul className="space-y-2">
                {STATUS_QUO_FRICTIONS.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-md border border-sovred/30 bg-sovred/5 p-3"
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-sovred" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-mono text-xs text-sovred">
                          {f.hours[0]}-{f.hours[1]}h
                        </span>
                        <span className="ml-3">{f.label}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {f.friction}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="mr-2 text-sovgreen">●</span>
                How it works with EO-CONSTELLATION
              </p>
              <ul className="space-y-2">
                {EOC_TIMELINE.map((seg, i) => {
                  const start = Math.round(seg.hours[0] * 60);
                  const end = Math.round(seg.hours[1] * 60);
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-md border border-sovgreen/30 bg-sovgreen/5 p-3"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-sovgreen" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-mono text-xs text-sovgreen">
                            {start}-{end} min
                          </span>
                          <span className="ml-3">{seg.label}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {seg.friction}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Sovereign capture: 3 UAE ground stations */}
          <div className="rounded-xl border border-gold/30 bg-card p-6">
            <div className="flex items-start gap-3">
              <Radio className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Sovereign capture
                </p>
                <p className="mt-1 font-display text-xl font-semibold">
                  Three UAE ground stations. Bytes never leave the country.
                </p>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                  Status-quo flows route imagery through foreign teleports.
                  EO-CONSTELLATION downlinks into one of three sovereign
                  sites: Fujairah, Abu Dhabi, Ras Ghumeis. UAE soil, UAE
                  infrastructure, no shared cloud.
                </p>
              </div>
            </div>
            <ul className="mt-4 grid gap-2 md:grid-cols-3">
              {GROUND_STATIONS.map((g) => (
                <li
                  key={g.id}
                  className="flex items-baseline justify-between rounded-md border border-border bg-background px-3 py-2"
                >
                  <span className="text-foreground">{g.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {g.lat.toFixed(2)}°N · {g.lng.toFixed(2)}°E
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─────────── Mission ─────────── */}
      <section id="mission" className="scroll-mt-6 px-8 py-20 md:py-24">
        <div className="mx-auto max-w-5xl space-y-10">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              02 / Mission
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              The mission, live.
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Five steps: intel cue, sovereign tasking and capture, downlink
              to a UAE ground station, onboard analytics, report. Watch this.
            </p>
          </header>
          <MissionRunner />
        </div>
      </section>

      {/* ─────────── Constellation ─────────── */}
      <section
        id="constellation"
        className="relative scroll-mt-6 px-6 py-20 md:py-24"
      >
        <div className="mx-auto max-w-[1400px] space-y-10">
          <header>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              03 / Constellation
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              22 SAR Satellites · 350 km altitude · 38° inclination
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
              Counter-countermeasure orbit. SAR-only. Sovereign by design.
              The configuration is locked - this is how it is built.
            </p>
          </header>

          {/* Two-column grid kicks in only at xl (1280px+). iPad
              landscape sits at 1024-1180px - putting the map in a
              cramped left column there made aspect-ratio + min-height
              fight, with the map overflowing into the config cards.
              At iPad widths the map gets full bleed and the cards
              stack underneath. */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
            <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border bg-deep-space xl:aspect-[2/1]">
              <FlatMap />
              <div className="pointer-events-none absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-background/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-md">
                <MousePointerClick className="h-3 w-3 text-gold" />
                Tap a satellite or AOI to inspect
              </div>
            </div>

            <aside className="flex min-w-0 flex-col gap-4">
              <Card className="border-gold/30">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">
                    Locked configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 font-mono text-xs">
                  <ConfigRow label="Satellites" value={`${CONSTELLATION.totalSatellites} × SAR`} highlight />
                  <ConfigRow label="Altitude" value={`${CONSTELLATION.altitudeKm} km`} />
                  <ConfigRow label="Inclination" value={`${CONSTELLATION.inclinationDeg}° ± ${CONSTELLATION.inclinationToleranceDeg}°`} />
                  <ConfigRow label="Walker-Delta" value={`${CONSTELLATION.orbitalPlanes}P / ${CONSTELLATION.satellitesPerPlane}S`} />
                  <ConfigRow label="Sun-sync" value={CONSTELLATION.isSunSynchronous ? "Yes" : "No (counter-CM)"} />
                  <ConfigRow label="Frequency" value={CONSTELLATION.frequencyBand} />
                  <ConfigRow label="GSD" value={`${CONSTELLATION.resolutionMeters.spotlight} m / ${CONSTELLATION.resolutionMeters.stripmap} m`} />
                  <ConfigRow label="Avg revisit" value={`${CONSTELLATION.meanRevisitHours.avg} h`} highlight />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">
                    Why this geometry?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Walker-Delta{" "}
                    <span className="font-mono text-foreground">11P / 2S</span>{" "}
                    at 38° + 3° tolerance, 350 km circular. Non-sun-synchronous
                    so overpass times stay unpredictable.
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

              <div className="flex flex-wrap gap-2">
                <button
                  className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/80 px-4 py-2 font-display text-sm text-gold backdrop-blur-md hover:border-gold"
                  onClick={() => setMethodOpen(true)}
                >
                  <Layers className="h-4 w-4" />
                  How was this designed?
                </button>
                <button
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 font-display text-xs text-muted-foreground backdrop-blur-md hover:text-foreground"
                  onClick={() => setSimOpen(true)}
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Why these numbers?
                </button>
              </div>
            </aside>
          </div>

          {/* Media gallery: ground-tracks video pair. The AOI zoom is
              the same run as the ground-tracks render, so they sit
              side-by-side as a family. The orbital cinematic lives
              in the methodology modal already so it doesn't need a
              second slot here. */}
          <div className="grid gap-4 md:grid-cols-2">
            <figure className="overflow-hidden rounded-lg border border-border bg-card">
              <MissionVideo
                videoId="ground_tracks_flat"
                className="aspect-video"
                ariaLabel="22 SAR ground tracks over MENA"
              />
              <figcaption className="px-4 py-3 text-xs text-muted-foreground">
                Ground tracks · 22 SAR over MENA, full daily envelope.
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-lg border border-border bg-card">
              <MissionVideo
                videoId="aoi_iran_zoom"
                className="aspect-video"
                ariaLabel="AOI zoom into Iran from the same ground-tracks run"
              />
              <figcaption className="px-4 py-3 text-xs text-muted-foreground">
                AOI zoom · Iran segment of the same run.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ─────────── Investment ─────────── */}
      <section id="investment" className="scroll-mt-6 px-8 py-20 md:py-24">
        <div className="mx-auto max-w-6xl space-y-10">
          <header>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              04 / Investment
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Sovereign cost.{" "}
              <span className="text-muted-foreground">
                Sign now, fly in {FIRST_LIGHT_MONTHS} months.
              </span>
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              Per-satellite build cost is roughly 90% lower than the foreign
              EO vendor benchmark. The partner has SAR birds on the line
              today: a deposit reserves a slot from the in-flight build, so
              first light lands in six months instead of starting a green-
              field programme.
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Per-satellite cost</CardTitle>
            </CardHeader>
            <CardContent>
              <CostWaterfall />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <CardTitle>Implementation plan</CardTitle>
              <TimelineModeToggle
                mode={timelineMode}
                onChange={setTimelineMode}
              />
            </CardHeader>
            <CardContent>
              <Timeline27 mode={timelineMode} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─────────── Decision ─────────── */}
      <section id="decision" className="scroll-mt-6 px-8 py-20 pb-32 md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            05 / Decision
          </p>
          <h2 className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-6xl">
            Sovereign. AI-native. Built for MENA.
          </h2>

          <div className="mt-10 grid w-full gap-4 md:grid-cols-2">
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
          </div>

          <div className="mt-10">
            <a
              href="https://gsa.origen.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center gap-3 rounded-full border border-gold/50 bg-gold/10 px-8 font-display text-base text-gold transition-colors hover:border-gold hover:bg-gold/15"
            >
              Go to intel platform
              <span className="font-mono text-base font-semibold tracking-[0.18em]">
                BASEER
              </span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Globally-mounted overlays */}
      <MethodologyModal open={methodOpen} onOpenChange={setMethodOpen} />
      <SimulationComparison open={simOpen} onOpenChange={setSimOpen} />
      <AOIPanel />
    </main>
  );
}

function TimelineModeToggle({
  mode,
  onChange,
}: {
  mode: TimelineMode;
  onChange: (m: TimelineMode) => void;
}) {
  const opts: { id: TimelineMode; label: string }[] = [
    { id: "scratch", label: "From scratch" },
    { id: "now", label: "If enabled now" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Implementation plan view"
      className="inline-flex rounded-full border border-border bg-background p-0.5"
    >
      {opts.map((o) => {
        const active = mode === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.id)}
            className={[
              "rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
              active
                ? "bg-gold text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ConfigRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-gold" : "text-foreground"}>
        {value}
      </span>
    </div>
  );
}
