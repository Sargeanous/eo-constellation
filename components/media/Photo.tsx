"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Small wrapper around <img> that falls back to a placeholder gradient
// if the file isn't present yet. Lets us reference images by path
// before they've been dropped into public/photos/.

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  /** Aspect ratio class (e.g. "aspect-video"). */
  aspect?: string;
  fit?: "cover" | "contain";
}

export function Photo({
  src,
  alt,
  className,
  aspect = "aspect-video",
  fit = "cover",
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
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 50%, rgba(56,189,248,0.10), transparent 65%), radial-gradient(ellipse at 75% 30%, rgba(212,169,73,0.07), transparent 60%)",
            animation: "placeholder-drift 22s ease-in-out infinite alternate",
          }}
        />
      )}
    </div>
  );
}
