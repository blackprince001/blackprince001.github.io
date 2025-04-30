import ProudGhanaian from "@/components/ui/pg"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import styles from '@/app/preview.module.css';
import GlobeWithLocation from "@/components/earth-globe-location";


function HeroSection() {
  return (
    <div className="text-sm py-20">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 items-center justify-center mb-16">
        <div className="space-y-6">
          <h1 className="text-6xl flex justify-center font-bold tracking-tight">blackprince</h1>
          <div className="flex justify-center">
            <p className="text-sm text-muted-foreground">Computer Engineer - Systems Architect</p>
          </div>
          <div className="flex justify-center gap-4">
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
        <div className="flex justify-center">
          <ProudGhanaian />
        </div>
      </div>

      <div className="max-w-none space-y-6">
        <p>
          I had my undergraduate studies at{" "}
          <Link
            href="https://www.knust.edu.gh"
            className={styles.Link}
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

      <div className="max-w-none space-y-6">
        <GlobeWithLocation />
      </div>
    </div>
  )
}

export default HeroSection

