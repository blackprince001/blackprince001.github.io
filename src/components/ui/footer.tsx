'use client'

import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full py-12 border-t border-border mt-12">
      <div className="max-w-5xl mx-auto px-5 lg:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-sm text-muted-foreground font-serif">
          &copy; {new Date().getFullYear()} blackprince. All rights reserved.
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm font-sans">
          <Link href="mailto:appiahboaduprince@gmail.com" className="hover:underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors">
            Email
          </Link>
          <Link href="https://x.com/0xed8" target="_blank" className="hover:underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors">
            X (Twitter)
          </Link>
          <Link href="https://github.com/blackprince001" target="_blank" className="hover:underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </Link>
          <Link href="https://www.linkedin.com/in/pkab23/" target="_blank" className="hover:underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;