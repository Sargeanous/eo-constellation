"use client";

// Brand pill identifying BASEER (the partner intel platform we built
// previously) as the source / sink for the relevant mission step:
//   - Step 1 (intel)     : BASEER generates the cued alert
//   - Step 3 (analytics) : BASEER ingests the bounding boxes
//   - Step 4 (report)    : BASEER receives the report
// Small, top-right, gold accent.

interface BaseerPillProps {
  /** Short role label rendered after the brand. e.g. "intel" or
   *  "analytics" or "report". Lowercase. */
  role?: string;
  /** Tailwind className for absolute positioning override. Default
   *  is top-right inside the parent container. */
  className?: string;
}

export function BaseerPill({ role, className }: BaseerPillProps) {
  return (
    <div
      className={
        "absolute z-30 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-background/85 px-3 py-1.5 backdrop-blur-md " +
        (className ?? "right-3 top-3")
      }
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-gold"
      />
      <span className="font-mono text-[11px] font-semibold tracking-[0.22em] text-gold">
        BASEER
      </span>
      {role && (
        <>
          <span aria-hidden className="text-muted-foreground/60">
            ·
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {role}
          </span>
        </>
      )}
    </div>
  );
}
