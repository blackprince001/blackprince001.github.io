"use client"

import Link from "next/link"

function HeroSection() {
  return (
    <section className="py-12">
      <div className="max-w-5xl">
        <h2 className="mb-4">
          Prince Kwabena Appiah Boadu
        </h2>

        <div className="prose prose-lg text-foreground">
          <p className="font-serif text-sm leading-relaxed text-muted-foreground mb-6">
            Systems Engineer & Robotics Researcher
          </p>

          <p className="font-serif leading-relaxed mb-6">
            I build autonomous robotic systems and explore the intersection of machine learning, software engineering, and design.
          </p>

          <p className="font-serif leading-relaxed mb-8">
            This site is my digital garden, a living archive of ideas in motion. It houses everything from raw working notes and open-source projects to structured essays and formal manuscripts.
          </p>

          <div className="mb-8 rounded-lg border border-border bg-muted/40 px-4 py-3">
            <p className="font-sans text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Currently Teaching
            </p>
            <a
              href="https://robotics-course-458.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-serif text-primary hover:underline underline-offset-4"
            >
              Robotics Course &rarr;
            </a>
          </div>

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

