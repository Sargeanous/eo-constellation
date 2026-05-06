"use client";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/lib/data";
import { AOI_VECTORS } from "@/lib/orbit";
import { useDemoStore } from "@/lib/store";

// Pulsing markers at the 4 AOIs. The halo breathes on a 2.4s cycle so
// the markers visibly invite a tap. Each marker has a gold text
// label floating just off-axis so MoD can see WHAT'S TAPPABLE without
// a tooltip - the audit flagged the markers as not visibly identified.
// Selected AOI gets a brighter, larger gold halo on top of the breath.

export function AOIMarkers() {
  const goldColor = useMemo(() => new THREE.Color(palette.accentGold), []);
  const selected = useDemoStore((s) => s.selectedAOIId);
  const setSelected = useDemoStore((s) => s.setSelectedAOI);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <group>
      {AOI_VECTORS.map((a) => {
        const isSelected = selected === a.id;
        const isHovered = hovered === a.id;
        const liftedPos = a.vec.clone().multiplyScalar(1.003);

        return (
          <AOIMarker
            key={a.id}
            position={liftedPos}
            label={a.name}
            color={goldColor}
            selected={isSelected}
            hovered={isHovered}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(a.id);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered(null);
              document.body.style.cursor = "default";
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(isSelected ? null : a.id);
            }}
          />
        );
      })}
    </group>
  );
}

const DOT_RADIUS = 0.018;
const HIT_RADIUS = DOT_RADIUS * 4;

interface AOIMarkerProps {
  position: THREE.Vector3;
  label: string;
  color: THREE.Color;
  selected: boolean;
  hovered: boolean;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
  onClick: (e: any) => void;
}

function AOIMarker({
  position,
  label,
  color,
  selected,
  hovered,
  onPointerOver,
  onPointerOut,
  onClick,
}: AOIMarkerProps) {
  // Breath: scale 1.0 -> 1.45 -> 1.0 over 2.4s, opacity 0.25 -> 0.55 -> 0.25.
  // Selected adds a brighter steady halo on top so the user always sees
  // which marker corresponds to the open side panel.
  const breathRef = useRef<THREE.Mesh>(null);
  const breathMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const phase = (t % 2.4) / 2.4; // 0..1
    // Smooth ease in/out using sin(2πt) shaped to [0..1..0]
    const eased = 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
    const scale = 1 + eased * 0.45;
    const op = 0.25 + eased * 0.3;
    if (breathRef.current) breathRef.current.scale.setScalar(scale);
    if (breathMatRef.current) breathMatRef.current.opacity = op;
  });

  return (
    <group
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      {/* Breath halo: animates every frame */}
      <mesh ref={breathRef}>
        <sphereGeometry args={[DOT_RADIUS * 1.6, 12, 12]} />
        <meshBasicMaterial
          ref={breathMatRef}
          color={color}
          transparent
          opacity={0.25}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      {/* Selection / hover overlay halo: static brighter mesh, only
          mounted when relevant. */}
      {(selected || hovered) && (
        <mesh scale={selected ? 1.6 : 1.25}>
          <sphereGeometry args={[DOT_RADIUS * 1.6, 12, 12]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={selected ? 0.7 : 0.4}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      )}
      {/* Visible dot */}
      <mesh>
        <sphereGeometry args={[DOT_RADIUS, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* Invisible touch hit target */}
      <mesh visible={false}>
        <sphereGeometry args={[HIT_RADIUS, 6, 6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {/* Floating label - reads as a tap target. occlude=blending hides
          the label when the marker is on the back hemisphere so labels
          don't show through the Earth. */}
      <Html
        position={[0, 0, 0]}
        center
        occlude="blending"
        zIndexRange={[60, 0]}
        style={{ pointerEvents: "none" }}
      >
        <span
          className="cinematic-surface inline-block translate-x-3 translate-y-2 whitespace-nowrap rounded-full border border-gold/40 bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold backdrop-blur-md"
          style={{
            opacity: selected ? 1 : 0.85,
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
}
