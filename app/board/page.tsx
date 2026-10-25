import type { Metadata } from "next";
import { Whiteboard } from "@/components/whiteboard";
import { canonical, siteConfig } from "@/lib/site";
import "@excalidraw/excalidraw/index.css";

const description =
  "A local whiteboard for data structures and system design. Sketch, annotate, pan, zoom, export a PNG, and keep the board in this browser.";

export const metadata: Metadata = {
  title: "Whiteboard",
  description,
  alternates: { canonical: canonical("/board/") },
  openGraph: {
    title: "Whiteboard — Vishesh",
    description,
    url: canonical("/board/"),
    type: "website",
  },
  robots: { index: false, follow: true },
};

export default function BoardPage() {
  return (
    <>
      <Whiteboard />
      <p className="sr-only">
        Whiteboard for {siteConfig.name}. Draw shapes, arrows and text. The board is
        saved in this browser only and can be exported as a PNG.
      </p>
    </>
  );
}
