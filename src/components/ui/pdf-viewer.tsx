'use client'

import { useState, useEffect, useRef } from 'react'
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

interface PDFViewerProps {
  file: string | null
  className?: string
}

function PDFViewer({ file, className }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pdfLib, setPdfLib] = useState<any>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load PDF.js from CDN
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if PDF.js is already loaded
    // @ts-ignore
    if (window.pdfjsLib) {
      // @ts-ignore
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      // @ts-ignore
      setPdfLib(window.pdfjsLib)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.async = true

    script.onload = () => {
      // @ts-ignore - pdfjsLib is loaded from CDN
      if (window.pdfjsLib) {
        // Configure worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        // @ts-ignore
        setPdfLib(window.pdfjsLib)
      }
    }

    script.onerror = () => {
      setError('Failed to load PDF.js library')
    }

    document.head.appendChild(script)

    return () => {
      // Don't remove script tag as it might be used elsewhere
    }
  }, [])

  // Load PDF document
  useEffect(() => {
    if (!file || !pdfLib) return

    const loadPdf = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get the correct PDF URL
        const basePath = '/blackprince001.github.io'
        const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        const pdfUrl = isDev && file.startsWith('/') 
          ? `${basePath}${file}` 
          : file.startsWith('http') 
            ? file 
            : file

        const loadingTask = pdfLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise
        
        setPdfDoc(pdf)
        setNumPages(pdf.numPages)
        setPageNumber(1)
        setLoading(false)
      } catch (err: any) {
        console.error('Error loading PDF:', err)
        setError(`Failed to load PDF: ${err.message || 'Unknown error'}`)
        setLoading(false)
      }
    }

    loadPdf()
  }, [file, pdfLib])

  // Render PDF page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !pdfLib) return

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber)
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')
        const viewport = page.getViewport({ scale })

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }

        await page.render(renderContext).promise
      } catch (err: any) {
        console.error('Error rendering page:', err)
        setError(`Failed to render page: ${err.message}`)
      }
    }

    renderPage()
  }, [pdfDoc, pageNumber, scale, pdfLib])

  // Reset state when file changes
  useEffect(() => {
    if (file) {
      setPageNumber(1)
      setScale(1.0)
      setError(null)
      setNumPages(null)
      setPdfDoc(null)
    }
  }, [file])

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
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
    
    // Get the correct PDF URL
    const basePath = '/blackprince001.github.io'
    const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    const pdfUrl = isDev && file.startsWith('/') 
      ? `${basePath}${file}` 
      : file.startsWith('http') 
        ? file 
        : file

    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = file.split('/').pop() || 'publication.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  if (!pdfLib) {
    return (
      <div className={cn(
        "flex items-center justify-center h-full min-h-[400px] border border-border bg-muted/30 rounded-sm",
        className
      )}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground font-serif">Loading PDF viewer...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
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
      <div className="flex-1 overflow-auto bg-muted/20 p-4 flex justify-center items-start">
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

        {!error && !loading && (
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              className="shadow-lg border border-border"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFViewer
