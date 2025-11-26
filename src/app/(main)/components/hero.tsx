"use client"

import Link from "next/link"

function HeroSection() {
  return (
    <section className="py-12">
      <div className="max-w-5xl">
        <h1 className="text-5xl font-serif font-bold mb-8 tracking-tight">
          blackprince
        </h1>

        <div className="prose prose-lg text-foreground">
          <p className="font-serif text-xl leading-relaxed mb-6">
            Computer Engineer & Systems Architect.
          </p>

          <p className="font-serif leading-relaxed mb-6">
            An Engineer with a passion for software engineering and machine learning. Experienced in developing autonomous navigation systems, backend services, and machine learning models.
          </p>

          <p className="font-serif leading-relaxed mb-8">
            Currently building interactive software and systems that enhance idea sharing and personal expression. Bridging the gap between technical and non-technical domains.
          </p>

          <div className="flex gap-6 font-sans text-sm">
            <Link href="/blog" className="text-primary hover:underline underline-offset-4">
              Read Blog &rarr;
            </Link>
            <Link href="/projects" className="text-primary hover:underline underline-offset-4">
              View Projects &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

