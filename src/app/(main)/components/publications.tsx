'use client'

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from '@/components/ui/skeleton';
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
      try {
        const response = await fetch("/api/publications")
        if (!response.ok) {
          throw new Error(`Failed to fetch publications`)
        }
        const data = await response.json()
        setPublications(data.slice(0, 5))
      } catch (err) {
        setError("An error occurred while fetching publications.")
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Publications</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/3 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Publications</h2>
        </div>
        <Card className="bg-destructive/10">
          <CardHeader>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Publications</h2>
        <Button asChild variant="ghost">
          <Link href="/publications" className="group">
            View all publications
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {publications.map((publication) => (
          <Link key={publication.id} href={publication.link} target="_blank" rel="noopener noreferrer">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg">{publication.title}</CardTitle>
                  <CardDescription className="text-right shrink-0">{publication.year}</CardDescription>
                </div>
                <CardDescription>{publication.authors.join(", ")}</CardDescription>
                <CardDescription className="text-primary">{publication.journal}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
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
      try {
        const response = await fetch('/api/publications');
        if (!response.ok) {
          throw new Error(`Failed to fetch publications: ${response.statusText}`);
        }
        const data = await response.json();
        setPublications(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-8">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="border rounded-lg shadow-sm">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2 bg-gray-500" />
                <Skeleton className="h-4 w-1/2 bg-gray-500" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2 bg-gray-500" />
                <Skeleton className="h-4 w-3/4 bg-gray-500" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-500">Publications</h1>
      <div className="space-y-8">
        {publications.map((publication) => (
          <Card key={publication.id} className="h-full border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                <a
                  href={publication.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 transition-colors"
                >
                  {publication.title}
                </a>
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                {publication.authors.join(', ')} - {publication.journal}, {publication.year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {publication.pdf && (
                <a
                  href={publication.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-500 hover:text-gray-400 transition-colors"
                >
                  <span>Read</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default PublicationShowcase;