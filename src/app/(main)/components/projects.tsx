'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  created_at: string;
  topics: string[];
  fork: boolean;
}

export const ProjectComponent: React.FC<{ project: GitHubRepo }> = ({ project }) => {
  return (
    <div className="py-4 border-b border-border/40 last:border-0">
      <div className="flex justify-between items-baseline mb-2">
        <a
          href={project.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-serif font-medium text-primary hover:underline underline-offset-4"
        >
          {project.name}
        </a>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-3 w-3" />
          <span>{project.stargazers_count}</span>
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed font-serif text-sm max-w-2xl">
        {project.description}
      </p>
      {project.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {project.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="text-xs text-muted-foreground/70 font-mono">
              #{topic}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const ProjectShowcase: React.FC = () => {
  const pathname = usePathname();
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'stars' | 'recent'>('stars');

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try
      {
        const response = await fetch(
          `https://api.github.com/users/blackprince001/repos?per_page=20&sort=created`
        );
        if (!response.ok)
        {
          throw new Error('Failed to fetch projects');
        }
        const data: GitHubRepo[] = await response.json();
        const nonForkedProjects = data.filter(project => !project.fork);
        setProjects(nonForkedProjects);
      } catch (err)
      {
        setError('An error occurred while fetching projects.');
        console.error(err);
      } finally
      {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === 'stars')
    {
      return b.stargazers_count - a.stargazers_count;
    } else
    {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (isLoading) return <div className="py-12 text-center text-muted-foreground font-serif">Loading projects...</div>;
  if (error) return <div className="py-12 text-center text-red-500 font-serif">{error}</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="mb-8">Open Source Projects</h1>
      <p className="text-lg font-serif leading-relaxed mb-8">
        Building software in the open as a mode of creative exploration.
      </p>

      {/* Sort Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => setSortBy('stars')}
          className={`pb-2 px-1 text-sm font-sans transition-colors ${sortBy === 'stars'
            ? 'border-b-2 border-primary text-foreground'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Most Stars
        </button>
        <button
          onClick={() => setSortBy('recent')}
          className={`pb-2 px-1 text-sm font-sans transition-colors ${sortBy === 'recent'
            ? 'border-b-2 border-primary text-foreground'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Recent
        </button>
      </div>

      <div className="space-y-6">
        {sortedProjects.map((project) => (
          <ProjectComponent key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
};

export const RecentProjects: React.FC = () => {
  const [projects, setProjects] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try
      {
        const response = await fetch(`https://api.github.com/users/blackprince001/repos?per_page=5&sort=created`)
        if (!response.ok) throw new Error("Failed to fetch projects")
        const data: GitHubRepo[] = await response.json()
        const nonForkedProjects = data.filter((project) => !project.fork)
        setProjects(nonForkedProjects)
      } catch (err)
      {
        setError("An error occurred.")
      } finally
      {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (isLoading) return null;
  if (error) return null;

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-baseline border-b border-border pb-2">
        <h2>Recent Projects</h2>
        <Link href="/projects" className="text-sm font-sans text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
          View all &rarr;
        </Link>
      </div>

      <div className="space-y-4">
        {projects.slice(0, 3).map((project) => (
          <div key={project.id} className="group">
            <Link href={project.html_url} target="_blank" className="block">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-serif font-medium text-primary group-hover:underline underline-offset-4">
                  {project.name}
                </h3>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3" /> {project.stargazers_count}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 font-serif">
                {project.description}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectShowcase;