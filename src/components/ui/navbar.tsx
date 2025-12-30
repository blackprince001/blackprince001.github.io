"use client"

import Link from "next/link";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react";

// Simple NavLink
const NavLink = ({ href, children, external = false, onClick }: { href: string; children: React.ReactNode; external?: boolean; onClick?: () => void }) => (
  <Link
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className="text-sm font-sans text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
    onClick={onClick}
  >
    {children}
  </Link>
);

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full bg-background py-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <span className="text-lg font-serif font-bold tracking-tight hover:underline underline-offset-4">
              home
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/blog">Writing</NavLink>
            <NavLink href="/shorts">Shorts</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/publications">Research</NavLink>
            <div className="pl-2 border-l border-border/50 ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <button
              className="p-1 text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border/20">
            <div className="flex flex-col space-y-3">
              <NavLink href="/blog" onClick={() => setIsOpen(false)}>Writing</NavLink>
              <NavLink href="/shorts" onClick={() => setIsOpen(false)}>Shorts</NavLink>
              <NavLink href="/projects" onClick={() => setIsOpen(false)}>Projects</NavLink>
              <NavLink href="/publications" onClick={() => setIsOpen(false)}>Research</NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;