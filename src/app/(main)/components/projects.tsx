'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarDays, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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

const ProjectComponent: React.FC<{ project: GitHubRepo }> = ({ project }) => {
  return (
    <Card className="border border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-[#242526]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-500">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400 transition-colors"
          >
            {project.name}
          </a>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Created: {new Date(project.created_at).toLocaleDateString()} • {project.stargazers_count} stars
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-500">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.topics.map((topic) => (
            <span key={topic} className="px-2 py-1 text-sm text-gray-400 bg-gray-600 rounded-full">
              #{topic}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-500">Open Source Projects</h1>
      <br />
      <p>
        I view building software in the open as a mode of{' '}
        <em className="font-serif text-[110%] leading-[100%]">creative exploration</em>. It lets me quickly act on inspiration, delve into new topics, and make tools that improve the lives of people.
      </p>
      <br />
      <p className="text-lg">
        If you find something interesting,{' '}
        <a className="text-gray-500" href="mailto:appiahboaduprince@gmail.com?subject=Software%20Projects">
          let me know
        </a>!
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
          `https://api.github.com/users/blackprince001/repos?per_page=5&sort=created`
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
    return <div className="text-center py-20">Loading projects...</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }
  return (
    <main>
      <div className="flex flex-row justify-between items-center gap-5">
        <div>
          <div className="flex items-center gap-3 text-gray-500">
            <h3>Recent Projects</h3>
          </div>
        </div>
        <Link
          href={"/projects"}
          className="text-gray-500 underline hover:text-black ease-in-out duration-500"
        >
          <h5>View All Projects</h5>
        </Link>
      </div>
    <br />
    <div>
      {sortedProjects.map((project) => (
        <div
        key={project.name}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
      >
        <ul>{project.full_name}</ul>
      </div>
      ))}
    </div>
    <br />
    </main>
  );
};

export default ProjectShowcase;