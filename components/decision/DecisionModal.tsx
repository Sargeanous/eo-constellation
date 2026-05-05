"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { useDemoStore } from "@/lib/store";

// Theatrical close (PRD §13.4). The decision CTA opens this modal,
// "Thank you. Origen will be in touch." Dressed-up so it lands as a
// closing beat and not just a modal. The CTA copy reflects ctaMode
// from the store ("theatrical" default, "neutral" via rehearsal).

interface DecisionModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function DecisionModal({ open, onOpenChange }: DecisionModalProps) {
  const ctaMode = useDemoStore((s) => s.ctaMode);

  const headline =
    ctaMode === "theatrical"
      ? "Approval received."
      : "Conversation begun.";
  const body =
    ctaMode === "theatrical"
      ? "Origen will be in touch within 24 hours to begin mobilization."
      : "Origen will be in touch within 24 hours to schedule the next session.";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-deepspace/90 backdrop-blur-md
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className="cinematic-surface fixed left-1/2 top-1/2 z-50 w-[min(92vw,560px)]
                     -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gold/40
                     bg-background p-10 text-center shadow-2xl
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                     data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold bg-gold/10 text-gold">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </div>

          <DialogPrimitive.Title className="mt-6 font-display text-3xl font-semibold">
            {headline}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-3 text-base text-muted-foreground">
            {body}
          </DialogPrimitive.Description>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
            EDGE Sovereign EO Constellation
          </p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            Powered by Origen · A TACTICA Capability
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
