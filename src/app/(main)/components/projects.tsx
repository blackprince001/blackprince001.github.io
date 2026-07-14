'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { FeaturedProjects } from './featured-projects';
import featuredProjects from '@/data/featured-projects.json';
import { assetPath } from '@/lib/asset-path';
import styles from '../home.module.css';

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

const projectSummaries: Record<string, string> = {
  "SpeakUp — Real-Time Classroom Engagement":
    "A real-time classroom platform built around anonymous questions, ranked discussion, polls, and activity sequencing—without requiring student accounts.",
  Lumen:
    "A self-hostable research library for ingesting, organizing, searching, and reading papers with semantic retrieval and AI-assisted analysis.",
  "Oware Engine and a Ladder of RL Agents":
    "A custom Oware engine and evaluation ladder for DQN, PPO, AlphaZero-lite, and Minimax agents, including the training strategies that failed.",
}

export const ProjectComponent: React.FC<{ project: GitHubRepo }> = ({ project }) => {
  return (
    <div className="py-4">
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
  const [page, setPage] = useState(1);

  const PER_PAGE = 7;

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try
      {
        const response = await fetch(
          `https://api.github.com/users/blackprince001/repos?per_page=100&sort=created`
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

  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  if (isLoading) return <div className="py-12 text-center text-muted-foreground font-serif">Loading projects...</div>;
  if (error) return <div className="py-12 text-center text-red-500 font-serif">{error}</div>;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="mb-4">Projects</h1>
      <p className="text-lg font-serif leading-relaxed mb-10">
        Building software in the open as a mode of creative exploration.
      </p>

      <FeaturedProjects />

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-serif">Open Source</h2>
        <span className="font-sans text-xs text-muted-foreground">
          Pulled live from GitHub
        </span>
      </div>

      {/* Sort Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border">
        <button
          onClick={() => { setSortBy('stars'); setPage(1); }}
          className={`pb-2 px-1 text-sm font-sans transition-colors ${sortBy === 'stars'
            ? 'border-b-2 border-primary text-foreground'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Most Stars
        </button>
        <button
          onClick={() => { setSortBy('recent'); setPage(1); }}
          className={`pb-2 px-1 text-sm font-sans transition-colors ${sortBy === 'recent'
            ? 'border-b-2 border-primary text-foreground'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Recent
        </button>
      </div>

      <div className="space-y-6">
        {paginatedProjects.map((project) => (
          <ProjectComponent key={project.id} project={project} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-sm font-sans text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            &larr; Previous
          </button>
          <span className="font-sans text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="text-sm font-sans text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </main>
  );
};

export const RecentProjects: React.FC = () => {
  const projects = featuredProjects.slice(0, 3)

  return (
    <section id="work" className={styles.homeSection} aria-labelledby="work-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionIndex}>01 / Systems</p>
          <h2 id="work-title">Selected work</h2>
        </div>
        <Link href="/projects" className={styles.sectionLink}>
          View all <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.projectList}>
        {projects.map((project, index) => {
          const primaryLink = project.links[0]
          const image = project.images?.[0]
          return (
            <article key={project.name} className={styles.projectCard}>
              {image && (
                <a
                  href={primaryLink?.url ?? "/projects"}
                  className={styles.projectMedia}
                  target={primaryLink?.url.startsWith("http") ? "_blank" : undefined}
                  rel={primaryLink?.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={`Open ${project.name}`}
                >
                  <img src={assetPath(image)} alt="" />
                  <span className={styles.mediaLabel}>System / 0{index + 1}</span>
                  <span className={styles.mediaAction} aria-hidden="true">Inspect ↗</span>
                </a>
              )}
              <div className={styles.projectBody}>
                <div className={styles.projectTitleRow}>
                  <h3>{project.name}</h3>
                  <span>{project.date}</span>
                </div>
                <p>
                  {projectSummaries[project.name]
                    ?? (Array.isArray(project.description) ? project.description[0] : project.description)}
                </p>
                <div className={styles.projectMeta}>
                  <span>{project.tags.slice(0, 3).join(" · ")}</span>
                  <div>
                    {project.links.map((link) => (
                      <a
                        key={`${project.name}-${link.label}`}
                        href={link.url}
                        target={link.url.startsWith("http") ? "_blank" : undefined}
                        rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {link.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectShowcase;
