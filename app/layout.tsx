import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Dock } from "@/components/shell/Dock";
import { OrientationGate } from "@/components/shell/OrientationGate";
import { PageTransition } from "@/components/motion/PageTransition";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "<DOMAIN_PLACEHOLDER>",
  description: "<DOMAIN_PLACEHOLDER>",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "<DOMAIN_PLACEHOLDER>",
  },
  icons: {
    apple: "/icons/apple-touch-icon-180.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0d12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${mono.variable}`}>
      <body className="bg-background text-foreground antialiased font-sans">
        <OrientationGate>
          <PageTransition>{children}</PageTransition>
          <Dock />
        </OrientationGate>
      </body>
    </html>
  );
}
