"use client";

import React, { useCallback, useRef, useState } from "react";

interface DemoSliderProps {
  label: React.ReactNode;
  ariaLabel?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

// Short, quiet tick played while scrubbing, throttled so fast drags don't buzz
function useSliderTick() {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastRef = useRef(0);

  return useCallback(() => {
    const now = performance.now();
    if (now - lastRef.current < 45) return;
    lastRef.current = now;
    try {
      ctxRef.current ??= new AudioContext();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 1900;
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch {
      // no audio available; scrub silently
    }
  }, []);
}

// Scrubber-style slider: filled track, bar thumb, value chips, and a value
// bubble above the thumb while dragging
export function DemoSlider({
  label,
  ariaLabel,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
}: DemoSliderProps) {
  const [active, setActive] = useState(false);
  const tick = useSliderTick();
  const fmt = format ?? ((v: number) => `${v}`);
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-1.5 text-sm font-medium text-[var(--ink)]">
        {label}
      </div>
      <div className="relative">
        <div
          className={`pointer-events-none absolute -top-8 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--ink)] px-2 py-0.5 font-mono text-xs text-[var(--page)] shadow-md transition-opacity duration-150 ${
            active ? "opacity-100" : "opacity-0"
          }`}
          style={{ left: `${pct}%` }}
        >
          {fmt(value)}
        </div>
        <div className="relative h-10 overflow-hidden rounded-lg bg-[color-mix(in_srgb,var(--muted)_28%,transparent)]">
          <div
            className="absolute inset-y-0 left-0 bg-[var(--page)]"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute inset-y-1 z-10 w-[3px] rounded-full bg-[var(--ink)]"
            style={{ left: `calc(${pct}% - 1.5px)` }}
          />
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-[var(--ink)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--page)]">
            {fmt(value)}
          </span>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-[color-mix(in_srgb,var(--ink)_55%,transparent)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--page)]">
            {fmt(max)}
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
            onChange={(e) => {
              onChange(Number(e.target.value));
              tick();
            }}
            onPointerDown={() => setActive(true)}
            onPointerUp={() => setActive(false)}
            onPointerCancel={() => setActive(false)}
            className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          />
        </div>
      </div>
    </div>
  );
}

export default DemoSlider;
