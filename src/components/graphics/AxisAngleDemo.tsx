"use client";

import { useState, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Line } from "@react-three/drei";
import { FrameAxes, BODY_FRAME_COLORS, WORLD_FRAME_COLORS } from "./FrameAxes";
import { DemoSlider } from "@/components/ui/demo-slider";
import { InfoPanel, InfoCard } from "./demo-panel";
import { Latex, matrixTex, vectorTex } from "@/components/ui/latex";
import { Maximize2, Minimize2 } from "lucide-react";

// Skew-symmetric matrix [ω̂] of a unit axis
function skewMatrix([wx, wy, wz]: [number, number, number]): number[][] {
  return [
    [0, -wz, wy],
    [wz, 0, -wx],
    [-wy, wx, 0],
  ];
}

// Compute Rodrigues' formula: R = I + sin(θ)[ω̂] + (1-cos(θ))[ω̂]²
function rodriguesFormula(axis: [number, number, number], theta: number): number[][] {
  const [wx, wy, wz] = axis;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const t = 1 - c;

  const skew = skewMatrix(axis);

  // [ω̂]² = ωωᵀ - I (for unit axis)
  const skewSq = [
    [-(wy * wy + wz * wz), wx * wy, wx * wz],
    [wx * wy, -(wx * wx + wz * wz), wy * wz],
    [wx * wz, wy * wz, -(wx * wx + wy * wy)],
  ];

  // R = I + s*[ω̂] + t*[ω̂]²
  return [
    [1 + s * skew[0][0] + t * skewSq[0][0], s * skew[0][1] + t * skewSq[0][1], s * skew[0][2] + t * skewSq[0][2]],
    [s * skew[1][0] + t * skewSq[1][0], 1 + s * skew[1][1] + t * skewSq[1][1], s * skew[1][2] + t * skewSq[1][2]],
    [s * skew[2][0] + t * skewSq[2][0], s * skew[2][1] + t * skewSq[2][1], 1 + s * skew[2][2] + t * skewSq[2][2]],
  ];
}

