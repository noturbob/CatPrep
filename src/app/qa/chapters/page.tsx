import type { Metadata } from "next";
import { ChapterGrid } from "@/components/chapter-grid";

export const metadata: Metadata = { title: "Chapters" };

export default function ChaptersPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-12 sm:px-6">
      <h1 className="text-h1 font-light">Chapters</h1>
      <p className="mt-4 max-w-[64ch] text-sub">
        Each one has the concepts, the patterns CAT keeps repeating, worked examples to attempt first, and a timed
        practice set. Learn all twelve by 31 October.
      </p>
      <div className="mt-14">
        <ChapterGrid />
      </div>
    </main>
  );
}
