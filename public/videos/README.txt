Drop partner-supplied MP4s here. File names must match lib/videos.ts:

  orbit_cinematic.mp4        : registry: cover_orbit_cinematic
  ground_tracks.mp4          : registry: ground_tracks_flat (constellation
                                "Flat map" toggle)
  aoi_iran_zoom.mp4          : registry: aoi_iran_zoom (Phase 3 AOI panel)
  aoi_hormuz_zoom.mp4        : registry: aoi_hormuz_zoom (Phase 3 AOI panel)
  aoi_palestine_zoom.mp4     : registry: aoi_palestine_zoom (Phase 3)
  aoi_gulfofoman_zoom.mp4    : registry: aoi_gulfofoman_zoom (Phase 3)
  slew_demonstration.mp4     : registry: slew_demonstration (methodology)

Posters (still JPG fallbacks) go in public/videos/posters/ with the
same basename as each MP4.

────────────────────────────────────────────────────────────────────
§4 OVERRIDE: read this before dropping files in
────────────────────────────────────────────────────────────────────

PRD §4 originally said "do not embed the partner deck's videos as-is"
because they show a 20-satellite optical constellation at 500 km / 42°
that contradicts our 22 SAR / 350 km / 38° pitch. That constraint was
overridden on 2026-05-05 with one condition:

  Every video instance MUST be framed as supporting evidence
  ("partner simulation"), never as a platform feature.

That framing is enforced in code:
  - app/page.tsx (cover): NO partner video. Cover renders our own
    globe only: partner footage on the cover would conflate partner
    work with our product identity.
  - app/constellation/page.tsx (flat-map toggle): renders a
    "Partner reference · STAR.VISION simulation · not platform output"
    header bar above the video plus a corner attribution chip via
    <MissionVideo attribution="..." />.
  - Future AOI side panel (Phase 3): pass attribution="STAR.VISION
    simulation" to every <MissionVideo>.
  - Future methodology Tab 2 (slew): same: attribution required.

If you add a new video slot that does NOT have visible attribution,
either update the slot to add it or drop the video. No exceptions.

────────────────────────────────────────────────────────────────────
Encoding
────────────────────────────────────────────────────────────────────

  H.264 baseline / AAC, MP4 container, ≤ 4 Mbps for iPad.
  Target ≤ 10 MB per file (PRD §11: 30 MB total bundle precache).
  Optional WebM/VP9 sibling: Safari falls through to the MP4.
  Posters: JPG ≤ 100 KB each, ideally a still frame at the visual
    apex of the loop.

After dropping files, update durationMs in lib/videos.ts to the real
durations:

  ffprobe -v error -show_entries format=duration <file>

Then `npm run build` and check the (serwist) line in the build output
to confirm the new entries got into the precache.

────────────────────────────────────────────────────────────────────
Until the MP4s arrive
────────────────────────────────────────────────────────────────────

<MissionVideo /> falls through to a CSS-driven placeholder loop on
src error. Pass forcePlaceholder to skip the network request.
