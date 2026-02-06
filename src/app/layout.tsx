import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memory to Anime — Transform Your Memories Into Anime Art",
  description:
    "Describe your most precious memories and watch them transform into beautiful anime-style artwork. Your memories deserve to be art.",
  openGraph: {
    title: "Memory to Anime — Transform Your Memories Into Anime Art",
    description: "Describe your most precious memories and watch them transform into beautiful anime-style artwork. Your memories deserve to be art.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
