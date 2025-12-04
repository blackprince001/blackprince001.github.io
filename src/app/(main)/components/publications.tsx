'use client'

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import publicationsData from "@/data/publications.json"

// Dynamically import PDF viewer with SSR disabled since react-pdf requires browser APIs
const PDFViewer = dynamic(
  () => import("@/components/ui/pdf-viewer"),
  {
    ssr: false,
  }
)


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
    <section className="space-y-6">
      <div className="flex justify-between items-baseline border-b border-border pb-2">
        <h2>Recent Publications</h2>
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
  // Direct import for static export - no API needed
  const publications = publicationsData as Publication[]
  // Auto-select first publication with PDF
  const firstWithPDF = publications.find((pub: Publication) => pub.pdf) || null
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(firstWithPDF);


  const handlePublicationClick = (publication: Publication) => {
    if (publication.pdf) {
      setSelectedPublication(publication);
    }
  };

  return (
    <main className="max-w-7xl mx-auto w-full px-5 lg:px-6 py-12">
      <h1 className="mb-6 lg:mb-8">Publications</h1>
      
      {/* Mobile: Stack vertically, Desktop: Split screen */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 lg:h-[calc(100vh-250px)] min-h-[600px]">
        {/* Left Panel: Publications List */}
        <div className="flex flex-col lg:overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {publications.length === 0 ? (
              <p className="text-muted-foreground font-serif">No publications found.</p>
            ) : (
              publications.map((publication) => {
                const isSelected = selectedPublication?.id === publication.id;
                const hasPDF = !!publication.pdf;
                
                return (
                  <div
                    key={publication.id}
                    onClick={() => handlePublicationClick(publication)}
                    className={cn(
                      "p-4 rounded-sm border transition-all",
                      hasPDF && "cursor-pointer hover:border-primary/50 hover:bg-muted/30",
                      isSelected && hasPDF
                        ? "border-primary bg-muted/50"
                        : "border-border/40",
                      !hasPDF && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        className={cn(
                          "text-base lg:text-lg font-serif font-medium leading-tight",
                          isSelected && hasPDF
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        {publication.title}
                      </h3>
                      {!hasPDF && (
                        <span className="text-xs text-muted-foreground font-sans whitespace-nowrap">
                          No PDF
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground font-serif leading-relaxed mb-2">
                      {publication.authors.join(', ')}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground/80 font-serif">
                        <span className="italic">{publication.journal}</span>, {publication.year}
                      </p>
                      <a
                        href={publication.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-primary hover:underline underline-offset-4 flex items-center gap-1"
                      >
                        <span>Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: PDF Viewer */}
        <div className="flex-1 lg:overflow-hidden min-h-[500px] lg:min-h-0">
          <PDFViewer 
            file={selectedPublication?.pdf || null}
            className="h-full"
          />
        </div>
      </div>
    </main>
  );
};

export default PublicationShowcase;