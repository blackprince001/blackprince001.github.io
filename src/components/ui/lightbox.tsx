"use client"

import * as React from "react"

export interface LightboxItem {
  /** Source URL — image (.png/.jpg/.gif/...) or video (.mp4/.webm/...). */
  src: string
  alt?: string
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i
const isVideo = (s: string) => VIDEO_EXT.test(s)

/**
 * useLightboxNav — manage the open/close + prev/next state for a lightbox
 * driven by a list of items. Wire the returned `open(i)` to your thumbnails
 * and render `<Lightbox {...props} />` somewhere stable in the tree.
 */
export function useLightboxNav(items: LightboxItem[]) {
  const [index, setIndex] = React.useState<number | null>(null)
  const total = items.length
  const open = React.useCallback((i: number) => setIndex(i), [])
  const close = React.useCallback(() => setIndex(null), [])
  const next = React.useCallback(
    () => setIndex((i) => (i === null || i >= total - 1 ? i : i + 1)),
    [total]
  )
  const prev = React.useCallback(
    () => setIndex((i) => (i === null || i <= 0 ? i : i - 1)),
    []
  )
  return { index, open, close, next, prev }
}

interface LightboxProps {
  items: LightboxItem[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({ items, index, onClose, onPrev, onNext }: LightboxProps) {
  React.useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrev()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [index, onClose, onPrev, onNext])

  if (index === null) return null
  const item = items[index]
  if (!item) return null
  const total = items.length
  const alt = item.alt ?? `Item ${index + 1}`
  const hasPrev = index > 0
  const hasNext = index < total - 1

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

      {hasPrev && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/90 transition hover:bg-white/20"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}
      {hasNext && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/90 transition hover:bg-white/20"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      )}

      {isVideo(item.src) ? (
        <video
          src={item.src}
          controls
          autoPlay
          loop
          playsInline
          onClick={(e) => e.stopPropagation()}
          className="max-h-[92vh] max-w-[94vw] rounded-md shadow-2xl"
        />
      ) : (
        <img
          src={item.src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[92vh] max-w-[94vw] object-contain rounded-md shadow-2xl"
        />
      )}
    </div>
  )
}

export default Lightbox
