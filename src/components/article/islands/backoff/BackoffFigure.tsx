import { useEffect, useRef } from "react";
import { mountClassic, mountLag, mountLoad, mountPayments, mountShapes } from "./backoff-figures.js";
import "./backoff-figures.css";

const MOUNTS = {
  classic: mountClassic,
  payments: mountPayments,
  lag: mountLag,
  load: mountLoad,
  shapes: mountShapes,
} as const;

export type BackoffFigureName = keyof typeof MOUNTS;

export function BackoffFigure({ figure }: { figure: BackoffFigureName }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return MOUNTS[figure](ref.current);
  }, [figure]);
  return <div ref={ref} className="bk" />;
}
