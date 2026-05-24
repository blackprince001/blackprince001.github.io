"use client";

import { useState } from "react";
import readingData from "@/data/reading.json";

function withFallback(url: string) {
  if (url.includes("covers.openlibrary.org") && !url.includes("default=")) {
    return url + (url.includes("?") ? "&" : "?") + "default=false";
  }
  return url;
}

function CoverFallback({ title, author }: { title: string; author: string }) {
  const initials = author
    .split(/[, ]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-full aspect-[2/3] rounded-sm border border-border/40 shadow-sm bg-gradient-to-br from-muted to-muted/40 flex flex-col items-center justify-center p-3 text-center">
      <span className="text-[10px] font-mono text-muted-foreground/70 mb-2">
        {initials}
      </span>
      <span className="text-xs font-serif text-muted-foreground line-clamp-4 leading-snug">
        {title}
      </span>
    </div>
  );
}

function BookCover({
  src,
  title,
  author,
}: {
  src: string;
  title: string;
  author: string;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) return <CoverFallback title={title} author={author} />;
  return (
    <img
      src={withFallback(src)}
      alt={`Cover of ${title}`}
      loading="lazy"
      onError={() => setErrored(true)}
      className="w-full h-auto rounded-sm border border-border/40 shadow-sm bg-muted"
    />
  );
}

type Status = "reading" | "finished" | "want-to-read";

interface Book {
  title: string;
  author: string;
  category: string;
  cover: string;
  status: Status;
  notes?: string;
}

interface Category {
  id: string;
  label: string;
  description: string;
}

const statusMeta: Record<Status, { label: string; className: string }> = {
  reading: {
    label: "Reading",
    className: "text-emerald-600 dark:text-emerald-400 border-emerald-600/40 dark:border-emerald-400/40",
  },
  finished: {
    label: "Finished",
    className: "text-blue-600 dark:text-blue-400 border-blue-600/40 dark:border-blue-400/40",
  },
  "want-to-read": {
    label: "Want to read",
    className: "text-amber-600 dark:text-amber-400 border-amber-600/40 dark:border-amber-400/40",
  },
};

function StatusBadge({ status }: { status: Status }) {
  const meta = statusMeta[status] ?? {
    label: status,
    className: "text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-sans font-medium uppercase tracking-wide ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function openLibrarySearchUrl(book: Book) {
  const q = encodeURIComponent(`${book.title} ${book.author}`);
  return `https://openlibrary.org/search?q=${q}`;
}

function BookCard({ book }: { book: Book }) {
  return (
    <a
      href={openLibrarySearchUrl(book)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-6 py-3 px-3 -mx-3 rounded-md transition-all duration-200 hover:bg-muted/50 hover:shadow-sm"
    >
      <div className="shrink-0 w-40 sm:w-56 transition-transform duration-200 group-hover:-translate-y-0.5">
        <BookCover src={book.cover} title={book.title} author={book.author} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1.5">
          <StatusBadge status={book.status} />
        </div>
        <h3 className="text-base font-serif font-medium text-primary leading-snug mb-0.5 group-hover:underline underline-offset-4">
          {book.title}
        </h3>
        <p className="text-sm font-serif text-muted-foreground italic mb-1">
          {book.author}
        </p>
        {book.notes && (
          <p className="text-sm font-serif text-muted-foreground leading-relaxed">
            {book.notes}
          </p>
        )}
      </div>
    </a>
  );
}

export default function ReadingList() {
  const { categories, books } = readingData as {
    categories: Category[];
    books: Book[];
  };

  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all" ? books : books.filter((b) => b.category === active);

  const filters = [{ id: "all", label: "All" }, ...categories];

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8 border-b border-border">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`pb-2 px-1 text-sm font-sans transition-colors ${
              active === f.id
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground font-serif">
          Nothing here yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((book) => (
            <BookCard key={`${book.title}-${book.author}`} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
