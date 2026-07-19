import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Budget & Sport Tracker",
  description: "Track your finances and fitness programmes in one place.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#EEC1A0",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{ background: "var(--bg)", color: "var(--t1)" }}
      >
        {children}
      </body>
    </html>
  );
}
