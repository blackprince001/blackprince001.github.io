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
      <ol className={`${styles.markdown} space-y-2`}>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}
            className="text-sm"
          >
            <a href={`#${heading.id}`} className="hover:text-gray-300 transition-colors">
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
          <summary className="list-none flex justify-between items-center cursor-pointer p-4">
            <h6 className="text-sm font-bold">Table of Contents</h6>
            <span className="transition-transform duration-200 group-open:rotate-180">▼</span>
          </summary>
          <div className="px-4 pb-4">
            {renderTOCContent()}
          </div>
        </details>
      </div>

      {/* Desktop TOC */}
      <div className="hidden lg:block border rounded-lg p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto">
        <h6 className="text-sm font-bold mb-4">Table of Contents</h6>
        {renderTOCContent()}
      </div>
    </>
  );
};

export default TOC;