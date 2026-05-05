"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import * as THREE from "three";
import { Atmosphere } from "./Atmosphere";
import { Satellites } from "./Satellites";
import { OrbitTracks } from "./OrbitTracks";
import { AOIMarkers } from "./AOIMarkers";
import { MENA_CENTRE } from "@/lib/orbit";

interface GlobeSceneProps {
  /** Slow auto-rotation around the Earth's polar axis. Disable on
   *  /constellation where the user is meant to drag. */
  autoRotate?: boolean;
  /** Allow drag/pinch to inspect — true on /constellation, false on
   *  the cover screen where the globe is purely scenic. */
  interactive?: boolean;
  /** Whether to render orbit polylines + AOI markers + satellite
   *  dots. The cover screen wants all of them; future Phase 3 may
   *  selectively hide. */
  showOrbits?: boolean;
  showSatellites?: boolean;
  showAOIs?: boolean;
}

export default function GlobeScene({
  autoRotate = true,
  interactive = false,
  showOrbits = true,
  showSatellites = true,
  showAOIs = true,
}: GlobeSceneProps) {
  const earthRef = useRef<THREE.Group>(null);
  const dayMap = useTexture("/textures/earth-day.jpg");
  // sRGB so the Blue Marble doesn't render flat in linear space.
  dayMap.colorSpace = THREE.SRGBColorSpace;

  const { camera } = useThree();
  // Aim the camera at MENA (lat 25°N, lng 50°E). The orbit math
  // produces +Z = north pole, so we swap to Three.js's default
  // +Y up by rotating the whole world group: see <group rotation> below.
  // MENA_CENTRE in our orbit frame is (x, y, z); after the world rotation
  // we want it visible roughly centred in front of the camera.

  // Slow auto-rotation — Apple-flavoured, never instant. Roughly one
  // revolution per 80 seconds. Disabled when interactive (so OrbitControls
  // can drive rotation manually).
  useFrame((_state, delta) => {
    if (autoRotate && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <>
      {/* Star-field — drei's Stars, faded out at the limit. PRD §3
          says background should be deep-space navy not pure black; we
          set the canvas clear color separately in <Globe>. */}
      <Stars radius={80} depth={30} count={3500} factor={3.5} fade />

      {/* Lighting — one warm key light from over the Gulf, plus a cool
          fill from the opposite side, plus low ambient so the night-side
          isn't pitch black. */}
      <ambientLight intensity={0.18} />
      <directionalLight position={[5, 2.5, 5]} intensity={1.4} />
      <directionalLight
        position={[-5, -1.5, -3]}
        intensity={0.25}
        color="#94A3B8"
      />

      {/* Rotate the whole world so our orbit-math frame (+Z = north)
          aligns with Three.js's conventional +Y = up. Then rotate
          again so MENA faces the camera at t=0. */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group ref={earthRef} rotation={[0, computeMenaYaw(), 0]}>
          <mesh>
            <sphereGeometry args={[1, 96, 96]} />
            <meshStandardMaterial
              map={dayMap}
              metalness={0.0}
              roughness={0.92}
            />
          </mesh>
          {showOrbits && <OrbitTracks />}
          {showSatellites && <Satellites />}
          {showAOIs && <AOIMarkers />}
          <Atmosphere />
        </group>
      </group>

      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={1.6}
          maxDistance={4.5}
          rotateSpeed={0.35}
          dampingFactor={0.08}
        />
      )}
    </>
  );
}

// Rotate the Earth around its polar axis so MENA sits in front of the
// camera at t=0. We solve for the yaw that puts MENA_CENTRE on the +X
// axis (camera looks down -Z; after the world's -π/2 X-axis rotation
// the +Z scene axis lands on -Y in world frame, so what was MENA_CENTRE
// is now (MENA.x, MENA.z, -MENA.y) and we want its xz-projection on +X).
function computeMenaYaw(): number {
  const m = MENA_CENTRE; // unit vector in orbit frame
  // After the parent's rotation [-π/2, 0, 0] applied to Three.js axes,
  // points on the Earth's surface are seen from +Z. We rotate around Y
  // so that the point's projection lands on +Z (camera-facing).
  // In the inner group's local frame, the surface point is (m.x, m.z, -m.y).
  // We want the rotation θ around Y such that:
  //     [cos θ, 0, sin θ]  · [x] = +Z component max.
  //     [0,    1, 0     ]    [y]
  //     [-sin θ,0, cos θ]    [z]
  // So θ = atan2(x, z) of the inner-frame coordinates.
  const x = m.x;
  const z = -m.y;
  return Math.atan2(x, z);
}

export function GlobeBloom() {
  // Bloom on satellite dots and AOI markers. Both use unlit, high-emissive
  // colours that exceed luminanceThreshold; the Earth itself stays matte.
  return (
    <EffectComposer>
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.2}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />
    </EffectComposer>
  );
}
