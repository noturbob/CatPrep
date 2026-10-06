import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

// Stand-in for Aeonik Mono (commercial); same open, technical mono voice.
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// The canonical address. Vercel's VERCEL_PROJECT_PRODUCTION_URL can name a different alias of the
// same project, which left share previews pointing at a domain that didn't serve them.
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://catprep-95.vercel.app";

const description = "CAT 2026 in 55 days: the 95th percentile in VARC, DILR and QA, plus a percentile calculator, IIM cutoffs and the top 50 schools.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "catprep — CAT 2026", template: "%s · catprep" },
  description,
  applicationName: "catprep",
  openGraph: { type: "website", siteName: "catprep", title: "catprep — 95th in every section", description, locale: "en_IN" },
  twitter: { card: "summary_large_image", title: "catprep — 95th in every section", description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4efea" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Runs before paint so a saved dark theme never flashes cream.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
