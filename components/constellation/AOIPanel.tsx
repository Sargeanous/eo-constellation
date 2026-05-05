"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MissionVideo } from "@/components/video/MissionVideo";
import { AOI_VIDEO_MAP } from "@/lib/videos";
import { AOIS } from "@/lib/data";
import { nextPassesForAOI } from "@/lib/orbit";
import { useDemoStore } from "@/lib/store";

// Slides in from the right when an AOI marker on the globe is tapped
// (or when the explicit AOI button on /constellation is used). Shows
// daily-pass count, next 3 satellite passes, and the partner-supplied
// zoom clip with attribution.

function fmtLat(lat: number) {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
}
function fmtLng(lng: number) {
  return `${Math.abs(lng).toFixed(2)}°${lng >= 0 ? "E" : "W"}`;
}

export function AOIPanel() {
  const selected = useDemoStore((s) => s.selectedAOIId);
  const setSelected = useDemoStore((s) => s.setSelectedAOI);
  const aoi = AOIS.find((a) => a.id === selected) ?? null;

  return (
    <Sheet
      open={!!aoi}
      onOpenChange={(o) => {
        if (!o) setSelected(null);
      }}
    >
      <SheetContent
        side="right"
        className="flex w-[440px] flex-col gap-0 overflow-y-auto p-0 sm:w-[460px]"
      >
        {aoi && (
          <>
            <header className="border-b border-border px-6 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Area of interest
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold">
                {aoi.name}
              </h2>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {fmtLat(aoi.lat)} · {fmtLng(aoi.lng)}
              </p>
            </header>

            <section className="grid grid-cols-2 gap-px bg-border">
              <div className="bg-card p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Daily passes
                </p>
                <p className="mt-1 tabular font-mono text-3xl font-semibold text-gold">
                  {aoi.dailyPasses}
                </p>
              </div>
              <div className="bg-card p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Avg revisit
                </p>
                <p className="mt-1 tabular font-mono text-3xl font-semibold">
                  1.03h
                </p>
              </div>
            </section>

            <section className="space-y-3 px-6 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Next 3 passes
              </p>
              <ul className="space-y-2">
                {nextPassesForAOI(aoi.id).map((p) => (
                  <li
                    key={p.satId}
                    className="flex items-baseline justify-between rounded-md border border-border bg-card px-3 py-2 text-sm"
                  >
                    <span className="font-mono text-xs text-foreground">
                      {p.satId}
                    </span>
                    <span className="tabular font-mono text-xs text-gold">
                      T + {p.etaMin} min
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3 border-t border-border bg-card/30 px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Pass simulation
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  <span className="mr-1.5 text-gold">●</span>
                  STAR.VISION
                </p>
              </div>
              <div className="overflow-hidden rounded-md border border-border bg-deep-space">
                <div className="relative aspect-video">
                  {AOI_VIDEO_MAP[aoi.id] ? (
                    <MissionVideo
                      videoId={AOI_VIDEO_MAP[aoi.id]!}
                      preload="metadata"
                      className="!absolute inset-0 h-full w-full"
                      attribution="STAR.VISION simulation"
                      attributionPlacement="bottom-right"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      No reference clip
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Partner reference · pre-dates the canonical 22 SAR / 350 km
                / 38° configuration. Daily-pass count above is computed from
                the canonical config, not the clip.
              </p>
            </section>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
