"use client"

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo, Children } from "react"
import { cn } from "@/lib/utils"

// Simple hash function to generate deterministic IDs from content
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++)
  {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Generate unique IDs for margin notes
let noteIdCounter = 0

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
  const context = useContext(MarginNotesContext)
  if (!context)
  {
    throw new Error("useMarginNotes must be used within MarginNotesProvider")
  }
  return context
}

export const MarginNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Map<string, MarginNote>>(new Map())

  const registerNote = useCallback((id: string, number: number | string, content: React.ReactNode, elementRef: React.RefObject<HTMLElement>) => {
    setNotes((prev) => {
      const newMap = new Map(prev)
      newMap.set(id, { id, number, content, elementRef })
      return newMap
    })
  }, [])

  const unregisterNote = useCallback((id: string) => {
    setNotes((prev) => {
      const newMap = new Map(prev)
      newMap.delete(id)
      return newMap
    })
  }, [])

  return (
    <MarginNotesContext.Provider value={{ registerNote, unregisterNote, notes }}>
      {children}
    </MarginNotesContext.Provider>
  )
}

interface MarginNoteMarkerProps {
  id?: string
  number?: number
  children: React.ReactNode
  className?: string
}

let globalNoteCounter = 0

export const resetMarginNoteCounter = () => {
  globalNoteCounter = 0
}

export const MarginNoteMarker: React.FC<MarginNoteMarkerProps> = ({ id, number, children, className }) => {
  const { registerNote, unregisterNote } = useMarginNotes()
  const markerRef = useRef<HTMLSpanElement>(null)
  const [noteNumber, setNoteNumber] = useState<number | string>(number ?? "*")

  // Generate deterministic ID based on content hash
  const stableId = useMemo(() => {
    if (id) return id
    // Create a stable hash from children content
    const contentStr = typeof children === 'string'
      ? children
      : Children.toArray(children).join('')
    const contentHash = hashString(contentStr)
    return `auto-${contentHash}`
  }, [id, children])

  const noteIdString = useMemo(() => `margin-note-${stableId}`, [stableId])
  const noteId = useRef(noteIdString)

  // Update ref if stableId changes (shouldn't happen, but for safety)
  useEffect(() => {
    noteId.current = noteIdString
  }, [noteIdString])

  useEffect(() => {
    if (!number)
    {
      globalNoteCounter++
      setNoteNumber(globalNoteCounter)
    }
  }, [number])

  useEffect(() => {
    if (markerRef.current)
    {
      registerNote(noteIdString, noteNumber, children, markerRef as React.RefObject<HTMLElement>)
    }
    return () => {
      unregisterNote(noteIdString)
    }
  }, [noteIdString, noteNumber, children, registerNote, unregisterNote])

  return (
    <>
      <span
        ref={markerRef}
        className={cn(
          "margin-note-marker inline-block relative",
          "font-sans text-xs",
          "cursor-pointer",
          "align-super mx-0.5",
          className
        )}
        data-note-id={noteIdString}
      >
        [{noteNumber}]
      </span>
      {/* Mobile version - inline */}
      <span className="xl:hidden inline-block ml-2 text-sm text-muted-foreground italic">
        ({children})
      </span>
    </>
  )
}

export const AutoNumberedMarginNote: React.FC<Omit<MarginNoteMarkerProps, "number">> = ({ id, children, className }) => {
  // Generate deterministic ID based on content if no ID provided
  const uniqueId = useMemo(() => {
    if (id) return id
    // Create a stable hash from children content
    const contentStr = typeof children === 'string'
      ? children
      : Children.toArray(children).join('')
    const contentHash = hashString(contentStr)
    return `auto-${contentHash}`
  }, [id, children])

  return (
    <MarginNoteMarker id={uniqueId} className={className}>
      {children}
    </MarginNoteMarker>
  )
}

interface MarginNotesContainerProps {
  className?: string
}

export const MarginNotesContainer: React.FC<MarginNotesContainerProps> = ({ className }) => {
  const { notes } = useMarginNotes()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (notes.size === 0 || typeof window === "undefined") return

    const updateActiveNotes = () => {
      const viewportTop = window.scrollY
      const viewportBottom = viewportTop + window.innerHeight
      const newActiveNotes = new Set<string>()

      notes.forEach((note) => {
        if (note.elementRef.current)
        {
          const rect = note.elementRef.current.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementBottom = elementTop + rect.height

          // Show note if its marker is in viewport
          if (elementBottom >= viewportTop && elementTop <= viewportBottom)
          {
            newActiveNotes.add(note.id)
          }
        }
      })

      setActiveNotes(newActiveNotes)
    }

    updateActiveNotes()
    window.addEventListener("scroll", updateActiveNotes, { passive: true })
    window.addEventListener("resize", updateActiveNotes, { passive: true })

    return () => {
      window.removeEventListener("scroll", updateActiveNotes)
      window.removeEventListener("resize", updateActiveNotes)
    }
  }, [notes])

  const notesArray = Array.from(notes.values())

  if (notesArray.length === 0) return null

  return (
    <aside
      ref={containerRef}
      className={cn(
        "hidden xl:block",
        "fixed right-0 top-0 h-screen",
        "w-[280px]",
        "pointer-events-none",
        "overflow-y-auto",
        "pt-24 pb-12",
        "px-6",
        className
      )}
      style={{
        marginRight: "max(0px, calc((100vw - min(1600px, 100%)) / 2))",
        scrollbarWidth: "thin"
      }}
    >
      <div className="space-y-8">
        {notesArray.map((note) => {
          const isActive = activeNotes.has(note.id)
          if (!isActive) return null

          return (
            <div
              key={note.id}
              className={cn(
                "margin-note-item",
                "text-[0.875rem] leading-relaxed",
                "font-serif",
                "transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-0"
              )}
              data-note-id={note.id}
            >
              <span
                className="margin-note-item-number font-sans text-xs font-semibold mr-2 inline-block"
              >
                [{note.number}]
              </span>
              <span
                className="transition-colors inline-block"
              >
                {note.content}
              </span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

