"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { OrbitTab } from "./OrbitTab";
import { SlewTab } from "./SlewTab";
import { ClusteringTab } from "./ClusteringTab";
import { cn } from "@/lib/utils";

// Full-screen modal (Q1 confirmed). Sovereign Black surface, three
// underlined gold tabs along the top, X close top-right.
//
// We use Radix dialog primitives directly rather than the constrained
// shadcn <DialogContent> wrapper because that wrapper caps the modal
// at sm:max-w-lg, which is incompatible with "full-screen".

type TabId = "orbit" | "slew" | "clustering";

const TABS: { id: TabId; label: string; render: () => React.ReactNode }[] = [
  { id: "orbit", label: "Orbit", render: () => <OrbitTab /> },
  { id: "slew", label: "Slew", render: () => <SlewTab /> },
  {
    id: "clustering",
    label: "Target Clustering",
    render: () => <ClusteringTab />,
  },
];

interface MethodologyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional initial tab; defaults to "orbit". */
  defaultTab?: TabId;
}

export function MethodologyModal({
  open,
  onOpenChange,
  defaultTab = "orbit",
}: MethodologyModalProps) {
  const [tab, setTab] = React.useState<TabId>(defaultTab);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-deepspace/90 backdrop-blur-md
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className="cinematic-surface fixed inset-0 z-50 flex flex-col bg-background text-foreground
                     data-[state=open]:animate-in data-[state=closed]:animate-out
                     data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                     data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <header className="relative flex items-center justify-between border-b border-border px-8 py-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
                Methodology
              </p>
              <DialogPrimitive.Title className="mt-1 font-display text-2xl font-semibold">
                How was this designed?
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                The orbital geometry, slew capability, and target-clustering
                approach behind the 22 SAR sub-1-hour MENA constellation.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              aria-label="Close methodology"
              className="grid h-11 w-11 place-items-center rounded-full border border-border
                         text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </header>

          {/* Tab strip — underlined gold for active. */}
          <nav
            aria-label="Methodology tabs"
            className="flex gap-2 border-b border-border bg-card/40 px-8"
          >
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative px-4 py-4 font-display text-sm tracking-wide transition-colors",
                    active
                      ? "text-gold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-selected={active}
                  role="tab"
                >
                  {t.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all",
                      active ? "bg-gold opacity-100" : "bg-gold opacity-0",
                    )}
                  />
                </button>
              );
            })}
          </nav>

          {/* Content — scrolls if it overflows on smaller iPad screens. */}
          <section className="flex-1 overflow-y-auto px-8 py-10">
            <div className="mx-auto max-w-6xl">
              {TABS.find((t) => t.id === tab)?.render()}
            </div>
          </section>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
