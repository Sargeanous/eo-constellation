"use client";
import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Small wrapper around <img>. If the file isn't present yet we render
// an intentional-looking "asset pending" tile instead of a broken-image
// glyph.
//
// On 404, we walk a list of common image extensions before declaring
// the asset missing. So a caller passing "/photos/iran_zoom.jpg" still
// resolves if the actual file dropped into public/photos/ happens to
// be iran_zoom.png or iran_zoom.webp - useful because the partner ships
// imagery in mixed formats and we don't want every drop to require a
// code change.

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
  const [index, setIndex] = useState(0);
  const errored = index >= candidates.length;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-deep-space",
        aspect,
        className,
      )}
    >
      {!errored && (
        <img
          key={candidates[index]}
          src={candidates[index]}
          alt={alt}
          onError={() => setIndex((i) => i + 1)}
          className={cn(
            "absolute inset-0 h-full w-full",
            fit === "cover" ? "object-cover" : "object-contain",
          )}
        />
      )}
      {errored && (
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
                {placeholderLabel ?? "Asset pending"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
