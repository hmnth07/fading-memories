import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create — Fading Memories",
  description:
    "Describe your fading memory and watch it transform into beautiful anime-style artwork.",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
