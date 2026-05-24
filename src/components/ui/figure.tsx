"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Lightbox, useLightboxNav, type LightboxItem } from "@/components/ui/lightbox"

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

  const isSingle = items.length === 1
  const altFor = (i: number) =>
    alt ? (isSingle ? alt : `${alt} (${i + 1})`) : `Figure media ${i + 1}`

  const lightboxItems: LightboxItem[] = React.useMemo(
    () => items.filter((s) => !isVideo(s)).map((s, i) => ({ src: s, alt: altFor(i) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.join("|"), alt]
  )
  const lb = useLightboxNav(lightboxItems)
  const lightboxIndexFor = (src: string) => {
    if (isVideo(src)) return -1
    return lightboxItems.findIndex((it) => it.src === src)
  }

  if (items.length === 0) return null

  const resolvedCols: 1 | 2 | 3 | 4 = isSingle
    ? 1
    : cols ?? (items.length === 2 ? 2 : items.length === 3 ? 3 : 4)

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
              {items.map((s, i) => {
                const lbIdx = lightboxIndexFor(s)
                return (
                  <MediaItem
                    key={i}
                    src={s}
                    alt={altFor(i)}
                    onOpen={lbIdx >= 0 ? () => lb.open(lbIdx) : () => {}}
                  />
                )
              })}
            </div>
          </div>
        </div>
        {caption && (
          <figcaption className="mt-3 px-2 text-sm italic text-zinc-500 dark:text-zinc-400 sm:text-[0.95rem]">
            {caption}
          </figcaption>
        )}
      </figure>

      <Lightbox
        items={lightboxItems}
        index={lb.index}
        onClose={lb.close}
        onPrev={lb.prev}
        onNext={lb.next}
      />
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

export default Figure
