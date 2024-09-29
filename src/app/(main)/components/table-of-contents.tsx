import { useEffect, useState, MutableRefObject } from 'react';

// Helper function to generate slug-friendly IDs from headings
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w]+/g, '-') // Replace non-word characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

interface Heading {
  text: string;
  level: number;
  id: string;
}

interface TableOfContentsProps {
  content: MutableRefObject<HTMLElement | null>;
}

const TOC: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    if (content.current) {
      const headingElements = Array.from(
        content.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
      ) as HTMLElement[];

      const headingsArray = headingElements.map((heading) => {
        const text = heading.innerText || heading.textContent || '';
        let id = heading.id;

        // If the heading doesn't have an ID, generate one using slugify
        if (!id) {
          id = slugify(text);
          heading.id = id; // Assign the generated ID to the heading
        }

        return {
          text,
          level: Number(heading.tagName.replace('H', '')),
          id,
        };
      });

      setHeadings(headingsArray);
    }
  }, [content]);

  return (
    <>
      {/* Mobile View - Table of Contents at the top */}
      <div className="block lg:hidden bg-[#242526] p-4 mb-6">
        <h5 className="text-sm font-bold mb-4">Table of Contents</h5>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`ml-${(heading.level - 1) * 4} hover:text-blue-500`}
            >
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop View - Table of Contents on the right */}
      <div className="hidden lg:block sticky top-0 max-w-xs p-4 bg-[#242526] shadow-lg">
        <h5 className="text-sm font-bold mb-4">Table of Contents</h5>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`ml-${(heading.level - 1) * 4} hover:text-blue-500`}
            >
              <a href={`#${heading.id}`}>{heading.text}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TOC;
