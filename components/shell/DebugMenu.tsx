"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Menu } from "lucide-react";
import { toast } from "sonner";
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

// Operator menu. The trigger is a generic hamburger top-right with no
// label that reads as "debug" - if MoD glances over the operator's
// shoulder mid-meeting, nothing in the sheet betrays that this is a
// operator-only surface. The functions inside are all reasonable
// things an operator might do during a live demo (skip to a screen,
// reset the mission timer, toggle audio).

export function DebugMenu() {
  const router = useRouter();
  const [preWarming, setPreWarming] = useState(false);

  const audioEnabled = useDemoStore((s) => s.audioEnabled);
  const setAudioEnabled = useDemoStore((s) => s.setAudioEnabled);
  const showFps = useDemoStore((s) => s.debug.showFps);
  const setDebug = useDemoStore((s) => s.setDebug);
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
      toast.success("Globe textures pre-warmed");
    } catch {
      toast.error("Pre-warm failed (textures will load on first view)");
    } finally {
      setPreWarming(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Menu"
          className="cinematic-surface fixed right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full
                     border border-border bg-background/60 text-muted-foreground backdrop-blur-md
                     hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[360px] sm:w-[400px]">
        <div className="space-y-6 pt-10">
          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
              Navigate
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
              Mission timer
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={resetMission}
              className="w-full"
            >
              Reset
            </Button>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
              Settings
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Audio</p>
                <p className="text-xs text-muted-foreground">
                  Chime on mission complete.
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
                  Performance check.
                </p>
              </div>
              <Switch
                checked={showFps}
                onCheckedChange={(v) => setDebug({ showFps: v })}
                aria-label="FPS overlay"
              />
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
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
