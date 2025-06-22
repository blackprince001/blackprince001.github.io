import ProudGhanaian from "@/components/ui/pg"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import styles from '@/app/preview.module.css';
// import GlobeWithLocation from "@/components/earth-globe-location";


function HeroSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container max-w-6xl mx-auto px-6">
        {/* Main Hero Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
                blackprince
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground font-medium">
                Computer Engineer & Systems Architect
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Building interactive software and systems that foster idea sharing and personal expression.
                Bridging the gap between technical and non-technical domains.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/blog">
                  Read Blog
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">View Projects</Link>
              </Button>
            </div>
          </div>

          {/* Visual Element */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <ProudGhanaian />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-24 lg:mt-32 space-y-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              I completed my undergraduate studies at{" "}
              <Link
                href="https://www.knust.edu.gh"
                className={styles.Link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Kwame Nkrumah University of Science and Technology
              </Link>
              , where I gained valuable experience in diverse contexts and political environments.
              This exposure has equipped me to tackle challenges head-on and adapt to various work environments.
            </p>

            <br />

            <p className="text-lg leading-relaxed">
              My passion lies in creating interactive software and systems that foster idea sharing and personal
              expression. As a generalist, I am deeply invested in both technical and non-technical fields,
              hoping to bridge the gap between them. I believe that these fundamental aspects are crucial for
              developing meaningful products and research.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

