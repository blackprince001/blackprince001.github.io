'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download,
  Maximize,
  Minimize,
  Loader2
} from 'lucide-react'
// CSS imports removed - styles will be added to globals.css to avoid Next.js static export issues

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

interface PDFViewerProps {
  file: string | null
  className?: string
}

function PDFViewer({ file, className }: PDFViewerProps) {
  const [mounted, setMounted] = useState(false)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset state when file changes
  useEffect(() => {
    if (file) {
      setPageNumber(1)
      setScale(1.0)
      setError(null)
      setNumPages(null)
    }
  }, [file])

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef) return

    if (!isFullscreen) {
      if (containerRef.requestFullscreen) {
        containerRef.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error)
    setError('Failed to load PDF. Please try again.')
    setLoading(false)
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1))
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(3.0, prev + 0.25))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.25))
  }

  const resetZoom = () => {
    setScale(1.0)
  }

  const handleDownload = () => {
    if (!file) return
    const link = document.createElement('a')
    link.href = file
    link.download = file.split('/').pop() || 'publication.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full min-h-[400px] border border-border bg-muted/30 rounded-sm",
        className
      )}>
        <p className="text-muted-foreground font-serif">Loading PDF viewer...</p>
      </div>
    )
  }

  if (!file) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full min-h-[400px] border border-border bg-muted/30 rounded-sm",
        className
      )}>
        <p className="text-muted-foreground font-serif">Select a publication to view PDF</p>
      </div>
    )
  }

  return (
    <div
      ref={setContainerRef}
      className={cn(
        "flex flex-col h-full border border-border bg-background rounded-sm",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
    >
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || loading}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-sans text-muted-foreground min-w-[80px] text-center">
            {loading ? '...' : `${pageNumber} / ${numPages || '?'}`}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={!numPages || pageNumber >= numPages || loading}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            disabled={scale <= 0.5 || loading}
            className="h-8 w-8"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-sans text-muted-foreground min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            disabled={scale >= 3.0 || loading}
            className="h-8 w-8"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={resetZoom}
            disabled={scale === 1.0 || loading}
            className="h-8 w-8"
            title="Reset Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullscreen}
            disabled={loading}
            className="h-8 w-8"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            disabled={loading}
            className="h-8 w-8"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-muted/20 p-4 flex justify-center">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-destructive font-serif">{error}</p>
          </div>
        )}

        {!error && (
          <div className="flex flex-col items-center">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              }
              onLoadStart={() => setLoading(true)}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg border border-border"
              />
            </Document>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFViewer

