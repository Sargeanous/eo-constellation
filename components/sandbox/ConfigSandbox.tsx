"use client";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConfigSandbox() {
  const [satellites, setSatellites] = useState(6);
  const [revisitTarget, setRevisitTarget] = useState(60);
  const [sovereignDownlink, setSovereignDownlink] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration sandbox</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <label htmlFor="sats">Satellites</label>
            <span className="font-mono text-muted-foreground">
              {satellites}
            </span>
          </div>
          <Slider
            id="sats"
            min={3}
            max={24}
            step={1}
            value={[satellites]}
            onValueChange={([v]) => setSatellites(v ?? satellites)}
          />
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <label htmlFor="revisit">Revisit target (min)</label>
            <span className="font-mono text-muted-foreground">
              {revisitTarget}
            </span>
          </div>
          <Slider
            id="revisit"
            min={15}
            max={240}
            step={5}
            value={[revisitTarget]}
            onValueChange={([v]) => setRevisitTarget(v ?? revisitTarget)}
          />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="sov" className="text-sm">
            Sovereign downlink only
          </label>
          <Switch
            id="sov"
            checked={sovereignDownlink}
            onCheckedChange={setSovereignDownlink}
          />
        </div>
      </CardContent>
    </Card>
  );
}
