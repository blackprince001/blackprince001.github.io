'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Publication {
  id: number;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  link: string;
  pdf?: string;
}

export const RecentPublications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publications');
        if (!response.ok) {
          throw new Error(`Failed to fetch publications: ${response.statusText}`);
        }
        const data = await response.json();
        setPublications(data.slice(0, 5)); // Show only the first 5 publications
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return <div>Loading recent publications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main>
      <div className="flex flex-row justify-between items-center gap-5">
        <div>
          <div className="flex items-center gap-3 text-gray-500">
            <h3>Recent Publications</h3>
          </div>
        </div>
        <Link
          href="/publications"
          className="text-gray-500 underline hover:text-black ease-in-out duration-500"
        >
          View All Publications
        </Link>
      </div>

      <br />

      <div>
        {publications.map((publication) => (
          <div
            key={publication.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
          >
            <h4>
              <a
                href={publication.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {publication.title}
              </a>
            </h4>
            <p className="text-gray-500">
              {publication.authors.join(', ')} - {publication.year}
            </p>
          </div>
        ))}
      </div>

      <br />
    </main>
  );
};

export const PublicationShowcase: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/publications');
        if (!response.ok) {
          throw new Error(`Failed to fetch publications: ${response.statusText}`);
        }
        const data = await response.json();
        setPublications(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
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
      <h1 className="text-3xl font-bold mb-8 text-gray-500">Publications</h1>
      <div className="space-y-8">
        {publications.map((publication) => (
          <Card key={publication.id} className="border border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-[#242526]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-500">
                <a
                  href={publication.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-400 transition-colors"
                >
                  {publication.title}
                </a>
              </CardTitle>
              <CardDescription className="text-gray-400">
                {publication.authors.join(', ')} - {publication.journal}, {publication.year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {publication.pdf && (
                <a
                  href={publication.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-500 hover:text-gray-400 transition-colors"
                >
                  <span>Download PDF</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default PublicationShowcase;