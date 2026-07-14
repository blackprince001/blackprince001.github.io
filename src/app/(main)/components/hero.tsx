import Link from "next/link"
import styles from "../home.module.css"

function HeroSection() {
  return (
    <section id="intro" className={styles.hero} aria-labelledby="intro-title">
      <div className={styles.identityMark} aria-hidden="true">PK</div>
      <h1 className={styles.hello} id="intro-title">Hi. I&apos;m Prince.</h1>

      <div className={styles.introCopy}>
        <p>
          I&apos;m a systems engineer and robotics researcher. I build autonomous systems and study
          the places where machine learning, software engineering, and design meet.
        </p>
        <p>
          This site is my working archive: research notes, open-source systems, long-form essays,
          and manuscripts shaped by the questions I&apos;m currently following.
        </p>
        <p>
          At the moment, I&apos;m teaching a practical course on robotics and continuing work across
          robot learning, perception, and infrastructure for intelligent systems.
        </p>
      </div>

      <div className={styles.heroActions}>
        <a href="https://robotics-course-458.vercel.app/" target="_blank" rel="noopener noreferrer">
          Robotics course <span aria-hidden="true">↗</span>
        </a>
        <Link href="/blog">Read the journal <span aria-hidden="true">→</span></Link>
        <Link href="/projects">View all projects <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  )
}

export default HeroSection
