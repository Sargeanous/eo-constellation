"use client";
import { MissionVideo } from "@/components/video/MissionVideo";

// Reference tab — partner orbital cinematic. Per the §4 override
// (2026-05-05), partner footage lives in surfaces clearly framed as
// "supporting evidence", never as a platform feature. The methodology
// modal is the natural home: the Chairman opens it when MoD asks
// "how was this designed?", and this tab says "and here's the
// partner simulation that corroborates the geometry".

export function ReferenceTab() {
  return (
    <div className="grid w-full gap-8 md:grid-cols-[1.4fr_1fr]">
      <figure className="space-y-3">
        <div className="overflow-hidden rounded-lg border border-border">
          {/* aspect-video → 16:9 frame; the video object-covers it. */}
          <div className="relative aspect-video bg-deep-space">
            <MissionVideo
              videoId="cover_orbit_cinematic"
              preload="metadata"
              className="!absolute inset-0 h-full w-full"
              attribution="STAR.VISION simulation"
              attributionPlacement="bottom-right"
            />
          </div>
        </div>
        <figcaption className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="mr-2 text-gold">●</span>
          Partner reference · STAR.VISION simulation · not platform output
        </figcaption>
      </figure>

      <aside className="space-y-4 self-center text-sm text-muted-foreground">
        <p>
          Partner-supplied orbital cinematic. Renders the constellation
          distribution and ground-track pattern over MENA at a higher
          fidelity than the in-platform 3D globe.
        </p>
        <p>
          This clip pre-dates the canonical{" "}
          <span className="text-foreground">22 SAR / 350 km / 38°</span>{" "}
          configuration and is included as supporting evidence of the
          partner&apos;s simulation capability — not as a depiction of our
          final design. The corrected re-render is in flight.
        </p>
        <p className="text-xs italic">
          Authoritative platform output: the live globe on the constellation
          screen. Authoritative geometry: the Orbit tab in this modal.
        </p>
      </aside>
    </div>
  );
}
