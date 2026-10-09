"use client";

import React, { useEffect, useId, useState } from "react";
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
  const [collapsed, setCollapsed] = useState(true);
  const detailsId = useId();

  useEffect(() => {
    if (isFullscreen) setCollapsed(true);
  }, [isFullscreen]);

  return (
    <div className="demo-details">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="demo-details__toggle"
        aria-expanded={!collapsed}
        aria-controls={detailsId}
      >
        {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {collapsed ? "Show details" : "Hide details"}
      </button>
      <div id={detailsId} hidden={collapsed} className={`demo-details__body ${isFullscreen ? "demo-details__body--fullscreen" : ""}`}>
        {children}
      </div>
    </div>
  );
}

// A formula or explanation in the shared details panel.
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
      className={`demo-card ${className}`}
    >
      {title && (
        <h4 className="demo-card__title">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}
