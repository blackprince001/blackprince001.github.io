import Link from "next/link";
import React from "react";
import { ThemeToggle } from "@/components/theme-toggle"


function Navbar() {
  return (
    <div className="mt-4 h-[7vh] w-full nav-container">
      <nav className="flex justify-between items-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/`}><h4>Quantum Singularity</h4></Link>
        <div className="flex items-center gap-4">
          <div className="text-gray-500">
            <div className="flex items-center gap-3">
              <Link href={`/projects`}>
                <h4 className="text-sm underline hover:text-gray-500 ease-in duration-200">projects</h4>
              </Link>
              <Link href={`/publications`}>
                <h4 className="text-sm underline hover:text-gray-500 ease-in duration-200">publications</h4>
              </Link>
              <Link href={`/blog`}>
                <h4 className="text-sm underline hover:text-gray-500 ease-in duration-200">writing</h4>
              </Link>
              <Link href={`https://read.cv/blackprince`}>
                <h4 className="text-sm underline hover:text-gray-500 ease-in duration-200">resume</h4>
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;