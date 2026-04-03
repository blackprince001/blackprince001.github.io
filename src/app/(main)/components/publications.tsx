'use client'

import type React from "react"
import Link from "next/link"
import { ExternalLink, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import publicationsData from "@/data/publications.json"

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
  // Direct import for static export - no API needed
  const publications = (publicationsData as Publication[]).slice(0, 5)

  return (
    <section className="space-y-2">
      <div className="flex justify-between items-baseline pb-2">
        <h2>Recent Manuscripts</h2>
        <Link href="/publications" className="text-sm font-sans text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
          View all &rarr;
        </Link>
      </div>

      <div className="space-y-4">
        {publications.map((publication) => (
          <div key={publication.id} className="group">
            <Link href={publication.pdf || publication.link} target="_blank" rel="noopener noreferrer" className="block">
              <h3 className="text-base font-serif font-medium text-primary group-hover:underline underline-offset-4 mb-1 flex items-center gap-2">
                {publication.title}
                {publication.pdf && <FileText className="h-3 w-3 text-muted-foreground" />}
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
  const publications = publicationsData as Publication[]

  return (
    <main className="max-w-4xl mx-auto w-full px-5 lg:px-6 py-16">
      <div className="mb-12 border-b border-border pb-6">
        <h1 className="mb-4">Manuscripts</h1>
        <p className="text-muted-foreground font-serif text-lg">A collection of research, drafts, and published works.</p>
      </div>

      <div className="space-y-8">
        {publications.length === 0 ? (
          <p className="text-muted-foreground font-serif">No manuscripts found.</p>
        ) : (
          publications.map((publication) => {
            const dest = publication.pdf || publication.link;
            return (
              <Link
                href={dest}
                key={publication.id}
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
                className="group block p-6 rounded-lg border border-border/50 bg-card hover:border-primary/30 hover:bg-muted/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-2">
                  <h3 className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                    {publication.title}
                  </h3>
                  {publication.pdf ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-primary/10 text-primary">
                      <FileText className="w-3 h-3" /> PDF
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-secondary text-secondary-foreground">
                      <ExternalLink className="w-3 h-3" /> WEB
                    </span>
                  )}
                </div>

                <p className="text-base text-muted-foreground font-sans leading-relaxed mb-4">
                  {publication.authors.join(', ')}
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground/80 font-serif">
                  <span className="italic font-medium">{publication.journal}</span>
                  <span>&bull;</span>
                  <span>{publication.year}</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
};

export default PublicationShowcase;