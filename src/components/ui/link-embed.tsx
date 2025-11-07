import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface LinkEmbedProps {
  href: string
  title: string
  description?: string
  label?: string
  icon?: ReactNode
  image?: string
  favicon?: string
  meta?: string
  className?: string
}

function getDisplayLabel(href: string, label?: string) {
  if (label)
  {
    return label
  }

  const isExternal = /^https?:\/\//.test(href)

  if (!isExternal)
  {
    return "blackprince.tech"
  }

  try
  {
    const url = new URL(href)
    return url.hostname.replace(/^www\./, "")
  } catch (error)
  {
    return href
  }
}

export function LinkEmbed({
  href,
  title,
  description,
  label,
  icon,
  image,
  favicon,
  meta,
  className,
}: LinkEmbedProps) {
  const isExternal = /^https?:\/\//.test(href)
  const displayLabel = getDisplayLabel(href, label)
  const hasPreview = Boolean(image)

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={cn("group block", className)}
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-card/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
        hasPreview && "md:flex md:items-stretch md:gap-6"
      )}>
        {hasPreview && (
          <div className="relative mb-4 h-48 overflow-hidden rounded-xl border border-border/40 bg-muted/50 md:mb-0 md:h-auto md:w-56">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${image})` }}
              aria-hidden="true"
            />
            <span className="sr-only">{`${title} preview image`}</span>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {favicon ? (
                  <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-border/40 bg-background/70">
                    <span
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${favicon})` }}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{displayLabel} favicon</span>
                  </span>
                ) : icon ? (
                  <span className="text-muted-foreground">{icon}</span>
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border/40 bg-background/50 text-[10px] font-semibold text-muted-foreground">
                    {displayLabel.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span>{displayLabel}</span>
              </div>

              <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                {title}
              </h3>

              {description && (
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {description}
                </p>
              )}
            </div>

            <ArrowUpRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
          </div>

          {meta && (
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
              {meta}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default LinkEmbed

