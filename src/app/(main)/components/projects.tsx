'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, CalendarDays, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
    <Card className="h-full border border-border bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            {project.name}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{project.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="text-muted-foreground">
              <span className="text-foreground font-medium">Created:</span>{" "}
              {new Date(project.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{project.stargazers_count}</span>
            </div>
          </div>
          {project.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.topics.map((topic) => (
                <span key={topic} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  #{topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const ProjectShowcase: React.FC = () => {
  const pathname = usePathname();
  const [sortOrder, setSortOrder] = useState<'date' | 'stars'>('date');
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.github.com/users/blackprince001/repos?per_page=20&sort=created`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data: GitHubRepo[] = await response.json();
        // Filter out forked repositories
        const nonForkedProjects = data.filter(project => !project.fork);
        setProjects(nonForkedProjects);
      } catch (err) {
        setError('An error occurred while fetching projects. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const selected = pathname.split('#')[1];
    if (selected) {
      setTimeout(() => {
        if (pathname.split('#')[1] === selected) {
          document.getElementById(selected)?.scrollIntoView();
        }
      }, 500);
    }
  }, [pathname]);

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortOrder === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return b.stargazers_count - a.stargazers_count;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-8">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="border border-gray-600 rounded-lg shadow-sm bg-[#242526]">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Open Source Projects</h1>
      <p className="text-muted-foreground">
        I view building software in the open as a mode of{" "}
        <em className="font-serif text-[110%] leading-[100%]">creative exploration</em>. It lets me quickly act on
        inspiration, delve into new topics, and make tools that improve the lives of people.
      </p>
      <p className="text-lg mt-4">
        If you find something interesting,{" "}
        <a
          className="text-primary hover:text-primary/80 transition-colors"
          href="mailto:appiahboaduprince@gmail.com?subject=Software%20Projects"
        >
          let me know
        </a>
        !
      </p>

      <div className="mt-6 bg-[#242526] border-b border-gray-200 py-4 top-0 z-10">
        <div className="flex justify-center space-x-6">
          <button
            className={`flex items-center ${sortOrder === 'date' ? 'text-gray-500' : 'text-gray-400'} transition-colors hover:text-black`}
            onClick={() => setSortOrder('date')}
          >
            <CalendarDays size={18} strokeWidth={1.8} className="mr-1.5" /> by Date
          </button>
          <button
            className={`flex items-center ${sortOrder === 'stars' ? 'text-gray-500' : 'text-gray-400'} transition-colors hover:text-black`}
            onClick={() => setSortOrder('stars')}
          >
            <Star size={18} strokeWidth={1.8} className="mr-1.5" /> by Stars
          </button>
        </div>
      </div>

      <section className="mx-auto py-12 space-y-8">
        {sortedProjects.map((project) => (
          <div key={project.id} id={project.name}>
            <ProjectComponent project={project} />
          </div>
        ))}
      </section>
    </main>
  );
};

export const RecentProjects: React.FC = () => {
  const pathname = usePathname()
  const [projects, setProjects] = useState<GitHubRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://api.github.com/users/blackprince001/repos?per_page=5&sort=created`)
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data: GitHubRepo[] = await response.json()
        const nonForkedProjects = data.filter((project) => !project.fork)
        setProjects(nonForkedProjects)
      } catch (err) {
        setError("An error occurred while fetching projects.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Projects</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/3 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Projects</h2>
        </div>
        <Card className="bg-destructive/10">
          <CardHeader>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
        </Card>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Projects</h2>
        <Button asChild variant="ghost">
          <Link href="/projects" className="group">
            View all projects
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={project.html_url} target="_blank" rel="noopener noreferrer">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 shrink-0">
                    <Star className="h-4 w-4" />
                    {project.stargazers_count}
                  </CardDescription>
                </div>
                {project.description && (
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ProjectShowcase;