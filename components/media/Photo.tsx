"use client";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Small wrapper around <img>. If the file isn't present yet we render
// an intentional-looking "asset pending" tile instead of a broken-image
// glyph. The placeholder reads as "this is a slot for an asset" rather
// than as a layout bug, so the platform still demos cleanly before the
// partner imagery has been dropped into public/photos/.

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

export function Photo({
  src,
  alt,
  className,
  aspect = "aspect-video",
  fit = "cover",
  placeholderLabel,
}: PhotoProps) {
  const [errored, setErrored] = useState(false);

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
          src={src}
          alt={alt}
          onError={() => setErrored(true)}
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
