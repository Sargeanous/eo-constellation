"use client";
import { useState } from "react";

// Fixed top-left platform logo. Renders /photos/logoedge.png; if the
// asset isn't present we fall through to a small "EDGE" wordmark so
// the brand still shows. The logo is tap-able to scroll to the cover.

export function BrandLogo() {
  const [errored, setErrored] = useState(false);

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
          src="/photos/logoedge.png"
          alt="EDGE"
          onError={() => setErrored(true)}
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
