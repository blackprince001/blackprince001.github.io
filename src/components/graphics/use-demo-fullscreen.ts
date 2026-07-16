"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useDemoFullscreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false)

  useEffect(() => {
    const syncFullscreenState = () => {
      setNativeFullscreen(document.fullscreenElement === containerRef.current)
    }

    document.addEventListener("fullscreenchange", syncFullscreenState)
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState)
  }, [])

  useEffect(() => {
    if (!fallbackFullscreen) return
    const previousOverflow = document.body.style.overflow
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFallbackFullscreen(false)
    }
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", exitOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", exitOnEscape)
    }
  }, [fallbackFullscreen])

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current
    if (!container) return

    try {
      if (fallbackFullscreen) {
        setFallbackFullscreen(false)
      } else if (document.fullscreenElement === container) {
        await document.exitFullscreen()
      } else if (document.fullscreenEnabled && typeof container.requestFullscreen === "function") {
        await container.requestFullscreen()
      } else {
        setFallbackFullscreen(true)
      }
    } catch {
      setNativeFullscreen(false)
      setFallbackFullscreen(true)
    }
  }, [fallbackFullscreen])

  return {
    containerRef,
    isFullscreen: nativeFullscreen || fallbackFullscreen,
    isFallbackFullscreen: fallbackFullscreen,
    toggleFullscreen,
  }
}
