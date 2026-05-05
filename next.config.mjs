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
};

export default withSerwist(config);
