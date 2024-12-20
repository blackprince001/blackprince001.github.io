"use client"

import { ReactNode, useRef, useEffect } from "react";
import styles from '../../../../md.module.css';
import TOC from "@/app/(main)/components/table-of-contents";
import Comments from "@/app/(main)/components/comments";
import { resetSidenoteCounter } from "@/components/ui/sidenotes";

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
  }, [title]);

  return (
    <div className="min-h-screen">
      {/* Main container with wide margins for sidenotes */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:space-x-16">
          {/* Main content area with fixed width */}
          <main className="lg:w-[750px]">
            <article className={styles.markdown} ref={contentRef}>
              {/* Header section */}
              <header className="mb-12">
                <h1 className="text-[2.5rem] mb-4">{title}</h1>
                <div className="flex flex-wrap gap-3 text-[#a0a0a0] text-lg">
                  <time dateTime={publishDate}>{publishDate}</time>
                  <span>•</span>
                  <span>#{tag}</span>
                </div>
              </header>

              <hr className="border-[#333333] mb-12" />

              {/* Main content */}
              <div className="relative prose-lg">
                {children}
              </div>
            </article>

            {/* Comments section */}
            <div className="mt-20">
              <Comments />
            </div>
          </main>

          {/* Table of Contents sidebar */}
          <aside className="w-72 flex-shrink-0 order-first lg:order-last">
            <div className="sticky top-24">
              <TOC content={contentRef} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogWrapper;