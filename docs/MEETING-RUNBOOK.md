# EDGE Sovereign EO Constellation: Meeting Runbook

The day-of operator's checklist. Run through this before the room
opens and again when you sit down with the iPad.

PRD reference: §11 (iPad-specific notes), §12 Phase 6 (Hardware QA),
§16 (Success criterion).

---

## T-72 hours: build & deploy

### Pre-flight asset check

Before the first `npm run build`, drop in the three asset bundles
that don't ship in git:

| Asset | Path | Without it |
|---|---|---|
| iPad PWA icons (5 PNGs) | `public/icons/` | iOS uses a generic letter glyph on Add-to-Home-Screen |
| Aptos web fonts (5 `.woff2`) + uncomment `@font-face` block in `app/globals.css` | `public/fonts/` | iPad falls back to Inter (Aptos isn't a system font on iPadOS) |
| Partner MP4s (orbit_cinematic, ground_tracks, aoi_iran_zoom) | `public/videos/` | flat-map toggle, AOI panel, methodology Reference tab show the placeholder gradient |

READMEs in each folder explain the exact filenames + the
pwa-asset-generator / Office-fonts-folder / ffmpeg paths.

### Build

```bash
git pull origin claude/bootstrap-eo-constellation-RIfbY
npm install
npm run build
```

Build must end with `(serwist) Bundling the service worker script ...`
and a successful `Generating static pages (9/9)`.

Deploy options:

- **Recommended for the demo iPad**: `npm run start` on a laptop
  on the same Wi-Fi as the iPad. Open the LAN URL on the iPad
  (Settings → About → Wi-Fi → IP). Add to Home Screen there.
- **Production hosting** (Vercel, Cloudflare Pages, anywhere static):
  `npm run build && npm run start` works as a Node server, or use
  `next export` if you want pure static.
- **Air-gapped iPad** (SCIF / closed room): deploy to a small device
  on a private network reachable from the iPad's Wi-Fi. PWA install
  + offline precache means once installed the iPad never needs the
  network again.

---

## T-24 hours: pre-flight check

### Hardware

- **iPad Pro 13" M4 (primary)** or 11" M-series (secondary).
- **Lightning / USB-C cable + 30W brick** in your bag. The demo runs
  ~30 min in the meeting; full charge survives 2× that, but a power
  hiccup mid-run kills the room. Plug in if a wall socket is reachable.
- **Ethernet adapter or known-good Wi-Fi**. Only matters for the first
  install + Add to Home Screen. After that the PWA precache covers
  everything (Earth texture, fonts, videos, all routes).

### Install path on the iPad

1. Open Safari (not Chrome: only Safari supports the manifest's
   landscape-locked standalone mode on iPadOS).
2. Visit the deploy URL.
3. Tap the **Share** icon → **Add to Home Screen**.
4. Confirm the title reads "EDGE EO" (short_name) or
   "EDGE Sovereign EO Constellation" (full).
5. Close Safari. Open the home-screen icon. App should launch in
   **landscape standalone** (no Safari chrome).

### Pre-warm + offline test

Once installed:

1. Tap the operator menu (top-right) → **Pre-warm globe textures**.
   Wait for the toast confirmation.
2. Walk through every dock dot once so each route compiles + caches.
3. Open the methodology modal (gold "How was this designed?" on
   `/constellation`) → tap each tab once.
4. Tap each AOI marker on the globe → confirm the side panel
   opens and the partner video begins.
5. **Now disable Wi-Fi on the iPad.**
6. Force-quit the PWA, relaunch from the home screen.
7. Re-walk all six screens. Everything must work offline.

If any asset 404s offline: `npm run build` again on the dev box,
re-deploy, re-install on the iPad. Serwist will re-precache.

### Brightness + glare

- Set iPad brightness to **max**. Auto-brightness OFF.
- Test in the actual meeting room lighting if you can. The Sovereign
  Black palette is dark by design; in a bright room the typography
  has to win against glare.
- If the room has ceiling spotlights, angle the iPad ~10° forward
  of vertical to dodge the worst reflection.

### Audio + haptic

- Default OFF. If you want the closing chime on completion of the
  Run Mission animation:
  - Open the operator menu → flip **Audio** ON.
  - Tap Run Mission once to confirm the chime fires
    (Tone.js needs the user gesture to start its AudioContext, so
    the toggle alone is insufficient: a tap arms it).
  - iPad ringer must not be on silent.
- Vibration: iPad Safari does not implement `navigator.vibrate`;
  the haptic on Run Mission is a no-op there. Expected.

### BASEER bridge

- /decision ends with a "Go to intel platform BASEER" button that
  opens https://gsa.origen.ae/ in a new tab. If the iPad is offline
  in a SCIF, the button does nothing - that's expected; the bridge
  is for the moment after the meeting when the conversation moves
  back to the existing intel platform.

---

## T-15 minutes: in the room

- Wake the iPad. Confirm:
  - Battery > 50%, or plugged in.
  - Wi-Fi off (or on if you're showing a live element: but
    everything in this demo is static so off is safer).
  - iPad in landscape; OrientationGate refuses portrait.
  - Home-screen-launched, not Safari-launched (no URL bar visible).
  - Notifications silenced (Focus mode > Do Not Disturb).
- Reset the mission stopwatch from the operator menu so the
  first tap of Run Mission starts from 0:00.
- Land on `/` cover. Begin button should pulse gold. Globe rotating.

---

## During the meeting

- Hand the iPad to the Chairman after the cover screen lands. Let
  him tap Begin himself. The pulse signals the affordance.
- Don't narrate during the Run Mission animation. The visuals
  narrate themselves; the Chairman's job is to watch with MoD.
- If MoD interrupts mid-animation, tap **Stop**. They'll often
  ask methodology questions next. Tap "How was this designed?" on
  `/constellation` to open the modal. The Reference tab is where
  partner-supplied evidence lives.
- If MoD asks "is the Iran zoom from your platform?": answer no:
  it's STAR.VISION simulation reference. The header bar says so
  explicitly.

---

## Post-meeting

- Note which screen MoD dwelled on. Note which question opened
  which modal. Note any visible objection.
- The single success metric is **"Did MoD say yes?"** (PRD §16).
  If yes, the platform worked. If no, find which screen lost them.

---

## If something breaks mid-meeting

| Symptom | Recovery |
|---|---|
| Globe stops rendering | Force-quit the PWA, relaunch. Service worker has cached everything. |
| Run Mission animation freezes | Stop button → Run Mission again. Stopwatch resets. |
| AOI panel opens to a blank video | The partner MP4 isn't in the precache. Either the file wasn't dropped before install, or naming is off. Close panel; AOI markers still inspectable on the globe. |
| iPad battery warning | Plug in. The cable is in your bag. |
| Wi-Fi drops mid-demo | No-op. Everything is precached. |
| Stopwatch shows fake-looking digits | Won't happen: we removed the fabricated mission clock. The demo elapsed counter is honest seconds. |

---

## Known caveats to disclose if asked

1. **The 4-config simulation comparison** uses interpolated revisit
   numbers from 4 partner runs. Full physics in
   `simulator-v2.tactica.ae` (linked in the modal footer).
2. **Daily-pass counts per AOI** in the side panel are derived from
   the canonical 22 SAR / 350 km / 38° configuration, not from the
   STAR.VISION video that shows the older 20-sat / 500 km / 42°
   config.
3. **The mission animation** is illustrative, not a real run. The
   platform lands "< 1 hour" intentionally, not a fabricated
   minute:second number.
4. **Bilingual EN/AR** is not in this build (PRD §13.6, decided
   2026-05-05). The deployed system is bilingual; this is the
   engineering brief.
