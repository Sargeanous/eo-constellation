"use client";
import { useEffect, useState } from "react";

export function OrientationGate({ children }: { children: React.ReactNode }) {
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (portrait) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground p-8 text-center">
        <div>
          <p className="text-xl mb-2">Rotate to landscape</p>
          <p className="text-sm text-muted-foreground">
            This experience is built for landscape iPad.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
