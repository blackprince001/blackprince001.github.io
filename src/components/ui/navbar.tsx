import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className="fixed w-full h-[7vh] nav-container">
      <nav className="flex justify-between items-center max-w-3xl mx-auto h-full px-6 py-3">
        <Link href={`/`}>blackprince001</Link>
        <div className="text-[#FE7A00]">
          <div className="flex items-center gap-3">
            <Link href={`https://www.github.com/blackprince001`} target="_blank">
              <p className="text-sm hover:text-[#FE7A00] ease-in duration-200">
                projects
              </p>
            </Link>
            <Link href={`/blog`}>
              <p className="text-sm hover:text-[#FE7A00] ease-in duration-200">
                blog
              </p>
            </Link>
            <Link href={`https://read.cv/blackprince`}>
              <p className="text-sm hover:text-[#FE7A00] ease-in duration-200">
                resume
              </p>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
