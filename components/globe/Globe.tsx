"use client";
import dynamic from "next/dynamic";
import * as THREE from "three";

// r3f is heavy and DOM-only. Dynamic-load with ssr: false so it never
// renders during the server pass.
const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false },
);

// Lazy-load both the scene and the bloom composer.
const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });
const GlobeBloom = dynamic(
  () => import("./GlobeScene").then((m) => m.GlobeBloom),
  { ssr: false },
);

interface GlobeProps {
  autoRotate?: boolean;
  interactive?: boolean;
  showOrbits?: boolean;
  showSatellites?: boolean;
  showAOIs?: boolean;
  className?: string;
}

export function Globe({
  autoRotate = true,
  interactive = false,
  showOrbits = true,
  showSatellites = true,
  showAOIs = true,
  className,
}: GlobeProps) {
  return (
    <div className={`absolute inset-0 bg-deep-space ${className ?? ""}`}>
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 38 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <color attach="background" args={["#020617"]} />
        <GlobeScene
          autoRotate={autoRotate}
          interactive={interactive}
          showOrbits={showOrbits}
          showSatellites={showSatellites}
          showAOIs={showAOIs}
        />
        <GlobeBloom />
      </Canvas>
    </div>
  );
}
