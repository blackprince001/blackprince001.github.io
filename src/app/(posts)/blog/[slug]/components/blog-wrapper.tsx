"use client"

import { ReactNode, useRef, useEffect } from "react";
import styles from '../../../../md.module.css';
import TOC from "@/app/(main)/components/table-of-contents";
import Comments from "@/app/(main)/components/comments";
import { resetSidenoteCounter } from "@/components/ui/sidenotes";
import CicadaQuestion from "@/components/cicada-questions";
import { formatDate, parseDate } from "@/utils/date";
import { cn } from "@/lib/utils";
import { Badge } from "lucide-react";


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
      <div className="container max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          <main className="relative">
            <div className="overflow-visible">
              <div
                className={cn(
                  styles.blogContent,
                  "px-6 py-10 lg:px-12 prose prose-gray dark:prose-invert max-w-none",
                  // Math equation styles
                  "prose-katex:overflow-x-auto prose-katex:overflow-y-hidden",
                  // Code block styles
                  "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
                  // Image styles
                  "prose-img:rounded-lg prose-img:mx-auto",
                  // Link styles
                  "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                  // Heading styles
                  "prose-headings:scroll-mt-20"
                )}
                ref={contentRef}
              >
                {/* Header */}
                <header className="not-prose mb-12">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    {title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-lg">
                    <time dateTime={publishDate}>
                      {formatDate(parseDate(publishDate))}
                    </time>
                    <span>•</span>
                    <Badge className="text-base px-3 py-1">
                      {tag}
                    </Badge>
                  </div>
                </header>

                <hr className="my-12 border-border" />

                {/* Content */}
                {children}
              </div>

              {/* Comments */}
              <div className="px-6 lg:px-12 pb-12">
                <Comments />
              </div>
            </div>
          </main>

          {/* Table of Contents */}
          <aside className="order-first lg:order-last">
            <TOC content={contentRef} />

            <CicadaQuestion />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogWrapper;
