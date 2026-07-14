"use client";

import * as React from "react"
import { Mafs, Coordinates, Plot, Theme, useMovablePoint } from "mafs"
import "mafs/core.css"

function GraphFrame({ title, description, interactive = false, children }: { title: string; description: string; interactive?: boolean; children: React.ReactNode }) {
  return (
    <figure className="math-graph" aria-label={`${title}. ${description}`}>
      <figcaption className="math-graph__header">
        <span>{title}</span>
        <span>{interactive ? "Drag the point to explore" : description}</span>
      </figcaption>
      <div className="math-graph__canvas">{children}</div>
      {interactive && <p className="math-graph__description">{description}</p>}
    </figure>
  )
}

export function InequalitiesExample() {
  const a = useMovablePoint([0, -1])

  return (
    <GraphFrame title="Intersecting inequalities" description="The shaded regions update as the movable point changes both inequalities." interactive>
      <Mafs height={360}>
        <Coordinates.Cartesian subdivisions={4} />

      <Plot.Inequality
        x={{
          "<=": (y) => Math.cos(y + a.y) - a.x,
          ">": (y) => Math.sin(y - a.y) + a.x,
        }}
        color={Theme.blue}
      />

      <Plot.Inequality
        y={{
          "<=": (x) => Math.cos(x + a.x) - a.y,
          ">": (x) => Math.sin(x - a.x) + a.y,
        }}
        color={Theme.green}
      />

      {a.element}
      </Mafs>
    </GraphFrame>
  )
}

export function HelloFx() {
  return (
    <GraphFrame title="Tangent function" description="The graph of y = 2 tan(x).">
      <Mafs height={360} viewBox={{ x: [-Math.PI, Math.PI], y: [-6, 6] }}>
        <Coordinates.Cartesian subdivisions={4} />
        <Plot.OfX y={(x) => 2 * Math.tan(x)} color={Theme.blue} />
      </Mafs>
    </GraphFrame>
  )
}

export function Sigmoid() {
  return (
    <GraphFrame title="Sigmoid function" description="The logistic curve maps every real input to a value between zero and one.">
      <Mafs height={340} viewBox={{ x: [-6, 6], y: [-0.2, 1.2], padding: 0.4 }}>
      <Coordinates.Cartesian subdivisions={4}/>
        <Plot.OfX y={(x) => 1 / (1 + Math.exp(-x))} color={Theme.blue} />
      </Mafs>
    </GraphFrame>
  )
}
