"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SCREENS } from "@/lib/data";

export function Dock() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Demo navigator"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 rounded-full
                 bg-background/80 backdrop-blur px-3 py-2 border border-border
                 cinematic-surface"
    >
      {SCREENS.map((s) => {
        const active = pathname === s.href;
        return (
          <Link
            key={s.id}
            href={s.href}
            aria-current={active ? "page" : undefined}
            aria-label={s.id}
            className={`h-2 rounded-full transition-all ${
              active ? "w-8 bg-primary" : "w-2 bg-muted-foreground/40"
            }`}
          />
        );
      })}
    </nav>
  );
}
