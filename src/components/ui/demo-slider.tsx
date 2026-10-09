"use client";

import { useId, type ReactNode } from "react";

interface DemoSliderProps {
  label: ReactNode;
  ariaLabel?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

export function DemoSlider({ label, ariaLabel, value, min, max, step = 1, onChange, format }: DemoSliderProps) {
  const id = useId();
  const formatValue = format ?? String;
  const formattedValue = formatValue(value);
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className="demo-slider">
      <label className="demo-slider__label" htmlFor={id}>{label}</label>
      <div className="demo-slider__track">
        <div className="demo-slider__fill" style={{ width: `${percent}%` }} />
        <div className="demo-slider__thumb" style={{ left: `calc(${percent}% - ${percent * 3 / 100}px)` }} />
        <output className="demo-slider__value" htmlFor={id}>{formattedValue}</output>
        <span className="demo-slider__max" aria-hidden="true">{formatValue(max)}</span>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={ariaLabel}
          aria-valuetext={formattedValue}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    </div>
  );
}

export default DemoSlider;
