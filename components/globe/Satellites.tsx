"use client";
import { memo, useMemo, useState } from "react";
import * as THREE from "three";
import { palette } from "@/lib/data";
import { buildConstellation, type SatellitePosition } from "@/lib/orbit";
import { useDemoStore } from "@/lib/store";

// 22 satellites as small glowing dots. Phase 1: static positions.
// Phase 3: clickable, with hover + selection state lifted via the
// Zustand store.
//
// Performance note (perf round 2): the 22 base meshes used to
// re-render whenever hover state changed (every pointer move). Now
// the base group is React.memo'd and the hover/selected halo is a
// separate overlay that consumes selection state alone, so dragging
// across satellites no longer rebuilds 22 mesh trees per frame.

export function Satellites() {
  const sats = useMemo(() => buildConstellation(), []);
  const setSelected = useDemoStore((s) => s.setSelectedSat);
  const [hovered, setHovered] = useState<string | null>(null);
  const selected = useDemoStore((s) => s.selectedSatId);

  return (
    <group>
      <SatelliteBase
        sats={sats}
        onHover={setHovered}
        onSelect={setSelected}
      />
      <SatelliteHalos
        sats={sats}
        hovered={hovered}
        selected={selected}
      />
    </group>
  );
}

const DOT_RADIUS = 0.012;
const HIT_RADIUS = DOT_RADIUS * 4.2;
const SKY = palette.accentSky;
const GOLD = palette.accentGold;

interface SatelliteBaseProps {
  sats: SatellitePosition[];
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}

/** 22 base meshes (visible dot + invisible hit-target). Pure: no
 *  hover/selection state, so this renders exactly once for the whole
 *  session. */
const SatelliteBase = memo(function SatelliteBase({
  sats,
  onHover,
  onSelect,
}: SatelliteBaseProps) {
  return (
    <group>
      {sats.map((s) => (
        <group
          key={s.id}
          position={s.position}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(s.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHover(null);
            document.body.style.cursor = "default";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(s.id);
          }}
        >
          {/* Visible dot */}
          <mesh>
            <sphereGeometry args={[DOT_RADIUS * 0.7, 12, 12]} />
            <meshBasicMaterial color={SKY} toneMapped={false} />
          </mesh>
          {/* Invisible larger hit target for touch */}
          <mesh visible={false}>
            <sphereGeometry args={[HIT_RADIUS, 6, 6]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
      ))}
    </group>
  );
});

interface SatelliteHalosProps {
  sats: SatellitePosition[];
  hovered: string | null;
  selected: string | null;
}

/** Up to 2 halo meshes (one for the hovered sat, one for the
 *  selected sat). Always two render passes regardless of how many
 *  satellites exist. */
function SatelliteHalos({ sats, hovered, selected }: SatelliteHalosProps) {
  const hoveredSat = hovered ? sats.find((s) => s.id === hovered) : null;
  const selectedSat = selected ? sats.find((s) => s.id === selected) : null;

  return (
    <group>
      {selectedSat && (
        <Halo position={selectedSat.position} color={GOLD} scale={1.5} opacity={0.34} />
      )}
      {hoveredSat && hoveredSat.id !== selected && (
        <Halo position={hoveredSat.position} color={SKY} scale={1.2} opacity={0.18} />
      )}
    </group>
  );
}

function Halo({
  position,
  color,
  scale,
  opacity,
}: {
  position: THREE.Vector3;
  color: string;
  scale: number;
  opacity: number;
}) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[DOT_RADIUS, 12, 12]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}
