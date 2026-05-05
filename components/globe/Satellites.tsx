"use client";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { palette } from "@/lib/data";
import { buildConstellation } from "@/lib/orbit";
import { useDemoStore } from "@/lib/store";

// 22 satellites as small instanced glowing dots. Phase 1: static
// positions. Phase 3: clickable: each dot is wrapped in a larger
// transparent hit-target sphere so a finger tap on iPad doesn't have
// to hit a 0.012-unit dot.
//
// Hover and selected state both lift to small visual cues:
//   hovered  → halo opacity bumps to 0.45
//   selected → halo turns gold + halo radius doubles

export function Satellites() {
  const sats = useMemo(() => buildConstellation(), []);
  const selected = useDemoStore((s) => s.selectedSatId);
  const setSelected = useDemoStore((s) => s.setSelectedSat);
  const [hovered, setHovered] = useState<string | null>(null);

  const dotRadius = 0.012;
  const hitRadius = dotRadius * 4.2; // generous touch target

  return (
    <group>
      {sats.map((s) => {
        const isSelected = selected === s.id;
        const isHovered = hovered === s.id;
        const haloColor = isSelected
          ? new THREE.Color(palette.accentGold)
          : new THREE.Color(palette.accentSky);
        const haloOpacity = isSelected ? 0.85 : isHovered ? 0.45 : 0.18;
        const haloScale = isSelected ? 1.5 : isHovered ? 1.2 : 1;

        return (
          <group
            key={s.id}
            position={s.position}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(s.id);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered((h) => (h === s.id ? null : h));
              document.body.style.cursor = "default";
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(isSelected ? null : s.id);
            }}
          >
            {/* Halo */}
            <mesh scale={haloScale}>
              <sphereGeometry args={[dotRadius, 12, 12]} />
              <meshBasicMaterial
                color={haloColor}
                transparent
                opacity={haloOpacity * 0.4}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
            {/* Visible dot */}
            <mesh>
              <sphereGeometry args={[dotRadius * 0.7, 12, 12]} />
              <meshBasicMaterial
                color={isSelected ? palette.accentGold : palette.accentSky}
                toneMapped={false}
              />
            </mesh>
            {/* Invisible larger hit target for touch */}
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
