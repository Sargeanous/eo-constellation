# EO-CONSTELLATION

iPad-first, read-only, cinematic narrative experience that proves a sub-1-hour
sovereign EO mission cycle to a defence customer. Six guided screens, a 3D
globe, a 50-second mission timeline animation, and a configuration sandbox.

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS + shadcn-style primitives (Radix)
- Zustand for UI state
- three.js + @react-three/fiber + @react-three/drei
- Framer Motion
- Tone.js (optional audio cues, gated by store flag)
- Serwist (PWA / offline)

No backend. No database. No external API. All content is static
(`lib/data.ts`).

## Domain content

Every place that needs operator-supplied copy is marked
`<DOMAIN_PLACEHOLDER>`. Search the repo for that string and fill in.

## Scripts

```bash
npm run dev        # Next dev server
npm run build      # Production build (also generates the service worker)
npm run start      # Run the production build
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
```

## Folder layout

```
app/                  # App Router routes (six pages)
components/
  ui/                 # shadcn primitives
  shell/              # Dock + OrientationGate
  motion/             # framer-motion variants + page transition
  globe/              # three / r3f globe canvas
  timeline/           # Mission timeline + Run Mission animation
  sandbox/            # /constellation configuration controls
lib/
  data.ts             # All static content
  store.ts            # Zustand store (single slice)
  audio.ts            # Tone.js cues
  utils.ts            # cn() and small helpers
public/
  manifest.webmanifest
  icons/              # iPad icons (drop PNGs in)
  textures/           # Earth maps (drop JPGs in)
```

## iPad / SCIF readiness

- Manifest declares `orientation: landscape`. Add to Home Screen launches in
  fullscreen landscape.
- `OrientationGate` shows a "rotate to landscape" prompt as a fallback.
- Serwist precaches every static asset including textures, so the demo runs
  offline once it has been opened once with network.

## Branch

Feature branch: `claude/bootstrap-eo-constellation-RIfbY`.
