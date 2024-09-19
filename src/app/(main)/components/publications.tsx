'use client';

import { Link } from "lucide-react";
import React from "react";

// Change this structure to fit Publications
interface Publication {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  created_at: string;
  topics: string[];
  fork: boolean,
}


export const RecentPublications: React.FC = () => {
  return (
    <main>
      <div className="flex flex-row justify-between items-center gap-5">
        <div>
          <div className="flex items-center gap-3 text-gray-500">
            <h3>Recent Publications</h3>
          </div>
        </div>
        <Link
          href={"/publications"}
          className="text-gray-500 underline hover:text-black ease-in-out duration-500"
        >
          
        </Link>
      </div>

    <br />

    {/* <div>
      {sortedProjects.map((project) => (
        <div
        key={project.name}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
      >
        <h4>{project.full_name}</h4>
      </div>
      ))}
    </div> */}

    <br />

    </main>

  );
};


const PublicationShowcase: React.FC = () => {
  return (
    <main>

      <p>Publications Would be listed here!</p>

    <br />

    {/* <div>
      {sortedProjects.map((project) => (
        <div
        key={project.name}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
      >
        <h4>{project.full_name}</h4>
      </div>
      ))}
    </div> */}

    <br />

    </main>

  );
};

export default PublicationShowcase;