"use client"

import { ReactNode, useRef, useEffect } from "react";
import styles from '../../../../md.module.css';
import TOC from "@/app/(main)/components/table-of-contents";
import Comments from "@/app/(main)/components/comments";
import { resetSidenoteCounter } from "@/components/ui/sidenotes";
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
    <div className="min-h-screen py-10">
      <div className="container max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <main className="relative">
            <div className="overflow-visible">
              <div
                className={cn(
                  styles.blogContent,
                  "px-6 py-8 lg:px-10 prose prose-gray dark:prose-invert max-w-none",
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
                <header className="not-prose mb-10">
                  <h1 className="text-2xl font-bold tracking-tight mb-4">
                    {title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <time dateTime={publishDate}>
                      {formatDate(parseDate(publishDate))}
                    </time>
                    <span>•</span>
                    <Badge>
                      {tag}
                    </Badge>
                  </div>
                </header>

                <hr className="my-10 border-border text-sm" />

                {/* Content */}
                {children}
              </div>

              {/* Comments */}
              <div className="px-6 lg:px-10 pb-8">
                <Comments />
              </div>
            </div>
          </main>

          {/* Table of Contents */}
          <aside className="order-first lg:order-last">
            <div className="sticky top-20">
              <TOC content={contentRef} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogWrapper;
