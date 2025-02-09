import BlogPosts from "./components/blog-posts";
import HeroSection from "./components/hero";
import { RecentProjects } from "./components/projects";
import { RecentPublications } from "./components/publications";

function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeroSection />
      <div className="space-y-24">
        <BlogPosts />
        <RecentProjects />
        <RecentPublications />
      </div>
    </div>
  );
}

export default HomePage;
