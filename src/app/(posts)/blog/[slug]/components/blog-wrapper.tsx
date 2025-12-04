"use client"

import { ReactNode, useRef, useEffect } from "react";
import styles from '../../../../md.module.css';
import TOC from "@/app/(main)/components/table-of-contents";
import Comments from "@/app/(main)/components/comments";
import { resetMarginNoteCounter, MarginNotesProvider, MarginNotesContainer } from "@/components/ui/margin-notes";
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
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    resetMarginNoteCounter();
  }, []);

  return (
    <MarginNotesProvider>
      <div className="min-h-screen py-12">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <header className="mb-10 border-b border-border pb-8">
            <h1>
              {title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground font-mono text-sm">
              <time dateTime={publishDate}>
                {formatDate(parseDate(publishDate))}
              </time>
              <span>/</span>
              <span className="uppercase tracking-wider">
                {tag}
              </span>
            </div>
          </header>

          {/* Sidebar / TOC Area */}
          <div className="mb-10 p-4 bg-muted/30 rounded-sm border border-border/50">
            <div className="mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contents</h2>
            </div>
            <TOC content={contentRef} />

            <div className="mt-6">
              <CicadaQuestion />
            </div>
          </div>

          <main className="relative">
            {/* Main content column - simplified, no grid needed */}
            <div
              className={cn(
                styles.blogContent,
                "prose prose-lg xl:prose-xl max-w-none font-serif",
                // Allow carousel to break out - only hide overflow for mobile math
                "xl:overflow-x-visible",
                // Math equation styles
                "prose-katex:overflow-x-auto prose-katex:overflow-y-hidden",
                // Code block styles
                "prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-sm",
                // Image styles
                "prose-img:rounded-sm prose-img:mx-auto prose-img:border prose-img:border-border",
                // Link styles
                "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4",
                // Heading styles - use consistent global heading styles
                "prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-headings:scroll-mt-24"
              )}
              ref={contentRef}
            >
              <ImageLightbox>
                {children}
              </ImageLightbox>
            </div>

            <hr className="my-12 border-border" />

            {/* Comments */}
            <div className="pb-12">
              <Comments />
            </div>
          </main>
        </div>

        {/* Fixed margin notes container on the right */}
        <MarginNotesContainer />
      </div>
    </MarginNotesProvider>
  );
};

export default BlogWrapper;
