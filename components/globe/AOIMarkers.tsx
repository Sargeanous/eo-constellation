"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { palette } from "@/lib/data";
import { AOI_VECTORS } from "@/lib/orbit";

// Pulsing markers at the 4 AOIs. Phase 1 renders them as static
// gold dots; Phase 3 adds the pulse animation and the tap-to-inspect
// side panel.

export function AOIMarkers() {
  const dotRadius = 0.018;
  const colour = useMemo(() => new THREE.Color(palette.accentGold), []);

  return (
    <group>
      {AOI_VECTORS.map((a) => (
        <mesh
          key={a.id}
          // Lift the marker slightly above the surface so it doesn't z-fight.
          position={a.vec.clone().multiplyScalar(1.003)}
        >
          <sphereGeometry args={[dotRadius, 12, 12]} />
          <meshBasicMaterial color={colour} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
