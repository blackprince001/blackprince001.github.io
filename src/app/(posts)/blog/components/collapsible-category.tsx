"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { parseDate, formatDate } from "@/utils/date"

interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    publishDate: string
    tag?: string
    description?: string
    readingTime?: string
  }
}

interface CollapsibleCategoryProps {
  title: string
  items: BlogPost[]
}

export function CollapsibleCategory({ title, items }: CollapsibleCategoryProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-b border-border/40 last:border-0 pb-6 mb-6 last:mb-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 group hover:text-primary transition-colors"
      >
        <h3 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          {title}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({items.length})
          </span>
        </h3>
        <ChevronRight
          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""
            }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-1 py-2">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex items-center justify-between py-3 px-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-base font-medium group-hover:text-primary transition-colors">
                      {item.frontmatter.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="hidden sm:inline-block">
                      {formatDate(parseDate(item.frontmatter.publishDate))}
                    </span>
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
