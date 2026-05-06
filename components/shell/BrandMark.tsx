"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Renders the EDGE logo from /photos/logoedge.{png,jpg,jpeg,webp,svg}.
// Walks a list of common extensions on 404 before falling back to a
// text wordmark so the brand always shows even before the asset is on
// disk. Two sizes:
//
//   "chip" - small, used inside the persistent top-left BrandLogo button
//   "hero" - large, used as the cover-screen brand mark
//
// On the hero variant, the fallback shows a styled eyebrow + display-
// font wordmark so the cover still looks polished pre-asset.

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
  const [index, setIndex] = useState(0);
  const errored = index >= CANDIDATES.length;

  if (!errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={CANDIDATES[index]}
        src={CANDIDATES[index]}
        alt="EDGE"
        onError={() => setIndex((i) => i + 1)}
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
