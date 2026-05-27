"use client"

import React from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { assetPath } from "@/lib/asset-path"
import { Lightbox, useLightboxNav, type LightboxItem } from "@/components/ui/lightbox"
import featured from "@/data/featured-projects.json"

interface ProjectLink {
  label: string
  url: string
}

interface FeaturedProject {
  name: string
  date?: string
  stars?: number
  tags?: string[]
  description: string | string[]
  image?: string
  images?: string[]
  links?: ProjectLink[]
}

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i
const isVideo = (s: string) => VIDEO_EXT.test(s)

const YT_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
function youtubeId(s: string): string | null {
  const m = YT_RE.exec(s)
  return m ? m[1] : null
}

function ProjectMedia({
  src,
  alt,
  className,
  onOpen,
}: {
  src: string
  alt: string
  className?: string
  onOpen?: () => void
}) {
  const ytId = youtubeId(src)
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
        title={alt}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={className}
      />
    )
  }
  const resolved = assetPath(src)
  const media = isVideo(src) ? (
    <video
      src={resolved}
      autoPlay
      loop
      muted
      playsInline
      aria-label={alt}
      className={cn(className, "pointer-events-none")}
    />
  ) : (
    <img src={resolved} alt={alt} className={className} />
  )
  if (!onOpen) return media
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${alt} fullscreen`}
      className="group relative block w-full overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
    >
      {media}
    </button>
  )
}

function ProjectLinkText({ link }: { link: ProjectLink }) {
  const external = link.url.startsWith("http")
  return (
    <Link
      href={link.url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="font-semibold text-primary underline-offset-4 hover:underline"
    >
      {link.label}
    </Link>
  )
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function FeaturedRow({ project }: { project: FeaturedProject }) {
  const paragraphs = Array.isArray(project.description)
    ? project.description
    : [project.description]

  const imgs = project.images && project.images.length > 0
    ? project.images
    : project.image
      ? [project.image]
      : []
  const hasImages = imgs.length > 0
  const sideImgs = imgs.slice(0, 2)
  const rest = imgs.slice(2)
  const restCols = rest.length === 0 ? 0 : Math.min(rest.length, 4)
  const restColClass =
    restCols === 1
      ? "sm:grid-cols-2"
      : restCols === 2
        ? "sm:grid-cols-2"
        : restCols === 3
          ? "sm:grid-cols-3"
          : "sm:grid-cols-4"

  // Build the lightbox roster from non-YouTube media only — YouTube iframes
  // already have their own player chrome and shouldn't be cloned into a modal.
  const lightboxItems: LightboxItem[] = React.useMemo(
    () =>
      imgs
        .filter((s) => !youtubeId(s))
        .map((s) => ({ src: assetPath(s), alt: project.name })),
    [imgs, project.name]
  )
  const lb = useLightboxNav(lightboxItems)
  // Map the i-th media tile to its index inside lightboxItems (or -1 if YT).
  const lightboxIndexFor = (tileSrc: string) => {
    if (youtubeId(tileSrc)) return -1
    const resolved = assetPath(tileSrc)
    return lightboxItems.findIndex((it) => it.src === resolved)
  }

  return (
    <article id={slugify(project.name)} className="scroll-mt-24 py-8 first:pt-10">
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          hasImages && "lg:grid-cols-[1fr_320px] lg:gap-10"
        )}
      >
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              {project.name}
            </h3>
            {project.date && (
              <span className="font-sans text-sm text-muted-foreground">
                {project.date}
              </span>
            )}
          </div>

          {(project.stars !== undefined || (project.tags && project.tags.length > 0)) && (
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-sm text-muted-foreground">
              {project.stars !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {project.stars}
                </span>
              )}
              {project.tags?.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}

          <div className="space-y-2.5 font-serif text-[13px] leading-relaxed text-muted-foreground">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {project.links && project.links.length > 0 && (
            <p className="mt-4 font-serif text-base text-muted-foreground">
              <span className="text-muted-foreground">Links: </span>
              {project.links.map((l, i) => (
                <React.Fragment key={`${l.label}-${l.url}`}>
                  {i > 0 && <span className="text-muted-foreground">, </span>}
                  <ProjectLinkText link={l} />
                </React.Fragment>
              ))}
            </p>
          )}
        </div>

        {sideImgs.length > 0 && (
          <div className="flex flex-col gap-3 lg:pt-2">
            {sideImgs.map((src, i) => {
              const lbIdx = lightboxIndexFor(src)
              return (
                <ProjectMedia
                  key={`${src}-${i}`}
                  src={src}
                  alt={imgs.length === 1 ? project.name : `${project.name} (${i + 1})`}
                  className="w-full rounded-md border border-border/50 bg-muted/20 max-h-72 object-cover lg:max-h-none"
                  onOpen={lbIdx >= 0 ? () => lb.open(lbIdx) : undefined}
                />
              )
            })}
          </div>
        )}
      </div>

      {rest.length > 0 && (
        <div className={cn("mt-4 grid grid-cols-2 gap-2 sm:gap-3", restColClass)}>
          {rest.map((src, i) => {
            const lbIdx = lightboxIndexFor(src)
            return (
              <ProjectMedia
                key={`${src}-${i}`}
                src={src}
                alt={`${project.name} (${i + 3})`}
                className="w-full aspect-[16/10] rounded-md border border-border/50 bg-muted/20 object-cover"
                onOpen={lbIdx >= 0 ? () => lb.open(lbIdx) : undefined}
              />
            )
          })}
        </div>
      )}

      <Lightbox
        items={lightboxItems}
        index={lb.index}
        onClose={lb.close}
        onPrev={lb.prev}
        onNext={lb.next}
      />
    </article>
  )
}

function parseProjectDate(s?: string): number {
  if (!s) return 0
  const t = Date.parse(s)
  if (!Number.isNaN(t)) return t
  const yearOnly = /^\s*(\d{4})\s*$/.exec(s)
  if (yearOnly) return Date.parse(`${yearOnly[1]}-01-01`)
  return 0
}

export function FeaturedProjects() {
  const all = featured as FeaturedProject[]

  const projects = React.useMemo(
    () => [...all].sort((a, b) => parseProjectDate(b.date) - parseProjectDate(a.date)),
    [all]
  )

  // The index stays alphabetical so it reads like a directory,
  // independent of how the list below is ordered.
  const toc = React.useMemo(
    () => [...all].sort((a, b) => a.name.localeCompare(b.name)),
    [all]
  )

  if (projects.length === 0) return null

  return (
    <section className="mb-16">
      <nav
        aria-label="Featured projects"
        className="mt-6 rounded-lg border border-border/50 bg-muted/20 px-6 py-6 sm:px-8"
      >
        <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
          Featured
        </h2>
        <ul className="grid grid-cols-1 gap-x-10 gap-y-2 sm:grid-cols-2">
          {toc.map((p) => (
            <li key={p.name}>
              <a
                href={`#${slugify(p.name)}`}
                className="font-sans text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {projects.map((p) => (
          <FeaturedRow key={p.name} project={p} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedProjects
