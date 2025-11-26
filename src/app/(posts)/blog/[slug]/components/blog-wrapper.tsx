"use client"

import { ReactNode, useRef, useEffect } from "react";
import styles from '../../../../md.module.css';
import TOC from "@/app/(main)/components/table-of-contents";
import Comments from "@/app/(main)/components/comments";
import { resetSidenoteCounter } from "@/components/ui/sidenotes";
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
    resetSidenoteCounter();
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-5 lg:px-6 relative">
        {/* Header */}
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight mb-4 leading-tight">
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
        <div className="mb-10 p-6 bg-muted/30 rounded-sm border border-border/50">
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Contents</h2>
          </div>
          <TOC content={contentRef} />

          <div className="mt-8">
            <CicadaQuestion />
          </div>
        </div>

        <main className="relative">
          <div
            className={cn(
              styles.blogContent,
              "prose prose-lg max-w-none font-serif",
              // Math equation styles
              "prose-katex:overflow-x-auto prose-katex:overflow-y-hidden",
              // Code block styles
              "prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-sm",
              // Image styles
              "prose-img:rounded-sm prose-img:mx-auto prose-img:border prose-img:border-border",
              // Link styles
              "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4",
              // Heading styles
              "prose-headings:font-serif prose-headings:font-normal prose-headings:scroll-mt-24"
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
    </div>
  );
};

export default BlogWrapper;
