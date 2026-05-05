Drop partner-supplied MP4s here. File names must match lib/videos.ts:

  orbit_cinematic.mp4         — cover screen background
  ground_tracks_flat.mp4      → ground_tracks.mp4 (filename per registry)
  ground_tracks.mp4           — /constellation flat-map toggle
  aoi_iran_zoom.mp4           — Tehran AOI side-panel zoom
  aoi_hormuz_zoom.mp4         — Hormuz AOI side-panel zoom
  aoi_palestine_zoom.mp4      — Palestine AOI side-panel zoom
  aoi_gulfofoman_zoom.mp4     — Gulf of Oman AOI side-panel zoom
  slew_demonstration.mp4      — methodology / slew tab

Posters (still JPG fallbacks) go in public/videos/posters/ with the
same basename as each MP4.

Until these arrive, MissionVideo falls through to a CSS-driven
placeholder loop on src error. To force-skip the network request, pass
forcePlaceholder to <MissionVideo> at the call site.

IMPORTANT (PRD §4): the partner's existing MP4s show a 20-satellite
optical constellation at 500 km / 42°. Those visuals contradict our
canonical 22 SAR / 350 km / 38° pitch. Do NOT drop them in here as-is
— they're being regenerated. Only commit MP4s that match the canonical
config.
