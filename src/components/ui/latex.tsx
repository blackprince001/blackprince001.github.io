"use client";

import { useMemo } from "react";
import katex from "katex";

interface LatexProps {
  tex: string;
  display?: boolean;
  className?: string;
}

// Renders a raw TeX string with KaTeX
export function Latex({ tex, display = false, className }: LatexProps) {
  const html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: display }),
    [tex, display]
  );

  if (display) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

// Renders text containing $...$ (inline) and $$...$$ (display) math
export function RichText({ text }: { text: string }) {
  const rendered = useMemo(() => {
    try {
      return text
        .replace(/\$\$([^$]+)\$\$/g, (_, tex) =>
          katex.renderToString(tex, { throwOnError: false, displayMode: true })
        )
        .replace(/\$([^$]+)\$/g, (_, tex) =>
          katex.renderToString(tex, { throwOnError: false, displayMode: false })
        );
    } catch {
      return text;
    }
  }, [text]);

  return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
}

// Formats a number, snapping values that would print as "-0.000" to zero
function fmtNum(v: number, digits: number): string {
  const snapped = Math.abs(v) < 0.5 * 10 ** -digits ? 0 : v;
  return snapped.toFixed(digits);
}

// Builds a bmatrix TeX string from a numeric matrix
export function matrixTex(m: number[][], digits = 3): string {
  const rows = m
    .map((row) => row.map((v) => fmtNum(v, digits)).join(" & "))
    .join(" \\\\ ");
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

// Builds a column-vector TeX string shown as a transposed row
export function vectorTex(v: number[], digits = 3): string {
  return `\\begin{bmatrix} ${v.map((x) => fmtNum(x, digits)).join(" & ")} \\end{bmatrix}^{T}`;
}
