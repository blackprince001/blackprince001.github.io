'use client'

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"


interface Publication {
  id: number
  title: string
  authors: string[]
  journal: string
  year: number
  link: string
  pdf?: string
}

export const RecentPublications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPublications = async () => {
      try
      {
        const response = await fetch("/api/publications")
        if (!response.ok)
        {
          throw new Error(`Failed to fetch publications`)
        }
        const data = await response.json()
        setPublications(data.slice(0, 5))
      } catch (err)
      {
        setError("An error occurred.")
      } finally
      {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  if (loading) return null;
  if (error) return null;

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-baseline border-b border-border pb-2">
        <h2 className="text-2xl font-serif font-bold tracking-tight">Recent Publications</h2>
        <Link href="/publications" className="text-sm font-sans text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
          View all &rarr;
        </Link>
      </div>

      <div className="space-y-4">
        {publications.map((publication) => (
          <div key={publication.id} className="group">
            <Link href={publication.link} target="_blank" rel="noopener noreferrer" className="block">
              <h3 className="text-base font-serif font-medium text-primary group-hover:underline underline-offset-4 mb-1">
                {publication.title}
              </h3>
              <p className="text-sm text-muted-foreground font-serif">
                {publication.authors.join(", ")} &mdash; <span className="italic">{publication.journal}</span>, {publication.year}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export const PublicationShowcase: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try
      {
        const response = await fetch('/api/publications');
        if (!response.ok)
        {
          throw new Error(`Failed to fetch publications: ${response.statusText}`);
        }
        const data = await response.json();
        setPublications(data);
      } catch (err)
      {
        if (err instanceof Error)
        {
          setError(err.message);
        } else
        {
          setError('An unknown error occurred');
        }
      } finally
      {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) return <div className="py-12 text-center text-muted-foreground font-serif">Loading publications...</div>;
  if (error) return <div className="py-12 text-center text-red-500 font-serif">{error}</div>;

  return (
    <main className="max-w-6xl mx-auto px-5 lg:px-6 py-12">
      <h1 className="text-4xl font-serif font-bold mb-8 tracking-tight">Publications</h1>
      <div className="space-y-8">
        {publications.map((publication) => (
          <div key={publication.id} className="border-b border-border/40 last:border-0 pb-6 last:pb-0">
            <a
              href={publication.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-serif font-medium text-primary hover:underline underline-offset-4 block mb-2"
            >
              {publication.title}
            </a>
            <p className="text-muted-foreground font-serif leading-relaxed">
              {publication.authors.join(', ')}
            </p>
            <p className="text-sm text-muted-foreground/80 font-serif mt-1">
              <span className="italic">{publication.journal}</span>, {publication.year}
              {publication.pdf && (
                <span className="ml-2">
                  &bull; <a href={publication.pdf} target="_blank" className="hover:text-foreground underline">PDF</a>
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PublicationShowcase;