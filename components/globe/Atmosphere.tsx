"use client";
import { useMemo } from "react";
import * as THREE from "three";

// Thin Fresnel limb glow (PRD §3). A back-side sphere slightly larger
// than Earth, additively blended, with a power-shaped Fresnel term so
// the atmosphere only lights up at glancing angles.

const VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), uPower);
    vec3 col = uColor * fres * uIntensity;
    gl_FragColor = vec4(col, fres);
  }
`;

export function Atmosphere({ scale = 1.025 }: { scale?: number }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#38BDF8") },
      uPower: { value: 3.0 },
      uIntensity: { value: 1.6 },
    }),
    [],
  );

  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1, 96, 96]} />
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
