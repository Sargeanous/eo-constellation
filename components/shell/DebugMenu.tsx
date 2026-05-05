"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useDemoStore } from "@/lib/store";
import { enableAudio } from "@/lib/audio";
import { SCREENS } from "@/lib/data";

// Rehearsal-only menu. PRD §9 lists: reset stopwatch, skip-to-screen,
// FPS toggle, pre-warm globe textures. We add: audio toggle (§13.2)
// and CTA mode swap (§13.4).

export function DebugMenu() {
  const router = useRouter();
  const [preWarming, setPreWarming] = useState(false);

  const audioEnabled = useDemoStore((s) => s.audioEnabled);
  const setAudioEnabled = useDemoStore((s) => s.setAudioEnabled);
  const showFps = useDemoStore((s) => s.debug.showFps);
  const setDebug = useDemoStore((s) => s.setDebug);
  const ctaMode = useDemoStore((s) => s.ctaMode);
  const setCtaMode = useDemoStore((s) => s.setCtaMode);
  const resetMission = useDemoStore((s) => s.resetMission);

  async function onAudioToggle(v: boolean) {
    if (v) {
      try {
        await enableAudio();
      } catch {
        /* ignore */
      }
    }
    setAudioEnabled(v);
  }

  async function preWarm() {
    setPreWarming(true);
    try {
      const loader = new THREE.TextureLoader();
      await new Promise<void>((resolve, reject) => {
        loader.load("/textures/earth-day.jpg", () => resolve(), undefined, () =>
          reject(new Error("preWarm failed")),
        );
      });
    } catch {
      /* ignore — texture preload is best-effort */
    } finally {
      setPreWarming(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Rehearsal menu"
          className="cinematic-surface fixed right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full
                     border border-border bg-background/60 text-muted-foreground backdrop-blur-md
                     hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[360px] sm:w-[400px]">
        <div className="space-y-6 pt-6">
          <header>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Rehearsal
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold">
              Debug menu
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Operator-only. Hidden from MoD on the day.
            </p>
          </header>

          <Separator />

          <section className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
              Skip to screen
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {SCREENS.map((s) => (
                <Button
                  key={s.id}
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(s.href)}
                  className="justify-start text-xs"
                >
                  <span className="mr-2 font-mono text-muted-foreground">
                    {s.index + 1}
                  </span>
                  {s.id}
                </Button>
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
              Mission animation
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={resetMission}
              className="w-full"
            >
              Reset stopwatch
            </Button>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
              Toggles
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Audio</p>
                <p className="text-xs text-muted-foreground">
                  Chime + ambient. Default OFF.
                </p>
              </div>
              <Switch
                checked={audioEnabled}
                onCheckedChange={onAudioToggle}
                aria-label="Audio"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">FPS overlay</p>
                <p className="text-xs text-muted-foreground">
                  Performance check during rehearsal.
                </p>
              </div>
              <Switch
                checked={showFps}
                onCheckedChange={(v) => setDebug({ showFps: v })}
                aria-label="FPS overlay"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Decision CTA</p>
                <p className="text-xs text-muted-foreground">
                  Theatrical: <em>Approve & Begin Mobilization</em>. Neutral:{" "}
                  <em>Begin Conversation</em>.
                </p>
              </div>
              <Switch
                checked={ctaMode === "theatrical"}
                onCheckedChange={(v) =>
                  setCtaMode(v ? "theatrical" : "neutral")
                }
                aria-label="CTA mode"
              />
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
              Pre-flight
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={preWarm}
              disabled={preWarming}
              className="w-full"
            >
              {preWarming ? "Pre-warming…" : "Pre-warm globe textures"}
            </Button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
