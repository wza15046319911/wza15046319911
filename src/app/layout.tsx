import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { Providers } from "@/components/providers";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const description =
  "Full stack developer with 5+ years shipping scalable products end to end. React, Next.js, Node.js, Python, PostgreSQL, AWS and GCP. Based in Melbourne, Australia.";

export const metadata: Metadata = {
  metadataBase: new URL("https://lewiswang.com.au"),
  title: {
    default: "Zane Wang | Full Stack Developer",
    template: "%s | Zane Wang",
  },
  description,
  authors: [{ name: "Zian Wang", url: "https://lewiswang.com.au" }],
  creator: "Zian Wang",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://lewiswang.com.au",
    title: "Zane Wang | Full Stack Developer",
    description,
    siteName: "Zane Wang",
    locale: "en_AU",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zane Wang, Full Stack Developer in Melbourne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zane Wang | Full Stack Developer",
    description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#10100e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${schibsted.variable} antialiased`}>
      <body className="bg-canvas font-grotesk text-ink">
        <Providers>{children}</Providers>
        <JsonLd />
      </body>
    </html>
  );
}
