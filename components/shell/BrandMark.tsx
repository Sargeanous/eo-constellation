"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Renders the EDGE logo from /photos/logoedge.{png,jpg,jpeg,webp,svg}.
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

const CANDIDATES = [
  "/photos/logoedge.png",
  "/photos/logoedge.jpg",
  "/photos/logoedge.jpeg",
  "/photos/logoedge.webp",
  "/photos/logoedge.svg",
];

interface BrandMarkProps {
  size: "chip" | "hero";
  className?: string;
  fallbackTitle?: string;
  fallbackEyebrow?: string;
}

export function BrandMark({
  size,
  className,
  fallbackTitle = "EDGE",
  fallbackEyebrow,
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

  if (size === "chip") {
    return (
      <span
        className={cn(
          "font-display text-sm font-semibold tracking-[0.2em] text-foreground",
          className,
        )}
      >
        {fallbackTitle}
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {fallbackEyebrow && (
        <p className="mb-4 text-xs uppercase tracking-[0.5em] text-gold">
          {fallbackEyebrow}
        </p>
      )}
      <p className="font-display text-5xl font-semibold tracking-tight md:text-7xl">
        {fallbackTitle}
      </p>
    </div>
  );
}
