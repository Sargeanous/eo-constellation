"use client";
import { Moon, Sun } from "lucide-react";
import { useDemoStore } from "@/lib/store";

// Sun / moon toggle in the top-right corner, sitting just left of the
// operator menu hamburger. One tap flips between Sovereign Black
// (dark) and Sovereign Light. Theme is persisted via the store.

export function ThemeToggle() {
  const theme = useDemoStore((s) => s.theme);
  const setTheme = useDemoStore((s) => s.setTheme);
  const isLight = theme === "light";

  return (
    <button
      type="button"
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="cinematic-surface fixed right-[68px] top-4 z-50 grid h-11 w-11 place-items-center rounded-full
                 border border-border bg-background/70 text-muted-foreground backdrop-blur-md
                 transition-colors hover:text-foreground"
    >
      {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}
