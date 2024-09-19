import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className="mt-4 h-[7vh] w-full nav-container">
      <nav className="flex justify-between items-center max-w-3xl mx-auto h-full px-6 py-3">
        <Link href={`/`}><h4>$root</h4></Link>
        <div className="text-gray-500">
          <div className="flex items-center gap-3">
            <Link href={`/projects`}>
              <h4 className="text-sm underline hover:text-gray-500 ease-in duration-200">
                projects
              </h4>
            </Link>
            <Link href={`/publications`}>
              <h4 className="text-sm underline hover:text-gray-500 ease-in duration-200">
                publications
              </h4>
            </Link>
            <Link href={`/blog`}>
              <h4 className="text-sm underline hover:text-gray-500 ease-in duration-200">
                writing
              </h4>
            </Link>
            <Link href={`https://read.cv/blackprince`}>
              <h4 className="text-sm underline hover:text-gray-500 ease-in duration-200">
                resume
              </h4>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;