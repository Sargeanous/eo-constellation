"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCREENS } from "@/lib/data";

// Persistent bottom dock: six dots, one per screen. Active dot is
// gold (PRD §10) and stretches; inactive dots are muted slate.
// Hit-target is 44pt minimum even though the visible dot is small.

export function Dock() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Demo navigator"
      className="cinematic-surface fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-3 rounded-full
                 border border-border bg-background/70 px-4 py-3 backdrop-blur-md"
    >
      {SCREENS.map((s) => {
        const active = pathname === s.href;
        return (
          <Link
            key={s.id}
            href={s.href}
            aria-current={active ? "page" : undefined}
            aria-label={`Screen ${s.index + 1}: ${s.title}`}
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
          </Link>
        );
      })}
    </nav>
  );
}
