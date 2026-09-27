import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Instrument_Serif, Inter, JetBrains_Mono, Unbounded } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Unbounded({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const thai = IBM_Plex_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "700"], variable: "--font-thai" });

export const metadata: Metadata = {
  title: "PUG — Developer & Robotics Innovator",
  description: "Portfolio of Pug — student developer and robotics innovator from Thailand.",
};

export const viewport: Viewport = {
  themeColor: "#050507",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={[display, serif, mono, sans, thai].map(f => f.variable).join(" ")}>
      <body className="is-locked">
        {children}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves={3} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
