import type React from "react"
import { cn } from "@/lib/utils"

interface SidenoteProps {
  children: React.ReactNode
  number?: number
  className?: string
}

const Sidenote: React.FC<SidenoteProps> = ({ children, number, className }) => {
  return (
    <span className="sidenote-wrapper inline-block relative">
      <span
        className={cn(
          "sidenote-number align-super text-xs cursor-pointer",
          "text-primary hover:text-primary/80 transition-colors",
          className,
        )}
      >
        {number || "*"}
      </span>
      <span
        className={cn(
          "sidenote hidden lg:block",
          "prose-sm text-muted-foreground",
          "transition-opacity duration-200 hover:opacity-100",
          className,
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "sidenote-mobile lg:hidden text-sm",
          "text-muted-foreground bg-muted",
          "px-3 py-2 rounded-md mt-2 block",
          className,
        )}
      >
        ({children})
      </span>
    </span>
  )
}

let sidenoteCounter = 0

export const resetSidenoteCounter = () => {
  sidenoteCounter = 0
}

export const AutoNumberedSidenote: React.FC<Omit<SidenoteProps, "number">> = ({ children, className }) => {
  sidenoteCounter += 1
  return (
    <Sidenote number={sidenoteCounter} className={className}>
      {children}
    </Sidenote>
  )
}

export default Sidenote

