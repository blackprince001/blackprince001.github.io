"use client"

import React, {
  createContext, useContext, useState, useRef,
  useEffect, useCallback, useMemo, Children
} from "react"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface MarginNote {
  id: string
  number: number | string
  content: React.ReactNode
  elementRef: React.RefObject<HTMLElement>
}

interface MarginNotesContextType {
  registerNote: (id: string, number: number | string, content: React.ReactNode, elementRef: React.RefObject<HTMLElement>) => void
  unregisterNote: (id: string) => void
  notes: Map<string, MarginNote>
}

const MarginNotesContext = createContext<MarginNotesContextType | null>(null)

export const useMarginNotes = () => {
  const ctx = useContext(MarginNotesContext)
  if (!ctx) throw new Error("useMarginNotes must be used within MarginNotesProvider")
  return ctx
}

export const MarginNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Map<string, MarginNote>>(new Map())

  const registerNote = useCallback((
    id: string, number: number | string,
    content: React.ReactNode, elementRef: React.RefObject<HTMLElement>
  ) => {
    setNotes(prev => { const m = new Map(prev); m.set(id, { id, number, content, elementRef }); return m })
  }, [])

  const unregisterNote = useCallback((id: string) => {
    setNotes(prev => { const m = new Map(prev); m.delete(id); return m })
  }, [])

  return (
    <MarginNotesContext.Provider value={{ registerNote, unregisterNote, notes }}>
      {children}
    </MarginNotesContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Marker — the inline superscript anchor in the text
// ---------------------------------------------------------------------------

interface MarginNoteMarkerProps {
  id?: string
  number?: number
  children: React.ReactNode
  className?: string
}

let globalNoteCounter = 0
export const resetMarginNoteCounter = () => { globalNoteCounter = 0 }

export const MarginNoteMarker: React.FC<MarginNoteMarkerProps> = ({ id, number, children, className }) => {
  const { registerNote, unregisterNote } = useMarginNotes()
  const markerRef = useRef<HTMLSpanElement>(null)
  const [noteNumber, setNoteNumber] = useState<number | string>(number ?? "*")

  const stableId = useMemo(() => {
    if (id) return id
    const s = typeof children === "string" ? children : Children.toArray(children).join("")
    return `auto-${hashString(s)}`
  }, [id, children])

  const noteIdString = useMemo(() => `margin-note-${stableId}`, [stableId])

  useEffect(() => {
    if (!number) { globalNoteCounter++; setNoteNumber(globalNoteCounter) }
  }, [number])

  useEffect(() => {
    if (markerRef.current)
      registerNote(noteIdString, noteNumber, children, markerRef as React.RefObject<HTMLElement>)
    return () => unregisterNote(noteIdString)
  }, [noteIdString, noteNumber, children, registerNote, unregisterNote])

  return (
    <>
      <span
        ref={markerRef}
        className={cn(
          "margin-note-marker inline-block relative font-sans text-xs align-super mx-0.5 cursor-default",
          className
        )}
        data-note-id={noteIdString}
      >
        [{noteNumber}]
      </span>
      {/* Mobile: inline parenthetical */}
      <span className="xl:hidden inline-block ml-1 text-sm text-muted-foreground italic">
        ({children})
      </span>
    </>
  )
}

export const AutoNumberedMarginNote: React.FC<Omit<MarginNoteMarkerProps, "number">> = ({ id, children, className }) => {
  const uniqueId = useMemo(() => {
    if (id) return id
    const s = typeof children === "string" ? children : Children.toArray(children).join("")
    return `auto-${hashString(s)}`
  }, [id, children])
  return <MarginNoteMarker id={uniqueId} className={className}>{children}</MarginNoteMarker>
}

// ---------------------------------------------------------------------------
// NoteCard — a single note rendering (purely presentational, no scroll logic)
// ---------------------------------------------------------------------------

const NoteCard: React.FC<{ note: MarginNote; side: "left" | "right" }> = ({ note, side }) => (
  <div
    className={cn("margin-note-item", side === "left" && "margin-note-item-left")}
    data-note-id={note.id}
  >
    <span className={cn("margin-note-item-number", side === "left" && "float-right ml-1.5")}>
      [{note.number}]
    </span>
    {note.content}
  </div>
)

// ---------------------------------------------------------------------------
// computeNotePositions
//
// Measures each marker's position relative to the given wrapper element and
// returns a Map<noteId, topPx>. Positions are document-relative (within the
// wrapper) so they match `position: absolute` placement inside it.
//
// Also runs a simple top-down cascade to prevent notes from overlapping if
// two markers happen to be very close together.
// ---------------------------------------------------------------------------

const EST_NOTE_HEIGHT = 64   // rough single-note card height in px
const NOTE_GAP        = 10   // minimum gap between stacked cards

function computeNotePositions(
  notes: MarginNote[],
  wrapperEl: HTMLElement
): Map<string, number> {
  const wrapperRect = wrapperEl.getBoundingClientRect()
  // scrollY correction: getBCR top is viewport-relative, we want wrapper-relative
  const wrapperTop  = wrapperRect.top + window.scrollY

  // Build [id, rawTop] pairs
  const raw: Array<[string, number]> = []
  for (const note of notes) {
    if (!note.elementRef.current) continue
    const markerRect = note.elementRef.current.getBoundingClientRect()
    const rawTop = markerRect.top + window.scrollY - wrapperTop
    raw.push([note.id, Math.max(0, rawTop)])
  }

  // Sort by position and cascade overlapping notes downward
  raw.sort((a, b) => a[1] - b[1])
  const resolved = new Map<string, number>()
  let cursor = 0
  for (const [id, desired] of raw) {
    const top = Math.max(desired, cursor)
    resolved.set(id, top)
    cursor = top + EST_NOTE_HEIGHT + NOTE_GAP
  }
  return resolved
}

// ---------------------------------------------------------------------------
// BilateralMarginNotesContainer
//
// Renders note columns as `position: absolute` siblings to the article body.
// `wrapperRef` must point to the `position: relative` container that wraps
// the article content — this is the coordinate space.
//
// Notes are computed ONCE on mount (+ on resize) and then stay put.
// No scroll listeners. No viewport filtering. Pure document-flow placement.
//
// Layout:
//   ≥ 2xl (1536px+): bilateral — odd notes left, even notes right
//   xl  (1280–1535px): right-only
//   < xl: hidden (mobile inline handles this)
// ---------------------------------------------------------------------------

interface BilateralMarginNotesContainerProps {
  /** The position:relative wrapper that contains the article body. */
  wrapperRef: React.RefObject<HTMLElement>
}

export const BilateralMarginNotesContainer: React.FC<BilateralMarginNotesContainerProps> = ({ wrapperRef }) => {
  const { notes } = useMarginNotes()
  const [positions, setPositions] = useState<Map<string, number>>(new Map())
  const [ready, setReady] = useState(false)

  const compute = useCallback(() => {
    if (!wrapperRef.current || typeof window === "undefined") return
    const pos = computeNotePositions(Array.from(notes.values()), wrapperRef.current)
    setPositions(pos)
    setReady(true)
  }, [notes, wrapperRef])

  // Compute once after all markers have registered and the DOM has settled
  useEffect(() => {
    const raf = requestAnimationFrame(() => { compute() })
    return () => cancelAnimationFrame(raf)
  }, [compute])

  // Recompute on resize (font size changes, window reflow, etc.)
  useEffect(() => {
    window.addEventListener("resize", compute, { passive: true })
    return () => window.removeEventListener("resize", compute)
  }, [compute])

  if (!ready) return null

  const notesArray = Array.from(notes.values())
  if (notesArray.length === 0) return null

  const leftNotes  = notesArray.filter((_, i) => i % 2 === 0)
  const rightNotes = notesArray.filter((_, i) => i % 2 === 1)

  // Panel inset from the wrapper edges.
  // Content is max-w-5xl (1024px) centered: half = 512px.
  // We nudge panels 20px outside the content edge.
  // At 2xl (1536px): available per side = (1536/2) - 512 = 256px → panel fits nicely.
  // At xl  (1280px): available per side = (1280/2) - 512 = 128px → narrower but usable.
  const panelStyle = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    ...(side === "right"
      ? { left: "calc(50% + 512px + 20px)" }
      : { right: "calc(50% + 512px + 20px)" }),
    width: "min(210px, calc(50% - 512px - 28px))",
    pointerEvents: "none",
  })

  const renderNotes = (panel: MarginNote[], side: "left" | "right") =>
    panel.map(note => {
      const top = positions.get(note.id)
      if (top === undefined) return null
      return (
        <div key={note.id} style={{ position: "absolute", top, width: "100%", pointerEvents: "auto" }}>
          <NoteCard note={note} side={side} />
        </div>
      )
    })

  return (
    <>
      {/* xl (1280–1535px): right-only */}
      <aside className="hidden xl:block 2xl:hidden" style={panelStyle("right")}>
        {renderNotes(notesArray, "right")}
      </aside>

      {/* 2xl (≥1536px): bilateral */}
      <aside className="hidden 2xl:block" style={panelStyle("left")}>
        {renderNotes(leftNotes, "left")}
      </aside>
      <aside className="hidden 2xl:block" style={panelStyle("right")}>
        {renderNotes(rightNotes, "right")}
      </aside>
    </>
  )
}

// ---------------------------------------------------------------------------
// Legacy export for backward compatibility
// ---------------------------------------------------------------------------
export const MarginNotesContainer = BilateralMarginNotesContainer as React.FC<{ className?: string }>
