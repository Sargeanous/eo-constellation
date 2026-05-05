Drop Earth textures here:
  earth-day.jpg     — diffuse map (recommended 4096×2048 equirectangular)
  earth-normal.jpg  — normal map (same resolution)
  earth-spec.jpg    — optional specular for water shine

GlobeScene.tsx loads these via @react-three/drei's useTexture; Serwist
precaches them so the demo works offline in the SCIF.
