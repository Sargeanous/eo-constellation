"use client";
import { useEffect, useState } from "react";
import { SCREENS } from "@/lib/data";

// Persistent bottom dock: one dot per section on the single scrolling
// page. The dock is anchor nav: tapping a dot smooth-scrolls to the
// section's id. The active dot reflects whichever section is currently
// in the viewport (computed via IntersectionObserver). 44pt hit target.

export function Dock() {
  const [activeId, setActiveId] = useState<string>(SCREENS[0]?.id ?? "");

  useEffect(() => {
    const ids = SCREENS.map((s) => s.id);
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top?.target.id) setActiveId(top.target.id);
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  function onClick(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Section navigator"
      className="cinematic-surface fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-3 rounded-full
                 border border-border bg-background/70 px-4 py-3 backdrop-blur-md"
    >
      {SCREENS.map((s) => {
        const active = activeId === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onClick(s.id)}
            aria-current={active ? "true" : undefined}
            aria-label={`Section ${s.index + 1}: ${s.title}`}
            className="grid h-11 min-w-[44px] place-items-center"
          >
            <span
              className={[
                "block rounded-full transition-all duration-300",
                active
                  ? "h-2.5 w-12 bg-gold shadow-[0_0_14px_-2px_hsl(var(--gold-500))]"
                  : "h-2 w-2 bg-muted-foreground/40",
              ].join(" ")}
            />
          </button>
        );
      })}
    </nav>
  );
}
