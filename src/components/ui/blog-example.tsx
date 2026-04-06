import * as React from "react"
import { cn } from "@/lib/utils"

interface BlogExampleProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
}

const BlogExample = React.forwardRef<HTMLDivElement, BlogExampleProps>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "my-8 rounded-xl border border-zinc-200/50 bg-zinc-50/50 p-6 dark:border-zinc-800/50 dark:bg-zinc-900/40",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Example
          </span>
          {title && (
            <span className="text-sm font-medium text-zinc-900/80 dark:text-zinc-100/80">
              — {title}
            </span>
          )}
        </div>
        <div className="text-[1.0625rem] leading-relaxed text-zinc-700 dark:text-zinc-300">
          {children}
        </div>
      </div>
    )
  }
)

BlogExample.displayName = "BlogExample"

export { BlogExample }
