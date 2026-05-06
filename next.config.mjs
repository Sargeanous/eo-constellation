import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: { unoptimized: true },
  transpilePackages: ["three"],
  // Serve /photos/logoedge.png at the conventional /favicon.ico path
  // so the browser tab picks it up. Browsers request /favicon.ico
  // implicitly regardless of <link rel="icon"> in the document head;
  // without this rewrite Chrome / Edge land on a generic globe glyph
  // even when the metadata icons are set.
  async rewrites() {
    return [
      { source: "/favicon.ico", destination: "/photos/logoedge.png" },
    ];
  },
};

export default withSerwist(config);
