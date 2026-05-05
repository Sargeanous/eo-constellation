"use client";
import dynamic from "next/dynamic";

// r3f is heavy and DOM-only. Dynamic-load with ssr: false so it never
// renders during the server pass.
const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false },
);

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });

export function Globe() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}
