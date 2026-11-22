import type { Metadata } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/plus-jakarta-sans/wght-italic.css";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/caveat";
import "@fontsource/bebas-neue";
import "@fontsource/instrument-serif";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/tiro-devanagari-hindi";
import "@fontsource/special-elite";
import "./globals.css";
import Providers from "@/components/Providers";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import ChaiButton from "@/components/ChaiButton";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"),
  title: "Anjali Gupta — Developer · Teacher · Cinephile",
  description:
    "Backend developer from Howrah building ONDC and e-commerce systems at Senrysa. Also a teacher, a cinephile and a listener of ghazals.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Anjali Gupta",
    title: "Anjali Gupta",
    description: "Developer · Teacher · Cinephile · Listener of ghazals",
    images: ["/images/hero-temple.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <ThemeToggle />
          <ChaiButton />
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
