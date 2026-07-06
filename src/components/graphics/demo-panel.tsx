"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Bottom information panel for the 3D demos. Collapsible so the canvas gets
// the room in fullscreen; starts collapsed when entering fullscreen.
export function InfoPanel({
  isFullscreen,
  children,
}: {
  isFullscreen: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (isFullscreen) setCollapsed(true);
  }, [isFullscreen]);

  return (
    <div className="shrink-0 border-t border-zinc-200/50 bg-zinc-100 dark:border-zinc-800/50 dark:bg-zinc-900/40">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {collapsed ? "Show details" : "Hide details"}
      </button>
      {!collapsed && (
        <div
          className={`overflow-auto p-4 pt-0 md:p-6 md:pt-0 ${
            isFullscreen ? "max-h-[40vh]" : ""
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// One cell of the bento grid: muted background, outline only.
export function InfoCard({
  title,
  children,
  className = "",
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-300/60 bg-zinc-50/60 p-4 dark:border-zinc-700/60 dark:bg-zinc-900/30 ${className}`}
    >
      {title && (
        <h4 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}
