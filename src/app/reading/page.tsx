import { Metadata } from "next";
import ReadingList from "./reading-list";

export const metadata: Metadata = {
  title: "Reading",
  description: "Books I am reading, have finished, or want to get to next.",
};

export default function ReadingPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="mb-4">Reading</h1>
      <p className="text-lg font-serif leading-relaxed mb-8">
        A loose log of what I am currently reading, have finished, or want to
        get to next.
      </p>
      <ReadingList />
    </main>
  );
}
