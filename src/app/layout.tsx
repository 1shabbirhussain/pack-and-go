import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteUrl } from "@/lib/format";

const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin-opsz-normal.woff2", style: "normal", weight: "100 900" },
    { path: "../fonts/fraunces-latin-opsz-italic.woff2", style: "italic", weight: "100 900" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const inter = localFont({
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Pack & Go Tourism — Group tours & customized trips across Pakistan", template: "%s | Pack & Go Tourism" },
  description:
    "Family-oriented group tours to Naran, Kashmir, Hunza and Skardu from Karachi and Islamabad, plus customized trips anywhere in Pakistan. Offices in Hyderabad and Karachi.",
  applicationName: "Pack & Go Tourism",
  openGraph: { type: "website", siteName: "Pack & Go Tourism", locale: "en_PK", images: [{ url: "/images/photos/meadow-horse-lake.webp", width: 1920, height: 1280 }] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#232a3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
