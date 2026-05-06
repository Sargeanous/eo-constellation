"use client";
import { BrandMark } from "./BrandMark";

// Fixed top-left platform logo chip. Tap-able to scroll back to the
// cover. The actual logo render lives in BrandMark, which handles the
// extension fallback ladder + the wordmark fallback.

export function BrandLogo() {
  function onClick() {
    document
      .getElementById("cover")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="EDGE - jump to top"
      className="cinematic-surface fixed left-4 top-4 z-50 inline-flex h-11 items-center gap-2 rounded-full
                 border border-border bg-background/70 px-3 backdrop-blur-md
                 transition-colors hover:bg-background/90"
    >
      <BrandMark size="chip" />
    </button>
  );
}
