"use client"

import { ReactNode, useRef, useEffect } from "react";
import styles from '../../../../md.module.css';
import TOC from "@/app/(main)/components/table-of-contents";
import Comments from "@/app/(main)/components/comments";
import { resetMarginNoteCounter, MarginNotesProvider, BilateralMarginNotesContainer } from "@/components/ui/margin-notes";
import CicadaQuestion from "@/components/cicada-questions";
import { formatDate, parseDate } from "@/utils/date";
import { cn } from "@/lib/utils";
import ImageLightbox from "@/components/ui/image-lightbox";

interface BlogWrapperProps {
  title: string;
  publishDate: string;
  tag: string;
  children: ReactNode;
}

const BlogWrapper: React.FC<BlogWrapperProps> = ({
  title,
  publishDate,
  tag,
  children
}) => {
  // Ref for the prose content element — used by TOC
  const contentRef = useRef<HTMLDivElement | null>(null);
  // Ref for the positioning context that wraps the article body — used by margin notes
  const positionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    resetMarginNoteCounter();
  }, []);

  return (
    <MarginNotesProvider>
      <div className="min-h-screen py-12">

        {/* ── Header + TOC — outside the positioning context ── */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10 border-b border-border pb-8">
            <h1>{title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground font-mono text-sm">
              <time dateTime={publishDate}>
                {formatDate(parseDate(publishDate))}
              </time>
              <span>/</span>
              <span className="uppercase tracking-wider">{tag}</span>
            </div>
          </header>

          <div className="mb-10 p-4 bg-muted/30 rounded-sm border border-border/50">
            <div className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contents</h2>
            </div>
            <TOC content={contentRef} />
            <div className="mt-6">
              <CicadaQuestion />
            </div>
          </div>
        </div>

        {/*
          ── Positioning context ──
          This `position: relative` wrapper is the coordinate space for all
          margin note columns. Notes are `position: absolute` children of it,
          anchored to their paragraph's vertical position.
          It is full-width so the panels can sit in the viewport margins.
        */}
        <div ref={positionRef} className="relative w-full">
          {/* Article body */}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <main>
              <div
                ref={contentRef}
                className={cn(
                  styles.blogContent,
                  "prose prose-lg xl:prose-xl max-w-none font-serif",
                  "xl:overflow-x-visible",
                  "prose-katex:overflow-x-auto prose-katex:overflow-y-hidden",
                  "prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-sm",
                  "prose-img:rounded-sm prose-img:mx-auto prose-img:border prose-img:border-border",
                  "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4",
                  "prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-headings:scroll-mt-24"
                )}
              >
                <ImageLightbox>
                  {children}
                </ImageLightbox>
              </div>

              <hr className="my-12 border-border" />

              <div className="pb-12">
                <Comments />
              </div>
            </main>
          </div>

          {/*
            Margin note columns — absolutely positioned inside positionRef.
            Each note card sits at the exact vertical position of its marker.
            They don't move when the user scrolls.
          */}
          <BilateralMarginNotesContainer wrapperRef={positionRef} />
        </div>

      </div>
    </MarginNotesProvider>
  );
};

export default BlogWrapper;
