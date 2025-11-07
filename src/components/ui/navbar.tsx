import Link from "next/link";
import React from "react";
import { ThemeToggle } from "@/components/theme-toggle"

// NavLink component for consistent styling
const NavLink = ({ href, children, external = false }: { href: string; children: React.ReactNode; external?: boolean }) => (
  <Link
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full" />
  </Link>
);

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-6">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold tracking-tight hover:text-primary transition-colors">
              blackprince
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/blog">Writing</NavLink>
            <NavLink href="/shorts">Shorts</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/publications">Research</NavLink>
            <NavLink href="/resume">Resume</NavLink>
          </div>

          {/* Right side - Theme toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;