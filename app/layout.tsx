import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lewiswang.com.au"),
  title: {
    default: "Zian Wang | Senior Full Stack Developer",
    template: "%s | Zian Wang",
  },
  description:
    "Senior Full Stack Developer with 5+ years experience building scalable web applications. Specializing in React, Next.js, Node.js, TypeScript, and cloud technologies. Based in Brisbane, Australia.",
  keywords: [
    "Full Stack Developer",
    "Senior Software Engineer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript",
    "Python Developer",
    "Brisbane Developer",
    "Australia Developer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Cloud Engineer",
    "AWS",
    "GCP",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "Zian Wang",
  ],
  authors: [{ name: "Zian Wang", url: "https://lewiswang.com.au" }],
  creator: "Zian Wang",
  publisher: "Zian Wang",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://lewiswang.com.au",
    siteName: "Zian Wang | Portfolio",
    title: "Zian Wang | Senior Full Stack Developer",
    description:
      "Senior Full Stack Developer with 5+ years experience. Building scalable applications with React, Next.js, Node.js, and cloud technologies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zian Wang - Senior Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zian Wang | Senior Full Stack Developer",
    description:
      "Senior Full Stack Developer with 5+ years experience. Building scalable applications with React, Next.js, Node.js, and cloud technologies.",
    images: ["/og-image.png"],
    creator: "@zianwang",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://lewiswang.com.au",
  },
  category: "technology",
  other: {
    "geo.region": "AU-QLD",
    "geo.placename": "Brisbane",
    "geo.position": "-27.4705;153.0260",
    ICBM: "-27.4705, 153.0260",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
