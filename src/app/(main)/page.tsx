import BlogPosts from "./components/blog-posts";
import HeroSection from "./components/hero";
import { RecentProjects } from "./components/projects";
import { RecentPublications } from "./components/publications";
import styles from "./home.module.css";

function HomePage() {
  return (
    <div className={styles.home}>
      <aside className={styles.sectionRail} aria-label="Homepage sections">
        <a href="#intro">Intro</a>
        <a href="#work">Selected work</a>
        <a href="#writing">Writing</a>
        <a href="#manuscripts">Manuscripts</a>
      </aside>

      <div className={styles.homeColumn}>
        <HeroSection />
        <RecentProjects />
        <BlogPosts />
        <RecentPublications />
      </div>
    </div>
  );
}

export default HomePage;
