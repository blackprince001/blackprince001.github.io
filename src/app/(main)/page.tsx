import BlogPosts from "./components/blog-posts";
import HeroSection from "./components/hero";
import { RecentProjects } from "./components/projects";
import { RecentPublications } from "./components/publications";


function HomePage() {
  return (
    <div>
      <HeroSection />
      <BlogPosts />
      <RecentProjects />
      <RecentPublications />
    </div>
  );
}

export default HomePage;
