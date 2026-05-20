"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FigureProps {
  title?: React.ReactNode
  src?: string
  srcs?: string[]
  alt?: string
  caption?: React.ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string
}

const colClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i
const isVideo = (s: string) => VIDEO_EXT.test(s)

export function Figure({ title, src, srcs, alt, caption, cols, className }: FigureProps) {
  const items = srcs && srcs.length > 0 ? srcs : src ? [src] : []
  const [lightbox, setLightbox] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null)
      if (e.key === "ArrowRight" && lightbox < items.length - 1) setLightbox(lightbox + 1)
      if (e.key === "ArrowLeft" && lightbox > 0) setLightbox(lightbox - 1)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightbox, items.length])

  if (items.length === 0) return null

  const isSingle = items.length === 1
  const resolvedCols: 1 | 2 | 3 | 4 = isSingle
    ? 1
    : cols ?? (items.length === 2 ? 2 : items.length === 3 ? 3 : 4)

  const altFor = (i: number) =>
    alt ? (isSingle ? alt : `${alt} (${i + 1})`) : `Figure media ${i + 1}`

  return (
    <>
      <figure className={cn("my-10 not-prose", className)}>
        <div className="rounded-2xl border border-zinc-200/60 bg-zinc-100/70 px-3 pt-3 pb-3 dark:border-zinc-800/60 dark:bg-zinc-900/40 sm:px-4 sm:pt-3.5 sm:pb-3">
          {title && (
            <div className="mb-3 text-center text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg">
              {title}
            </div>
          )}
          <div className="rounded-xl bg-white/70 p-2 dark:bg-zinc-950/40 sm:p-2.5">
            <div className={cn("grid gap-2 sm:gap-3", colClass[resolvedCols])}>
              {items.map((s, i) => (
                <MediaItem
                  key={i}
                  src={s}
                  alt={altFor(i)}
                  onOpen={() => !isVideo(s) && setLightbox(i)}
                />
              ))}
            </div>
          </div>
        </div>
        {caption && (
          <figcaption className="mt-3 px-2 text-sm italic text-zinc-500 dark:text-zinc-400 sm:text-[0.95rem]">
            {caption}
          </figcaption>
        )}
      </figure>

      {lightbox !== null && (
        <Lightbox
          src={items[lightbox]}
          alt={altFor(lightbox)}
          index={lightbox}
          total={items.length}
          onClose={() => setLightbox(null)}
          onPrev={lightbox > 0 ? () => setLightbox(lightbox - 1) : undefined}
          onNext={lightbox < items.length - 1 ? () => setLightbox(lightbox + 1) : undefined}
        />
      )}
    </>
  )
}

function MediaItem({ src, alt, onOpen }: { src: string; alt: string; onOpen: () => void }) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        controls
        loop
        muted
        playsInline
        className="w-full h-auto rounded-md"
      />
    )
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
      aria-label={`Open ${alt} fullscreen`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain rounded-md transition-transform duration-300 group-hover:scale-[1.01]"
      />
      <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-black/55 px-1.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Expand
      </span>
    </button>
  )
}

function Lightbox({
  src,
  alt,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  src: string
  alt: string
  index: number
  total: number
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/90 transition hover:bg-white/20"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
          {index + 1} / {total}
        </div>
      )}

      {onPrev && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/90 transition hover:bg-white/20"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/90 transition hover:bg-white/20"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      )}

      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] max-w-[94vw] object-contain rounded-md shadow-2xl"
      />
    </div>
  )
}

export default Figure
