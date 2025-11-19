"use client"

import ProudGhanaian from "@/components/ui/pg"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

function HeroSection() {
  return (
    <section className="relative py-8 lg:py-12">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                blackprince
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
                Computer Engineer & Systems Architect
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                An Engineer with a passion for software engineering and machine learning. Experienced in developing autonomous navigation systems, backend services, and machine learning models.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Currently building interactive software and systems that enhance idea sharing and personal expression. Bridging the gap between technical and non-technical domains.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg" className="group">
                <Link href="/blog">
                  Read Blog
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">View Projects</Link>
              </Button>
            </motion.div>
          </div>

          {/* Visual Element */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <ProudGhanaian />
            </div>
          </motion.div>
        </div>

        {/* About Section */}
        {/* <div className="mt-24 lg:mt-32 space-y-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default HeroSection

