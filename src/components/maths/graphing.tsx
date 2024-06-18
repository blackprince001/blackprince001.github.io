"use client";

import * as React from "react"
import { Mafs, Coordinates, Plot, Theme, useMovablePoint } from "mafs"

export function InequalitiesExample() {
  const a = useMovablePoint([0, -1])

  return (
    <Mafs>
      <Coordinates.Cartesian />

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
  )
}

export function HelloFx() {
  return (
    <Mafs>
        <Coordinates.Cartesian subdivisions={4} />
        <Plot.OfX y={(x) => 2 * Math.tan(x)} />
    </Mafs>
  )
}
