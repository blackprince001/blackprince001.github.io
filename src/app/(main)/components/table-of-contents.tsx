import React from "react";
import styles from '../../md.module.css';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w]+/g, '-')
    .replace(/^-+|-+$/g, '');

interface Heading {
  text: string;
  level: number;
  id: string;
}

interface TOCProps {
  content: React.MutableRefObject<HTMLElement | null>;
}

const TOC: React.FC<TOCProps> = ({ content }) => {
  const [headings, setHeadings] = React.useState<Heading[]>([]);

  React.useEffect(() => {
    if (content.current)
    {
      const headingElements = Array.from(
        content.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
      ) as HTMLElement[];

      const headingsArray = headingElements.map((heading) => {
        const text = heading.innerText || heading.textContent || '';
        let id = heading.id || slugify(text);
        heading.id = id;
        return {
          text,
          level: Number(heading.tagName.replace('H', '')),
          id,
        };
      });

      setHeadings(headingsArray);
    }
  }, [content]);

  const renderTOCContent = () => (
    <nav>
      <ol className={`${styles.markdown} space-y-1.5`}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ marginLeft: `${(heading.level - 1) * 0.75}rem` }}
            className="text-sm leading-relaxed"
          >
            <a href={`#${heading.id}`} className="hover:text-primary transition-colors text-muted-foreground">
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <>
      {/* Mobile TOC */}
      <div className="lg:hidden w-full border rounded-lg mb-6">
        <details className="group w-full">
          <summary className="list-none flex justify-between items-center cursor-pointer p-3">
            <h6 className="text-sm font-bold">Table of Contents</h6>
            <span className="transition-transform duration-200 group-open:rotate-180 text-sm">▼</span>
          </summary>
          <div className="px-3 pb-3">
            {renderTOCContent()}
          </div>
        </details>
      </div>

      {/* Desktop TOC */}
      <div className="hidden lg:block">
        {renderTOCContent()}
      </div>
    </>
  );
};

export default TOC;