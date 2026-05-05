// Video registry. The actual MP4 files arrive once the partner
// (STAR.VISION) regenerates their renders against our canonical 22 SAR
// / 350 km / 38° configuration. Until they land, <MissionVideo /> falls
// through to a CSS-driven placeholder loop so layout and transitions
// stay testable.

export interface VideoEntry {
  id: string;
  src: string; // path under /public/videos/
  posterSrc: string; // /public/videos/posters/<id>.jpg
  durationMs: number;
  loop: boolean;
  caption?: string;
}

export type VideoId =
  | "cover_orbit_cinematic"
  | "ground_tracks_flat"
  | "aoi_iran_zoom"
  | "aoi_hormuz_zoom"
  | "aoi_palestine_zoom"
  | "aoi_gulfofoman_zoom"
  | "slew_demonstration";

export const VIDEOS: Record<VideoId, VideoEntry> = {
  cover_orbit_cinematic: {
    id: "cover_orbit_cinematic",
    src: "/videos/orbit_cinematic.mp4",
    posterSrc: "/videos/posters/orbit_cinematic.jpg",
    durationMs: 12_000,
    loop: true,
  },
  ground_tracks_flat: {
    id: "ground_tracks_flat",
    src: "/videos/ground_tracks.mp4",
    posterSrc: "/videos/posters/ground_tracks.jpg",
    durationMs: 15_000,
    loop: true,
  },
  aoi_iran_zoom: {
    id: "aoi_iran_zoom",
    src: "/videos/aoi_iran_zoom.mp4",
    posterSrc: "/videos/posters/aoi_iran_zoom.jpg",
    durationMs: 8_000,
    loop: false,
  },
  aoi_hormuz_zoom: {
    id: "aoi_hormuz_zoom",
    src: "/videos/aoi_hormuz_zoom.mp4",
    posterSrc: "/videos/posters/aoi_hormuz_zoom.jpg",
    durationMs: 8_000,
    loop: false,
  },
  aoi_palestine_zoom: {
    id: "aoi_palestine_zoom",
    src: "/videos/aoi_palestine_zoom.mp4",
    posterSrc: "/videos/posters/aoi_palestine_zoom.jpg",
    durationMs: 8_000,
    loop: false,
  },
  aoi_gulfofoman_zoom: {
    id: "aoi_gulfofoman_zoom",
    src: "/videos/aoi_gulfofoman_zoom.mp4",
    posterSrc: "/videos/posters/aoi_gulfofoman_zoom.jpg",
    durationMs: 8_000,
    loop: false,
  },
  slew_demonstration: {
    id: "slew_demonstration",
    src: "/videos/slew_demonstration.mp4",
    posterSrc: "/videos/posters/slew_demonstration.jpg",
    durationMs: 10_000,
    loop: true,
  },
};

/** AOI id (from lib/data.ts) → AOI zoom video id. */
export const AOI_VIDEO_MAP: Record<string, VideoId> = {
  tehran: "aoi_iran_zoom",
  hormuz: "aoi_hormuz_zoom",
  palestine: "aoi_palestine_zoom",
  gulfofoman: "aoi_gulfofoman_zoom",
};
