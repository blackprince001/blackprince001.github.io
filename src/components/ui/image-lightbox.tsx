"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface ImageLightboxProps {
  children: React.ReactNode
}

export default function ImageLightbox({ children }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>("")
  const [imageAlt, setImageAlt] = useState<string>("")
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "IMG")
      {
        const img = target as HTMLImageElement
        setImageSrc(img.src)
        setImageAlt(img.alt || "")
        setIsOpen(true)
      }
    }

    const content = contentRef.current
    if (content)
    {
      // Add cursor pointer to all images
      const images = content.querySelectorAll("img")
      images.forEach((img) => {
        img.style.cursor = "pointer"
      })

      content.addEventListener("click", handleImageClick)
      return () => {
        content.removeEventListener("click", handleImageClick)
      }
    }
  }, [children])

  return (
    <>
      <div ref={contentRef}>{children}</div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl w-[95vw] p-0 overflow-hidden bg-background/95 backdrop-blur">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            {imageSrc && (
              <img
                src={imageSrc}
                alt={imageAlt}
                className="max-w-full max-h-[90vh] object-contain rounded-sm"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
