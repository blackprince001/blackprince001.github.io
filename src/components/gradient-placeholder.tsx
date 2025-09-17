"use client"

import { useEffect, useRef, useState } from "react"

interface GradientPlaceholderProps {
  seed: string
  className?: string
}

export function GradientPlaceholder({ seed, className = "" }: GradientPlaceholderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isDark, setIsDark] = useState<boolean>(false)

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [255 * f(0), 255 * f(8), 255 * f(4)]
  }

  // Detect theme (next-themes adds `dark` class on <html>)
  useEffect(() => {
    const updateTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains("dark")
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDark(hasDarkClass || prefersDark)
    }
    updateTheme()
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    mq.addEventListener?.("change", updateTheme)
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => {
      mq.removeEventListener?.("change", updateTheme)
      observer.disconnect()
    }
  }, [])

  // Generate consistent colors based on the seed string and theme
  const getColors = (seed: string) => {
    // Simple hash function to generate a number from a string
    const hashString = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++)
      {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash = hash & hash
      }
      return Math.abs(hash)
    }

    const hash = hashString(seed)

    // Generate vibrant yet tasteful palettes. Slightly more saturated for dark mode.
    const hue1 = hash % 360
    const hue2 = (hue1 + 120 + (hash % 60)) % 360  // Complementary with variation
    const hue3 = (hue1 + 240 + (hash % 60)) % 360  // Triadic with variation

    const lightPalettes = [
      [hslToRgb(hue1, 60, 72), hslToRgb(hue2, 62, 70), hslToRgb(hue3, 58, 75)],
      [hslToRgb(hue1, 58, 74), hslToRgb(hue2, 64, 68), hslToRgb(hue3, 56, 76)],
      [hslToRgb(hue1, 55, 73), hslToRgb(hue2, 60, 69), hslToRgb(hue3, 54, 77)],
    ]

    const darkPalettes = [
      [hslToRgb(hue1, 72, 55), hslToRgb(hue2, 70, 52), hslToRgb(hue3, 68, 58)],
      [hslToRgb(hue1, 75, 53), hslToRgb(hue2, 72, 50), hslToRgb(hue3, 70, 56)],
      [hslToRgb(hue1, 70, 54), hslToRgb(hue2, 68, 51), hslToRgb(hue3, 66, 57)],
    ]

    const paletteIndex = hash % (isDark ? darkPalettes.length : lightPalettes.length)
    return (isDark ? darkPalettes : lightPalettes)[paletteIndex]
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const colors = getColors(seed)
    const width = canvas.width
    const height = canvas.height

    // Create gradient
    const drawGradient = () => {
      ctx.clearRect(0, 0, width, height)

      // Create a more sophisticated gradient with multiple overlapping shapes
      const shapes = [
        {
          x: width * 0.25,
          y: height * 0.25,
          r: width * 0.6,
          color: colors[0],
          opacity: 0.7
        },
        {
          x: width * 0.75,
          y: height * 0.65,
          r: width * 0.5,
          color: colors[1],
          opacity: 0.6
        },
        {
          x: width * 0.5,
          y: height * 0.5,
          r: width * 0.7,
          color: colors[2],
          opacity: 0.5
        },
      ]

      // Transparent background to blend with parent card; subtle tint by theme
      if (isDark)
      {
        ctx.fillStyle = "rgba(255,255,255,0.02)"
      } else
      {
        ctx.fillStyle = "rgba(0,0,0,0.02)"
      }
      ctx.fillRect(0, 0, width, height)

      // Draw gradient shapes with better blending
      ctx.globalCompositeOperation = isDark ? "screen" : "multiply"

      shapes.forEach((shape, i) => {
        const gradient = ctx.createRadialGradient(shape.x, shape.y, 0, shape.x, shape.y, shape.r)

        const [r, g, b] = shape.color
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${shape.opacity})`)
        gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.35)`)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Add a subtle overlay for depth
      ctx.globalCompositeOperation = "soft-light"
      const overlayGradient = ctx.createLinearGradient(0, 0, width, height)
      if (isDark)
      {
        overlayGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)")
        overlayGradient.addColorStop(1, "rgba(0, 0, 0, 0.12)")
      } else
      {
        overlayGradient.addColorStop(0, "rgba(255, 255, 255, 0.06)")
        overlayGradient.addColorStop(1, "rgba(0, 0, 0, 0.08)")
      }

      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = "source-over"
    }

    // Initial draw
    drawGradient()

    // Add subtle animation on hover
    let animationFrame: number
    let angle = 0

    const animate = () => {
      if (!isHovering)
      {
        cancelAnimationFrame(animationFrame)
        return
      }

      angle += 0.008 // Slower animation
      const shapes = [
        {
          x: width * (0.25 + Math.sin(angle) * 0.03),
          y: height * (0.25 + Math.cos(angle) * 0.03),
          r: width * 0.6,
          color: colors[0],
          opacity: 0.7
        },
        {
          x: width * (0.75 + Math.cos(angle * 1.2) * 0.03),
          y: height * (0.65 + Math.sin(angle * 1.2) * 0.03),
          r: width * 0.5,
          color: colors[1],
          opacity: 0.6
        },
        {
          x: width * (0.5 + Math.sin(angle * 0.8) * 0.03),
          y: height * (0.5 + Math.cos(angle * 0.8) * 0.03),
          r: width * 0.7,
          color: colors[2],
          opacity: 0.5
        },
      ]

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "#fafafa"
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = "multiply"

      shapes.forEach((shape) => {
        const gradient = ctx.createRadialGradient(shape.x, shape.y, 0, shape.x, shape.y, shape.r)

        const [r, g, b] = shape.color
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${shape.opacity})`)
        gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.3)`)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Add overlay
      ctx.globalCompositeOperation = "soft-light"
      const overlayGradient = ctx.createLinearGradient(0, 0, width, height)
      overlayGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)")
      overlayGradient.addColorStop(1, "rgba(0, 0, 0, 0.05)")

      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = "source-over"

      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [seed, isHovering, isDark])

  // Handle resize to make canvas responsive
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const { width, height } = parent.getBoundingClientRect()
      canvas.width = width
      canvas.height = height

      // Redraw after resize
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const colors = getColors(seed)

      ctx.clearRect(0, 0, width, height)
      if (isDark)
      {
        ctx.fillStyle = "rgba(255,255,255,0.02)"
      } else
      {
        ctx.fillStyle = "rgba(0,0,0,0.02)"
      }
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = isDark ? "screen" : "multiply"

      const shapes = [
        { x: width * 0.25, y: height * 0.25, r: width * 0.6, color: colors[0], opacity: 0.7 },
        { x: width * 0.75, y: height * 0.65, r: width * 0.5, color: colors[1], opacity: 0.6 },
        { x: width * 0.5, y: height * 0.5, r: width * 0.7, color: colors[2], opacity: 0.5 },
      ]

      shapes.forEach((shape) => {
        const gradient = ctx.createRadialGradient(shape.x, shape.y, 0, shape.x, shape.y, shape.r)

        const [r, g, b] = shape.color
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${shape.opacity})`)
        gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.35)`)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Add overlay
      ctx.globalCompositeOperation = "soft-light"
      const overlayGradient = ctx.createLinearGradient(0, 0, width, height)
      if (isDark)
      {
        overlayGradient.addColorStop(0, "rgba(255, 255, 255, 0.08)")
        overlayGradient.addColorStop(1, "rgba(0, 0, 0, 0.12)")
      } else
      {
        overlayGradient.addColorStop(0, "rgba(255, 255, 255, 0.06)")
        overlayGradient.addColorStop(1, "rgba(0, 0, 0, 0.08)")
      }

      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = "source-over"
    }

    // Initial sizing
    handleResize()

    // Add resize listener
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [seed, isDark])

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ transition: "opacity 0.3s ease" }} />
    </div>
  )
}
