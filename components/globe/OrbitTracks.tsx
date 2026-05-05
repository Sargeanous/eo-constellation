"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { palette } from "@/lib/data";
import { buildOrbitPlanes } from "@/lib/orbit";

// One thin polyline per orbital plane. Semi-transparent so 11 of them
// don't overwhelm the Earth. Plain THREE.Line with a buffer geometry
// (drei's <Line> wraps a fatlines material we don't need here).

export function OrbitTracks() {
  const planes = useMemo(() => buildOrbitPlanes(96), []);

  const objects = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(palette.accentSky),
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    return planes.map((plane) => {
      const geom = new THREE.BufferGeometry().setFromPoints(plane.points);
      const line = new THREE.Line(geom, mat);
      line.userData.planeIndex = plane.index;
      return line;
    });
  }, [planes]);

  return (
    <group>
      {objects.map((obj, i) => (
        <primitive key={i} object={obj} />
      ))}
    </group>
  );
}
