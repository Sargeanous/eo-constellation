"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, CheckCircle2 } from "lucide-react";
import { SIMULATION_CONFIGS, POI_REVISITS } from "@/lib/data";

// PRD §5: the 4-config simulation comparison. Centred dialog (not
// full-screen) since it's reference data, not narrative content. The
// winning row glows gold.

interface SimulationComparisonProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function formatPayload(sar: number, optical: number): string {
  if (optical === 0) return `${sar} SAR`;
  return `${sar} SAR + ${optical} Optical`;
}

export function SimulationComparison({
  open,
  onOpenChange,
}: SimulationComparisonProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-deepspace/85 backdrop-blur-md
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className="cinematic-surface fixed left-1/2 top-1/2 z-50 w-[min(92vw,920px)]
                     -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl
                     border border-border bg-background shadow-2xl
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                     data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Why this geometry
              </p>
              <DialogPrimitive.Title className="mt-1 font-display text-xl font-semibold">
                Simulation results: 4 configurations tested
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Comparison of the four orbital configurations evaluated. The
                cost-optimised 22 SAR @ 38° configuration is the winner.
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

          <div className="space-y-6 overflow-y-auto px-6 py-6 max-h-[78vh]">
            {/* 4-config table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <th className="py-2 pr-4">Inclination</th>
                  <th className="py-2 pr-4">Payload</th>
                  <th className="py-2 pr-4">Avg revisit</th>
                  <th className="py-2 pr-4">Max latitude</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {SIMULATION_CONFIGS.map((c) => {
                  const isSelected = c.selected;
                  return (
                    <tr
                      key={c.id}
                      className={
                        isSelected
                          ? "border-b border-gold/50 bg-gold/10"
                          : "border-b border-border"
                      }
                    >
                      <td className="py-3 pr-4 font-mono">
                        {c.inclinationDeg}°
                        {isSelected ? " + 3°" : ""}
                      </td>
                      <td className="py-3 pr-4">
                        {formatPayload(c.sar, c.optical)}
                      </td>
                      <td
                        className={
                          "py-3 pr-4 tabular font-mono " +
                          (isSelected ? "text-gold" : "")
                        }
                      >
                        {c.avgRevisitH.toFixed(2)}h
                      </td>
                      <td className="py-3 pr-4 tabular font-mono">
                        {c.coverageMaxLatDeg}°
                      </td>
                      <td className="py-3">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-gold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Selected
                          </span>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">
                            Tested
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="text-xs italic text-muted-foreground">
              {SIMULATION_CONFIGS.find((c) => c.selected)?.note}
            </p>

            {/* POI revisits */}
            <div className="space-y-3 border-t border-border pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Priority POIs · revisit ranges (passes / day)
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      <th className="py-2 pr-4">POI</th>
                      <th className="py-2 pr-4">C1 · SAR</th>
                      <th className="py-2 pr-4">C1 · Optical</th>
                      <th className="py-2 pr-4">C1 · Total</th>
                      <th className="py-2">C4 · Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {POI_REVISITS.map((p) => (
                      <tr key={p.poi} className="border-b border-border">
                        <td className="py-2 pr-4 font-mono text-xs">{p.poi}</td>
                        <td className="py-2 pr-4 tabular font-mono text-xs">
                          {p.c1.sar}
                        </td>
                        <td className="py-2 pr-4 tabular font-mono text-xs">
                          {p.c1.opt}
                        </td>
                        <td className="py-2 pr-4 tabular font-mono text-xs">
                          {p.c1.total}
                        </td>
                        <td className="py-2 tabular font-mono text-xs text-gold">
                          {p.c4.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Interpolated from 4 simulation runs. Full physics in{" "}
                <span className="font-mono">simulator-v2.tactica.ae</span>.
              </p>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
