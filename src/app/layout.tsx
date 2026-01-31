import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { NoiseOverlay } from "@/components/layout/NoiseOverlay";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "VT4S Admin Dashboard",
  description: "Advanced dashboard for school district administration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${newsreader.variable} antialiased bg-stone-black text-off-white selection:bg-acid-lime selection:text-stone-black`}
      >
        <SmoothScroll>
          <NoiseOverlay />
          <TopBar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
