import ProudGhanaian from "@/components/ui/pg"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

function HeroSection() {
  return (
    <div className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">blackprince</h1>
            <p className="text-lg text-muted-foreground">Computer Engineer, Researcher and Design Architect</p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="default">
              <Link href="/blog">
                Read Blog <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <ProudGhanaian />
        </div>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
        <p>
          I had my undergraduate studies at{" "}
          <Link
            href="https://www.knust.edu.gh"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Kwame Nkrumah University of Science and Technology
          </Link>
          .
        </p>
        <p>
          While pursuing my studies at Kwame Nkrumah University of Science and Technology, I have gained valuable
          experience in diverse contexts and political environments. This exposure has equipped me to tackle challenges
          head-on and adapt to various work environments.
        </p>
        <p>
          My passion lies in creating interactive software and systems that fosters idea sharing and personal
          expression. As a generalist, I am deeply invested in both technical and non-technical fields: hoping to bridge
          the gap between them. I believe that these fundamental aspects are crucial for developing meaningful products
          and research.
        </p>
      </div>

      <div className="mt-16 relative h-[400px] rounded-lg overflow-hidden">
        <Image
          src="https://blackprince001.github.io/images/drone.png"
          alt="Drone"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}

export default HeroSection

