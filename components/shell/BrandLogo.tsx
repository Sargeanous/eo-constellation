"use client";
import { useState } from "react";

// Fixed top-left platform logo. Tries /photos/logoedge.{png,jpg,webp,svg}
// in order; if none exist we fall through to a small "EDGE" wordmark so
// the brand still shows. Tap-able to scroll back to the cover.

const CANDIDATES = [
  "/photos/logoedge.png",
  "/photos/logoedge.jpg",
  "/photos/logoedge.jpeg",
  "/photos/logoedge.webp",
  "/photos/logoedge.svg",
];

export function BrandLogo() {
  const [index, setIndex] = useState(0);
  const errored = index >= CANDIDATES.length;

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
      {!errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={CANDIDATES[index]}
          src={CANDIDATES[index]}
          alt="EDGE"
          onError={() => setIndex((i) => i + 1)}
          className="h-6 w-auto"
        />
      ) : (
        <span className="font-display text-sm font-semibold tracking-[0.2em] text-foreground">
          EDGE
        </span>
      )}
    </button>
  );
}
