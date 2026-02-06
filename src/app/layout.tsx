import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/shared/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fading Memories — Bring Your Memories Back to Life",
  description:
    "Describe your fading memories and watch them transform into beautiful anime-style artwork. Before they fade completely, bring your memories back to life.",
  openGraph: {
    title: "Fading Memories",
    description: "Before they fade completely, bring your memories back to life.",
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
      </body>
    </html>
  );
}
