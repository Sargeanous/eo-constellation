"use client";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { palette } from "@/lib/data";
import { AOI_VECTORS } from "@/lib/orbit";
import { useDemoStore } from "@/lib/store";

// Pulsing markers at the 4 AOIs. Phase 3: clickable + hover state.
// Selected AOI bumps a gold halo so the user has a clear "this is the
// one in the side panel" cue.

export function AOIMarkers() {
  const dotRadius = 0.018;
  const hitRadius = dotRadius * 4;
  const goldColor = useMemo(() => new THREE.Color(palette.accentGold), []);
  const selected = useDemoStore((s) => s.selectedAOIId);
  const setSelected = useDemoStore((s) => s.setSelectedAOI);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group>
      {AOI_VECTORS.map((a) => {
        const isSelected = selected === a.id;
        const isHovered = hovered === a.id;
        const haloOpacity = isSelected ? 0.9 : isHovered ? 0.5 : 0.25;
        const haloScale = isSelected ? 1.6 : isHovered ? 1.25 : 1;
        const liftedPos = a.vec.clone().multiplyScalar(1.003);

        return (
          <group
            key={a.id}
            position={liftedPos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(a.id);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered((h) => (h === a.id ? null : h));
              document.body.style.cursor = "default";
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(isSelected ? null : a.id);
            }}
          >
            {/* Halo */}
            <mesh scale={haloScale}>
              <sphereGeometry args={[dotRadius * 1.6, 12, 12]} />
              <meshBasicMaterial
                color={goldColor}
                transparent
                opacity={haloOpacity}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
            {/* Visible dot */}
            <mesh>
              <sphereGeometry args={[dotRadius, 12, 12]} />
              <meshBasicMaterial color={goldColor} toneMapped={false} />
            </mesh>
            {/* Invisible hit target */}
            <mesh visible={false}>
              <sphereGeometry args={[hitRadius, 6, 6]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
