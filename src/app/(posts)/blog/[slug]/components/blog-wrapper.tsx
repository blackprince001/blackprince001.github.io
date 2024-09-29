"use client"

import { ReactNode, useRef } from "react";
import styles from '../../../../md.module.css';
import TOC from "@/app/(main)/components/table-of-contents";

type Props = {
  title: string;
  publishDate: string;
  tag: string;
  children: ReactNode;
};

function BlogWrapper({ title, publishDate, tag, children }: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null); // Reference for content

  return (
    <div className={`my-5 ${styles.markdown} w-full flex flex-col lg:flex-row`}>
      {/* div content area */}
      <div className="lg:w-full pr-8" ref={contentRef}>
        <div>
          <h5>{title}</h5>
          <p className="text-gray-500">{publishDate}</p>
          <p className="text-gray-500">#{tag}</p>
        </div>
        <hr className="my-5" />
        {/* Render the blog content */}
        <div className="w-full">{children}</div>
      </div>

      {/* Table of Contents */}
      <aside className="lg:w-1/4">
        <TOC content={contentRef} />
      </aside>
    </div>
  );
}

export default BlogWrapper;
