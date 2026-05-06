"use client";
import { useEffect, useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Wrapper around <img> with two robustness features:
//
//   1. Extension fallback - if /photos/foo.jpg is missing we test
//      /photos/foo.jpeg, .png, .webp, .avif in turn before declaring
//      the asset missing. Saves a code change every time the partner
//      ships imagery in a different format.
//
//   2. Preloader-first - we Image()-probe each candidate before
//      mounting the visible <img>. Until a candidate confirms onload,
//      we render the "Asset pending" placeholder. Compared to chaining
//      <img onError>, this avoids the broken-image alt flicker, and
//      handles dev-server quirks where a 404 returns HTML (which some
//      browsers don't treat as a clean image error).

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  /** Aspect ratio class (e.g. "aspect-video"). */
  aspect?: string;
  fit?: "cover" | "contain";
  /** Short label shown on the placeholder when the asset is missing. */
  placeholderLabel?: string;
}

const EXTENSION_FALLBACKS = ["jpg", "jpeg", "png", "webp", "avif"];

function buildCandidates(src: string): string[] {
  const m = src.match(/^(.*)\.([^./]+)$/);
  if (!m) return [src];
  const [, base, ext] = m;
  const lower = ext!.toLowerCase();
  const ordered = [
    lower,
    ...EXTENSION_FALLBACKS.filter((e) => e !== lower),
  ];
  return ordered.map((e) => `${base}.${e}`);
}

export function Photo({
  src,
  alt,
  className,
  aspect = "aspect-video",
  fit = "cover",
  placeholderLabel,
}: PhotoProps) {
  const candidates = useMemo(() => buildCandidates(src), [src]);
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setResolvedSrc(null);
    setExhausted(false);
    const tryAt = (i: number) => {
      if (cancelled) return;
      if (i >= candidates.length) {
        setExhausted(true);
        return;
      }
      const probe = new Image();
      probe.onload = () => {
        if (!cancelled) setResolvedSrc(candidates[i]!);
      };
      probe.onerror = () => tryAt(i + 1);
      probe.src = candidates[i]!;
    };
    tryAt(0);
    return () => {
      cancelled = true;
    };
  }, [candidates]);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-deep-space",
        aspect,
        className,
      )}
    >
      {resolvedSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt}
          className={cn(
            "absolute inset-0 h-full w-full",
            fit === "cover" ? "object-cover" : "object-contain",
          )}
        />
      )}
      {!resolvedSrc && (
        <div className="absolute inset-0">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 30% 50%, rgba(56,189,248,0.10), transparent 65%), radial-gradient(ellipse at 75% 30%, rgba(212,169,73,0.07), transparent 60%)",
              animation:
                "placeholder-drift 22s ease-in-out infinite alternate",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 backdrop-blur-md">
              <ImageOff className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {exhausted
                  ? (placeholderLabel ?? "Asset pending")
                  : "Loading…"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
