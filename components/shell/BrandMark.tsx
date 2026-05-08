"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Renders the EDGE brand mark from /photos/favicon.{png,jpg,jpeg,webp,svg}.
// Uses an Image() preloader to test each candidate in order; only swaps
// from the wordmark fallback to the <img> once a candidate has fired
// onload. This is more robust than chained <img onError> retries: it
// avoids flashing the broken-image alt while we walk extensions, and
// it correctly handles dev-server cases where a 404 returns HTML
// (which some browsers don't always treat as a clean error).
//
// Two sizes:
//   "chip" - small, used inside the persistent top-left BrandLogo button
//   "hero" - large, used as the cover-screen brand mark

// Walks favicon.{png,jpg,jpeg,webp,svg} first, then falls back to the
// older logoedge.* basename. Either filename works without a code
// change, which means the operator can drop the asset under the name
// they have to hand and not have to chase a rename round-trip.
const CANDIDATES = [
  "/photos/favicon.png",
  "/photos/favicon.jpg",
  "/photos/favicon.jpeg",
  "/photos/favicon.webp",
  "/photos/favicon.svg",
  "/photos/logoedge.png",
  "/photos/logoedge.jpg",
  "/photos/logoedge.jpeg",
  "/photos/logoedge.webp",
  "/photos/logoedge.svg",
];

interface BrandMarkProps {
  size: "chip" | "hero";
  className?: string;
  /** Wordmark used as the fallback when the logo image isn't on disk
   *  yet. Kept short by intent so it doesn't compete with the page's
   *  own headline copy on the cover. */
  fallbackTitle?: string;
}

export function BrandMark({
  size,
  className,
  fallbackTitle = "EDGE",
}: BrandMarkProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tryAt = (i: number) => {
      if (cancelled || i >= CANDIDATES.length) return;
      const probe = new Image();
      probe.onload = () => {
        if (!cancelled) setResolvedSrc(CANDIDATES[i]!);
      };
      probe.onerror = () => tryAt(i + 1);
      probe.src = CANDIDATES[i]!;
    };
    tryAt(0);
    return () => {
      cancelled = true;
    };
  }, []);

  if (resolvedSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt="EDGE"
        className={cn(
          size === "chip" ? "h-6 w-auto" : "h-20 w-auto md:h-28",
          className,
        )}
      />
    );
  }

  // Fallback wordmark - small for chip, slightly larger for hero, but
  // never trying to be the page headline. The cover screen renders
  // its own "Sovereign EO Constellation" h2 below this slot, so a
  // big eyebrow + h1 fallback here ended up reading as three redundant
  // titles stacked on top of each other.
  return (
    <span
      className={cn(
        "font-display font-semibold text-foreground",
        size === "chip"
          ? "text-sm tracking-[0.2em]"
          : "text-3xl tracking-[0.4em]",
        className,
      )}
    >
      {fallbackTitle}
    </span>
  );
}
