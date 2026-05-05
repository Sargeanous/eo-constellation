"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { MissionVideo } from "@/components/video/MissionVideo";

// AOI reference dialog — currently shows the Tehran zoom. Mounted from
// /constellation alongside the methodology button. When Phase 3's full
// AOI tap-to-inspect side panel ships, this dialog can either retire
// or stay as a "deeper reference" affordance.

interface AOIReferenceDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function AOIReferenceDialog({
  open,
  onOpenChange,
}: AOIReferenceDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-deepspace/85 backdrop-blur-md
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className="cinematic-surface fixed left-1/2 top-1/2 z-50 w-[min(92vw,1100px)]
                     -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl
                     border border-border bg-background shadow-2xl
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                     data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
                AOI reference
              </p>
              <DialogPrimitive.Title className="mt-1 font-display text-xl font-semibold">
                Tehran — pass simulation
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Partner-supplied simulation showing a constellation pass over
                Tehran with target points and slew footprints.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full border border-border
                         text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </header>

          <div className="border-b border-gold/30 bg-card/40 px-6 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="mr-2 text-gold">●</span>
              Partner reference · STAR.VISION simulation · not platform output
            </p>
          </div>

          <div className="relative aspect-video bg-deep-space">
            <MissionVideo
              videoId="aoi_iran_zoom"
              preload="metadata"
              className="!absolute inset-0 h-full w-full"
              attribution="STAR.VISION simulation"
              attributionPlacement="bottom-right"
            />
          </div>

          <footer className="px-6 py-4 text-xs text-muted-foreground">
            Daily passes over Tehran are computed from the canonical 22 SAR /
            350 km / 38° configuration. The clip above pre-dates that
            configuration and is included as evidence of the partner&apos;s
            simulation capability.
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
