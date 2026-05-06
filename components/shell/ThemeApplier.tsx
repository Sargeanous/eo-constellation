"use client";
import { useEffect } from "react";
import { useDemoStore } from "@/lib/store";

// Mounts under <html>'s static class set in app/layout.tsx and toggles
// the "dark" / "light" class on the document element to match the
// store theme. Server renders with "dark" (the default) so first paint
// matches the operator's persisted choice on the client (set after
// hydration). The brief flash on a light-mode load is acceptable: the
// platform is dark by intent and the operator menu is the only place
// to flip themes.

export function ThemeApplier() {
  const theme = useDemoStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme]);

  return null;
}
