"use client"

import Link from "next/link";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// NavLink component for consistent styling
const NavLink = ({ href, children, external = false, onClick }: { href: string; children: React.ReactNode; external?: boolean; onClick?: () => void }) => (
  <Link
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noopener noreferrer" : undefined}
    className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group"
    onClick={onClick}
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full" />
  </Link>
);

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-6">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
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

          {/* Right side - Theme toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden overflow-hidden border-b border-border/40 bg-background"
          >
            <div className="flex flex-col space-y-4 px-6 py-6">
              <NavLink href="/blog" onClick={() => setIsOpen(false)}>Writing</NavLink>
              <NavLink href="/shorts" onClick={() => setIsOpen(false)}>Shorts</NavLink>
              <NavLink href="/projects" onClick={() => setIsOpen(false)}>Projects</NavLink>
              <NavLink href="/publications" onClick={() => setIsOpen(false)}>Research</NavLink>
              <NavLink href="/resume" onClick={() => setIsOpen(false)}>Resume</NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;