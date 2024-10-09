'use client'

import Giscus from "@giscus/react";

export default function Comments() {
  return (
    <Giscus
      id="comments"
      repo="blackprince001/blackprince001.github.io"
      repoId="R_kgDOHYpg4Q"
      category="General"
      categoryId="DIC_kwDOHYpg4c4CjNIb"
      mapping="pathname"
      term="Reserve your comments!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="dark_dimmed"
      lang="en"
      loading="lazy"
    />
  );
}