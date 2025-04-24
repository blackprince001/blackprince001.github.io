"use client"

import { useEffect, useRef, useState } from "react"

interface GradientPlaceholderProps {
  seed: string
  className?: string
}

export function GradientPlaceholder({ seed, className = "" }: GradientPlaceholderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Generate consistent colors based on the seed string
  const getColors = (seed: string) => {
    // Simple hash function to generate a number from a string
    const hashString = (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash = hash & hash
      }
      return Math.abs(hash)
    }

    const hash = hashString(seed)

    // Generate HSL colors with good saturation and lightness
    const hue1 = hash % 360
    const hue2 = (hue1 + 40 + (hash % 80)) % 360
    const hue3 = (hue2 + 40 + (hash % 80)) % 360

    return [`hsl(${hue1}, 70%, 65%)`, `hsl(${hue2}, 80%, 60%)`, `hsl(${hue3}, 75%, 55%)`]
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

      // Create a complex gradient with multiple circles
      const circles = [
        { x: width * 0.3, y: height * 0.3, r: width * 0.5, color: colors[0] },
        { x: width * 0.7, y: height * 0.6, r: width * 0.4, color: colors[1] },
        { x: width * 0.5, y: height * 0.5, r: width * 0.6, color: colors[2] },
      ]

      // Fill background
      ctx.fillStyle = "#f8f8f8"
      ctx.fillRect(0, 0, width, height)

      // Draw gradient circles with blend mode
      ctx.globalCompositeOperation = "multiply"

      circles.forEach((circle, i) => {
        const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.r)

        gradient.addColorStop(0, circle.color)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalCompositeOperation = "source-over"
    }

    // Initial draw
    drawGradient()

    // Add subtle animation on hover
    let animationFrame: number
    let angle = 0

    const animate = () => {
      if (!isHovering) {
        cancelAnimationFrame(animationFrame)
        return
      }

      angle += 0.01
      const circles = [
        {
          x: width * (0.3 + Math.sin(angle) * 0.05),
          y: height * (0.3 + Math.cos(angle) * 0.05),
          r: width * 0.5,
          color: colors[0],
        },
        {
          x: width * (0.7 + Math.cos(angle) * 0.05),
          y: height * (0.6 + Math.sin(angle) * 0.05),
          r: width * 0.4,
          color: colors[1],
        },
        {
          x: width * (0.5 + Math.sin(angle * 1.5) * 0.05),
          y: height * (0.5 + Math.cos(angle * 1.5) * 0.05),
          r: width * 0.6,
          color: colors[2],
        },
      ]

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "#f8f8f8"
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = "multiply"

      circles.forEach((circle) => {
        const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.r)

        gradient.addColorStop(0, circle.color)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalCompositeOperation = "source-over"

      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [seed, isHovering])

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
      ctx.fillStyle = "#f8f8f8"
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = "multiply"

      const circles = [
        { x: width * 0.3, y: height * 0.3, r: width * 0.5, color: colors[0] },
        { x: width * 0.7, y: height * 0.6, r: width * 0.4, color: colors[1] },
        { x: width * 0.5, y: height * 0.5, r: width * 0.6, color: colors[2] },
      ]

      circles.forEach((circle) => {
        const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.r)

        gradient.addColorStop(0, circle.color)
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalCompositeOperation = "source-over"
    }

    // Initial sizing
    handleResize()

    // Add resize listener
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [seed])

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
