"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function GlobeScene() {
  const earthRef = useRef<THREE.Mesh>(null);
  // Textures are precached by Serwist; safe to load directly.
  const [day, normal] = useTexture([
    "/textures/earth-day.jpg",
    "/textures/earth-normal.jpg",
  ]);

  useFrame((_state, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} />
      <Stars radius={50} depth={20} count={2000} factor={4} fade />
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          map={day}
          normalMap={normal}
          metalness={0.05}
          roughness={0.85}
        />
      </mesh>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}
