import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className="fixed w-full h-[7vh] nav-container">
      <nav className="flex justify-between items-center max-w-3xl mx-auto h-full px-6 py-3">
        <Link href={`/`}>CrackOverflow</Link>
        <div className="text-[#0f4c81]">
          <div className="flex items-center gap-3">
            <Link href={`/projects`}>
              <p className="text-sm underline hover:text-[#0f4c81] ease-in duration-200">
                Projects
              </p>
            </Link>
            <Link href={`/blog`}>
              <p className="text-sm underline hover:text-[#0f4c81] ease-in duration-200">
                Blog
              </p>
            </Link>
            <Link href={`https://read.cv/blackprince`}>
              <p className="text-sm underline hover:text-[#0f4c81] ease-in duration-200">
                Resume
              </p>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;