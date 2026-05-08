import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Dock } from "@/components/shell/Dock";
import { OrientationGate } from "@/components/shell/OrientationGate";
import { PageTransition } from "@/components/motion/PageTransition";
import { DebugMenu } from "@/components/shell/DebugMenu";
import { ThemeApplier } from "@/components/shell/ThemeApplier";
import { BrandLogo } from "@/components/shell/BrandLogo";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
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
  title: "EDGE Sovereign EO Constellation",
  description: "EDGE Sovereign EO Constellation. Sovereign by design.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EO-CONSTELLATION",
  },
  icons: {
    apple: "/icons/apple-touch-icon-180.png",
    icon: [
      { url: "/photos/favicon.png", type: "image/png" },
      { url: "/photos/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/photos/favicon.png",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#020617",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-background text-foreground antialiased font-sans">
        <ThemeApplier />
        <OrientationGate>
          <BrandLogo />
          <ThemeToggle />
          <PageTransition>{children}</PageTransition>
          <Dock />
          <DebugMenu />
          <Toaster position="top-center" />
        </OrientationGate>
      </body>
    </html>
  );
}
