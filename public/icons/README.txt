iPad / PWA icons. Drop these PNGs here:

  apple-touch-icon-180.png   180x180  iOS home screen (after Add to Home Screen)
  icon-192.png               192x192  any-purpose
  icon-192-maskable.png      192x192  maskable (safe-zone padding)
  icon-512.png               512x512  any-purpose
  icon-512-maskable.png      512x512  maskable

The manifest references /icons/icon-{192,512}{,-maskable}.png and
app/layout.tsx references /icons/apple-touch-icon-180.png.

QUICK PRODUCTION PATH
=====================
If you have an SVG wordmark and a square logo:

  npx pwa-asset-generator logo.svg ./public/icons --background "#020617" --padding "12%" --opaque false

Or hand-export from Figma at the five sizes above. Background should
be the deep-space slate (#020617) so iPadOS doesn't add white
chrome around the icon.

iOS SPLASH SCREENS
==================
Optional but nice for the Add-to-Home-Screen install. iOS picks the
splash that matches the device pixel dimensions exactly. Drop into
public/icons/splash/ and add <link rel="apple-touch-startup-image">
entries to app/layout.tsx if you want the pre-render flash on first
launch to be branded.

For the meeting iPad (iPad Pro 13" M4, 1366x2048 effective), the
relevant splash sizes are 2048x2732 (portrait) and 2732x2048
(landscape). The default behaviour without a splash is a black
screen for ~300 ms, which is acceptable for the demo.
