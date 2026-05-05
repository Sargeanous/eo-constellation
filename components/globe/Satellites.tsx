"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { palette } from "@/lib/data";
import { buildConstellation } from "@/lib/orbit";

// 22 satellites as small instanced glowing dots. Phase 1: static
// positions only — Phase 3 will animate by stepping true anomaly.
// Emissive sky-blue lifts them through the Bloom postprocess.

export function Satellites() {
  const sats = useMemo(() => buildConstellation(), []);

  // Slightly bigger than literal — at 1 + 350/6371 ≈ 1.055 scene units,
  // a 0.012-unit dot reads cleanly at the default camera distance.
  const dotRadius = 0.012;

  return (
    <group>
      {sats.map((s) => (
        <mesh key={s.id} position={s.position}>
          <sphereGeometry args={[dotRadius, 12, 12]} />
          <meshBasicMaterial
            color={new THREE.Color(palette.accentSky)}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
