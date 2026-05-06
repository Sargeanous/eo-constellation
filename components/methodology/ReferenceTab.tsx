"use client";
import { MissionVideo } from "@/components/video/MissionVideo";

// Reference tab - simulation cinematic for the orbital geometry. Lives
// inside the methodology modal so the operator can show it on demand
// when MoD asks "how was this designed?". Partner brand attribution
// has been stripped from the customer-facing surface (audit P0-1):
// what reads on screen is "simulation reference", nothing more.

export function ReferenceTab() {
  return (
    <div className="grid w-full gap-8 md:grid-cols-[1.4fr_1fr]">
      <figure className="space-y-3">
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="relative aspect-video bg-deep-space">
            <MissionVideo
              videoId="cover_orbit_cinematic"
              preload="metadata"
              className="!absolute inset-0 h-full w-full"
            />
          </div>
        </div>
        <figcaption className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="mr-2 text-gold">●</span>
          Simulation reference · supporting evidence
        </figcaption>
      </figure>

      <aside className="space-y-4 self-center text-sm text-muted-foreground">
        <p>
          Orbital cinematic showing the constellation distribution and
          ground-track pattern over MENA at higher fidelity than the live
          in-platform globe.
        </p>
        <p>
          The clip is included as an engineering reference. The
          authoritative platform output is the live globe on the
          constellation screen; the authoritative geometry is the Orbit tab
          in this modal.
        </p>
      </aside>
    </div>
  );
}
