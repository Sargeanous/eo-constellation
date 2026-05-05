# Methodology modal snapshots

Standalone SVG renders of each tab in the methodology modal
(`/constellation` → "How was this designed?"). Open any of these
files in a browser or image viewer for visual review.

| File | Tab | Notes |
|---|---|---|
| `01-orbit.svg` | Orbit | Walker-Delta 11P/2S diagram. 11 sky-blue ellipses (one highlighted gold), 22 sat dots at TA = 0° / 180°. |
| `02-slew.svg` | Slew | ±30° cone. Gold sweep wedge frozen at 0° in the snapshot: animates ±30° at 3.4s ease-in-out in the live modal. |
| `03-clustering.svg` | Target Clustering | 35 POIs across 8 alternating asc/desc stripes; T34 (amber) is the outlier sitting below the stripes. |

Re-render `03-clustering.svg` whenever the deterministic scatter
algorithm in `components/methodology/ClusteringTab.tsx` changes:

```bash
node scripts/snapshot-clustering.cjs > docs/snapshots/03-clustering.svg
```

(That script doesn't exist yet: for now the snapshot was generated
by an inlined node command in the bootstrap commit.)

The interactive modal verifies in `npm run dev` at
`http://localhost:3000/constellation` → tap the gold "How was this
designed?" button bottom-left.