// Rotation axis visualization
function RotationAxis({ axis }: { axis: [number, number, number] }) {
  const points = useMemo(() => {
    const [wx, wy, wz] = axis;
    const length = 2.5;
    return [
      [-wx * length, -wy * length, -wz * length],
      [wx * length, wy * length, wz * length],
    ] as [number, number, number][];
  }, [axis]);

  return (
    <>
      {/* Main axis line */}
      <Line points={points} color="#fbbf24" lineWidth={3} opacity={0.8} />

      {/* Arrow head at positive end */}
      <mesh position={[axis[0] * 2.3, axis[1] * 2.3, axis[2] * 2.3]}>
        <coneGeometry args={[0.12, 0.3, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </>
  );
}

export default function AxisAngleDemo() {
  const [theta, setTheta] = useState(60);
  const [axisX, setAxisX] = useState(0);
  const [axisY, setAxisY] = useState(0);
  const [axisZ, setAxisZ] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Normalize the axis
  const axis = useMemo(() => {
    const mag = Math.sqrt(axisX * axisX + axisY * axisY + axisZ * axisZ);
    if (mag < 0.001) return [0, 0, 1] as [number, number, number];
    return [axisX / mag, axisY / mag, axisZ / mag] as [number, number, number];
  }, [axisX, axisY, axisZ]);

  const thetaRad = (theta * Math.PI) / 180;
  const R = useMemo(() => rodriguesFormula(axis, thetaRad), [axis, thetaRad]);
  const skew = useMemo(() => skewMatrix(axis), [axis]);

  // Exponential coordinates
  const expCoords = useMemo(() => [
    axis[0] * thetaRad,
    axis[1] * thetaRad,
    axis[2] * thetaRad,
  ], [axis, thetaRad]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 h-[100dvh] bg-[var(--page)] text-[var(--ink)] flex flex-col overflow-y-auto overscroll-contain"
    : "my-8 rounded-lg bg-[var(--page)] text-[var(--ink)] overflow-hidden flex flex-col shadow-[0_0.6rem_2rem_rgb(0_0_0/0.08)]";

  const canvasHeight = isFullscreen ? "h-[45vh] min-h-[280px] shrink-0" : "h-[450px]";

  // Preset handlers
  const presets = [
    { name: "X-axis", x: 1, y: 0, z: 0, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
    { name: "Y-axis", x: 0, y: 1, z: 0, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
    { name: "Z-axis", x: 0, y: 0, z: 1, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { name: "XY", x: 1, y: 1, z: 0, color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
    { name: "XYZ", x: 1, y: 1, z: 1, color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
  ];

  return (
    <div className={containerClass}>
      {/* Controls - Top */}
      <div className="bg-[var(--surface)] p-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--ink)]">
            Axis-Angle to Rotation Matrix
          </h3>
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen axis-angle demo" : "Open axis-angle demo fullscreen"}
            aria-pressed={isFullscreen}
            className="p-2 rounded-lg bg-[var(--page)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 pt-2">
          <DemoSlider
            label={<span>Angle <Latex tex="\theta" /></span>}
            ariaLabel="Rotation angle"
            value={theta}
            min={0}
            max={360}
            onChange={setTheta}
            format={(v) => `${v}°`}
          />
          <DemoSlider
            label={<span>Axis <Latex tex="\omega_x" /></span>}
            ariaLabel="Rotation axis x component"
            value={axisX}
            min={-1}
            max={1}
            step={0.1}
            onChange={setAxisX}
            format={(v) => v.toFixed(2)}
          />
          <DemoSlider
            label={<span>Axis <Latex tex="\omega_y" /></span>}
            ariaLabel="Rotation axis y component"
            value={axisY}
            min={-1}
            max={1}
            step={0.1}
            onChange={setAxisY}
            format={(v) => v.toFixed(2)}
          />
          <DemoSlider
            label={<span>Axis <Latex tex="\omega_z" /></span>}
            ariaLabel="Rotation axis z component"
            value={axisZ}
            min={-1}
            max={1}
            step={0.1}
            onChange={setAxisZ}
            format={(v) => v.toFixed(2)}
          />
        </div>

        {/* Presets */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Presets:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => { setAxisX(p.x); setAxisY(p.y); setAxisZ(p.z); }}
              className={`px-3 py-1 text-xs rounded-full hover:opacity-80 transition-opacity ${p.color}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas - Center */}
      <div className={`${canvasHeight} bg-[var(--surface)] shrink-0`}>
        <Canvas camera={{ position: [3.4, -3.4, 2.4], up: [0, 0, 1], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, -5, 5]} intensity={0.8} />

          {/* Original frame (gray, transparent) */}
          <FrameAxes
            rotationMatrix={null}
            label="Original"
            scale={0.85}
            colors={WORLD_FRAME_COLORS}
            opacity={0.35}
            showLabels={false}
          />

          {/* Rotation axis */}
          <RotationAxis axis={axis} />

          {/* Rotated frame */}
          <FrameAxes
            rotationMatrix={R}
            label="Rotated"
            scale={1}
            colors={BODY_FRAME_COLORS}
            showLabels={true}
          />

          <OrbitControls enablePan={false} />
          <Grid
            args={[10, 10]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#404040"
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#505050"
            fadeDistance={12}
            fadeStrength={1}
            followCamera={false}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, -0.01]}
          />
        </Canvas>
      </div>

      {/* Information Panel - Bottom */}
      <InfoPanel isFullscreen={isFullscreen}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <InfoCard title="Rodrigues' Formula" className="lg:col-span-3 overflow-x-auto">
            <Latex display tex="R = e^{[\hat{\omega}]\theta} = I + \sin\theta \, [\hat{\omega}] + (1 - \cos\theta)\,[\hat{\omega}]^2" />
          </InfoCard>

          <InfoCard title="Rotation Matrix" className="overflow-x-auto">
            <Latex display tex={`R = ${matrixTex(R)}`} />
          </InfoCard>

          <InfoCard title="Skew-Symmetric Matrix" className="overflow-x-auto">
            <Latex display tex={`[\\hat{\\omega}] = ${matrixTex(skew, 2)}`} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              <Latex tex="[\hat{\omega}]" /> is the cross product{" "}
              <Latex tex="\hat{\omega} \times (\cdot)" /> written as a matrix.
            </p>
          </InfoCard>

          <InfoCard title="Exponential Coordinates" className="overflow-x-auto">
            <Latex display tex={`\\hat{\\omega}\\theta = ${vectorTex(expCoords)}`} />
            <div className="mt-3 text-xs space-y-1">
              <p className="text-zinc-600 dark:text-zinc-400">
                <strong>Unit axis:</strong>{" "}
                <Latex tex={`\\hat{\\omega} = ${vectorTex(axis)}`} />
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                <strong>Rotation:</strong>{" "}
                <Latex tex={`\\theta = ${theta}^{\\circ} = ${thetaRad.toFixed(3)} \\text{ rad}`} />
              </p>
            </div>
          </InfoCard>
        </div>
      </InfoPanel>
    </div>
  );
}
