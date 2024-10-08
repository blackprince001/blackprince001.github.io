"use client"

import { ReactNode, useRef } from "react";
import styles from '../../../../md.module.css';
import TOC from "@/app/(main)/components/table-of-contents";

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

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
      <div className={`${styles.markdown} flex flex-col lg:flex-row lg:space-x-8`}>
        {/* Main content area */}
        <div className="flex-1" ref={contentRef}>
          <header>
            <h1>{title}</h1>
            <div className="flex flex-wrap gap-2 text-gray-500">
              <p>{publishDate}</p>
              <p>#{tag}</p>
            </div>
          </header>
          <hr className="my-5 border-gray-700" />
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Sidebar - reordered for mobile first */}
        <aside className="w-full lg:w-1/4 lg:flex-shrink-0">
          <TOC content={contentRef} />
        </aside>
      </div>
    </div>
  );
};

export default BlogWrapper;