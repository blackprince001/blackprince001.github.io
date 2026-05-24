'use client'

import type React from "react"
import Link from "next/link"
import { FileText, ChevronDown } from "lucide-react"
import { useState } from "react"
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
  abstract?: string
  domain?: string
}

export const RecentPublications: React.FC = () => {
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

function PaperSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-border/70 bg-background/95 shadow-sm",
        className
      )}
    >
      <div className="absolute inset-0 p-2 space-y-1.5">
        <div className="h-1.5 w-3/4 rounded-sm bg-foreground/30" />
        <div className="h-1 w-2/3 rounded-sm bg-foreground/15" />
        <div className="pt-1.5 space-y-1">
          <div className="h-0.5 w-full rounded-sm bg-foreground/20" />
          <div className="h-0.5 w-[95%] rounded-sm bg-foreground/20" />
          <div className="h-0.5 w-[88%] rounded-sm bg-foreground/20" />
          <div className="h-0.5 w-[92%] rounded-sm bg-foreground/20" />
          <div className="h-0.5 w-3/4 rounded-sm bg-foreground/20" />
        </div>
        <div className="pt-1 space-y-1">
          <div className="h-0.5 w-full rounded-sm bg-foreground/20" />
          <div className="h-0.5 w-[90%] rounded-sm bg-foreground/20" />
          <div className="h-0.5 w-4/5 rounded-sm bg-foreground/20" />
        </div>
        <div className="pt-1.5">
          <div className="h-3 w-2/3 rounded-sm bg-foreground/10" />
        </div>
        <div className="pt-1 space-y-1">
          <div className="h-0.5 w-[85%] rounded-sm bg-foreground/20" />
          <div className="h-0.5 w-3/4 rounded-sm bg-foreground/20" />
        </div>
      </div>
    </div>
  )
}

function PublicationCard({ publication }: { publication: Publication }) {
  const dest = publication.pdf || publication.link
  const [expanded, setExpanded] = useState(false)

  return (
    <Link
      href={dest}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      className={cn(
        "group relative block overflow-hidden rounded-xl border border-border/60 bg-card px-4 py-3 transition-all duration-300",
        "hover:border-primary/40 hover:bg-muted/30 hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-6">
        <div className="relative shrink-0 self-center h-16 w-12 sm:h-20 sm:w-16">
          <div
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-out",
              "opacity-70 group-hover:opacity-100",
              "group-hover:-translate-y-0.5 group-hover:-rotate-3"
            )}
          >
            <PaperSkeleton className="h-full w-full" />
          </div>
        </div>

        <div className="min-w-0 flex-1 pl-1 pr-2">
          <h3 className="font-serif text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
            {publication.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {publication.domain && (
              <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {publication.domain}
              </span>
            )}
            <span className="font-sans text-xs text-muted-foreground sm:text-sm">
              {publication.year}
            </span>
          </div>
          {publication.abstract && (
            <>
              <p
                className={cn(
                  "mt-2 font-serif text-sm leading-relaxed text-muted-foreground/90",
                  !expanded && "line-clamp-3"
                )}
              >
                {publication.abstract}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setExpanded((v) => !v)
                }}
                className="mt-1.5 inline-flex items-center gap-1 font-sans text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                aria-expanded={expanded}
              >
                {expanded ? "Show less" : "Read more"}
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    expanded && "rotate-180"
                  )}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export const PublicationShowcase: React.FC = () => {
  const publications = publicationsData as Publication[]

  return (
    <main className="max-w-4xl mx-auto w-full px-5 lg:px-6 py-16">
      <div className="mb-10 border-b border-border pb-6">
        <h1 className="mb-3">Manuscripts</h1>
        <p className="text-muted-foreground font-serif text-lg">A collection of research, drafts, and published works.</p>
      </div>

      <div className="space-y-3">
        {publications.length === 0 ? (
          <p className="text-muted-foreground font-serif">No manuscripts found.</p>
        ) : (
          publications.map((publication) => (
            <PublicationCard key={`${publication.id}-${publication.title}`} publication={publication} />
          ))
        )}
      </div>
    </main>
  )
}

export default PublicationShowcase
