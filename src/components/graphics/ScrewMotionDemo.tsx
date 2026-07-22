"use client";

import { useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Line } from "@react-three/drei";
import { FrameAxes, BODY_FRAME_COLORS, WORLD_FRAME_COLORS } from "./FrameAxes";
import { DemoSlider } from "@/components/ui/demo-slider";
import { InfoPanel, InfoCard } from "./demo-panel";
import { Latex, matrixTex, vectorTex } from "@/components/ui/latex";
import { Maximize2, Minimize2, Play, Pause } from "lucide-react";
import { useDemoFullscreen } from "./use-demo-fullscreen";
import { createPortal } from "react-dom";

// Compute screw transformation matrix
function screwTransform(
  axis: [number, number, number],
  point: [number, number, number],
  theta: number,
  pitch: number
): { R: number[][]; p: [number, number, number]; T: number[][] } {
  const [wx, wy, wz] = axis;
  const [qx, qy, qz] = point;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const t = 1 - c;

  // Skew symmetric matrix [ω̂]
  const skew = [
    [0, -wz, wy],
    [wz, 0, -wx],
    [-wy, wx, 0],
  ];

  // [ω̂]² = ωωᵀ - I (for unit axis)
  const skewSq = [
    [-(wy * wy + wz * wz), wx * wy, wx * wz],
    [wx * wy, -(wx * wx + wz * wz), wy * wz],
    [wx * wz, wy * wz, -(wx * wx + wy * wy)],
  ];

  // Rotation matrix: R = I + s*[ω̂] + t*[ω̂]²
  const R: number[][] = [
    [1 + s * skew[0][0] + t * skewSq[0][0], s * skew[0][1] + t * skewSq[0][1], s * skew[0][2] + t * skewSq[0][2]],
    [s * skew[1][0] + t * skewSq[1][0], 1 + s * skew[1][1] + t * skewSq[1][1], s * skew[1][2] + t * skewSq[1][2]],
    [s * skew[2][0] + t * skewSq[2][0], s * skew[2][1] + t * skewSq[2][1], 1 + s * skew[2][2] + t * skewSq[2][2]],
  ];

  // Translation: p = (I - R)q + hθω
  const p: [number, number, number] = [
    (1 - R[0][0]) * qx - R[0][1] * qy - R[0][2] * qz + pitch * theta * wx,
    -R[1][0] * qx + (1 - R[1][1]) * qy - R[1][2] * qz + pitch * theta * wy,
    -R[2][0] * qx - R[2][1] * qy + (1 - R[2][2]) * qz + pitch * theta * wz,
  ];

  // Homogeneous transformation matrix
  const T: number[][] = [
    [R[0][0], R[0][1], R[0][2], p[0]],
    [R[1][0], R[1][1], R[1][2], p[1]],
    [R[2][0], R[2][1], R[2][2], p[2]],
    [0, 0, 0, 1],
  ];

  return { R, p, T };
}

// Screw axis visualization
function ScrewAxis({
  axis,
  point,
}: {
  axis: [number, number, number];
  point: [number, number, number];
}) {
  const axisLine = useMemo(() => {
    const length = 3;
    return [
      [point[0] - axis[0] * length, point[1] - axis[1] * length, point[2] - axis[2] * length],
      [point[0] + axis[0] * length, point[1] + axis[1] * length, point[2] + axis[2] * length],
    ] as [number, number, number][];
  }, [axis, point]);

  return (
    <>
      {/* Screw axis line */}
      <Line points={axisLine} color="#fbbf24" lineWidth={3} />

      {/* Point q on axis */}
      <mesh position={point}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Arrow head */}
      <mesh position={[point[0] + axis[0] * 2.5, point[1] + axis[1] * 2.5, point[2] + axis[2] * 2.5]}>
        <coneGeometry args={[0.1, 0.25, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </>
  );
}

// Animated scene inside Canvas
function Scene({
  axis,
  point,
  thetaRad,
  pitch,
  animate,
}: {
  axis: [number, number, number];
  point: [number, number, number];
  thetaRad: number;
  pitch: number;
  animate: boolean;
}) {
  const animRef = useRef(0);
  const [progress, setProgress] = useState(1);

  useFrame(() => {
    if (animate) {
      animRef.current += 0.008;
      if (animRef.current >= 1) {
        animRef.current = 0;
      }
      setProgress(animRef.current);
    } else {
      setProgress(1);
    }
  });

  const currentTheta = thetaRad * progress;
  const { R, p } = useMemo(
    () => screwTransform(axis, point, currentTheta, pitch),
    [axis, point, currentTheta, pitch]
  );

  return (
    <>
      {/* Fixed frame */}
      <FrameAxes
        rotationMatrix={null}
        label="World {s}"
        scale={0.75}
        colors={WORLD_FRAME_COLORS}
        opacity={0.35}
        showLabels={false}
      />

      {/* Screw axis */}
      <ScrewAxis axis={axis} point={point} />

      {/* Transformed frame */}
      <FrameAxes
        rotationMatrix={R}
        position={p}
        label="Body {b}"
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
    </>
  );
}

export default function ScrewMotionDemo() {
  const [theta, setTheta] = useState(90);
  const [pitch, setPitch] = useState(0.5);
  const [animate, setAnimate] = useState(false);
  const { containerRef, isFullscreen, isFallbackFullscreen, toggleFullscreen } = useDemoFullscreen();

  const thetaRad = (theta * Math.PI) / 180;
  const axis: [number, number, number] = useMemo(() => [0, 0, 1], []); // Z-axis screw
  const point: [number, number, number] = useMemo(() => [0.5, 0, 0], []); // Point on screw axis

  const { T } = useMemo(
    () => screwTransform(axis, point, thetaRad, pitch),
    [axis, point, thetaRad, pitch]
  );

  const containerClass = isFullscreen
    ? "fixed inset-0 z-[1000] h-[100dvh] w-full bg-[var(--page)] text-[var(--ink)] flex flex-col overflow-y-auto overscroll-contain"
    : "my-8 rounded-lg bg-[var(--page)] text-[var(--ink)] overflow-hidden flex flex-col shadow-[0_0.6rem_2rem_rgb(0_0_0/0.08)]";

  const canvasHeight = isFullscreen ? "h-[45vh] min-h-[280px] shrink-0" : "h-[450px]";

  // Determine motion type
  const motionType = pitch === 0
    ? "Pure Rotation (h = 0)"
    : pitch >= 1.5
    ? "Approaching Pure Translation"
    : `Combined Motion (h = ${pitch.toFixed(2)})`;

  const demo = (
    <div ref={containerRef} className={containerClass}>
      {/* Controls - Top */}
      <div className="bg-[var(--surface)] p-4 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[length:var(--heading-3)] font-[var(--heading-weight-3)] text-[var(--ink)]">
            Screw Motion Visualization
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAnimate(!animate)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                animate
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {animate ? <Pause size={16} /> : <Play size={16} />}
              {animate ? "Stop" : "Animate"}
            </button>
            <button
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen screw motion demo" : "Open screw motion demo fullscreen"}
              aria-pressed={isFullscreen}
              className="p-2 rounded-lg bg-[var(--page)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <DemoSlider
            label={<span>Rotation <Latex tex="\theta" /></span>}
            ariaLabel="Screw rotation angle"
            value={theta}
            min={0}
            max={360}
            onChange={setTheta}
            format={(v) => `${v}°`}
          />
          <DemoSlider
            label={<span>Pitch <Latex tex="h" /></span>}
            ariaLabel="Screw pitch"
            value={pitch}
            min={0}
            max={2}
            step={0.1}
            onChange={setPitch}
            format={(v) => v.toFixed(2)}
          />
          <div className="flex items-end pb-2">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <strong>Type:</strong> {motionType}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas - Center */}
      <div className={`${canvasHeight} bg-[var(--surface)] shrink-0`}>
        <Canvas camera={{ position: [3.6, -3.6, 2.6], up: [0, 0, 1], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, -5, 5]} intensity={0.8} />
          <Scene
            axis={axis}
            point={point}
            thetaRad={thetaRad}
            pitch={pitch}
            animate={animate}
          />
        </Canvas>
      </div>

      {/* Information Panel - Bottom */}
      <InfoPanel isFullscreen={isFullscreen}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <InfoCard
            title={<>Homogeneous Transform <Latex tex="T \in SE(3)" /></>}
            className="lg:col-span-2 overflow-x-auto"
          >
            <Latex display tex={`T = ${matrixTex(T)}`} />
          </InfoCard>

          <InfoCard title="Screw Parameters">
            <div className="text-sm space-y-1.5">
              <p className="text-zinc-800 dark:text-zinc-200">
                <strong>Axis:</strong>{" "}
                <Latex tex={`\\hat{\\omega} = ${vectorTex(axis, 2)}`} />
              </p>
              <p className="text-zinc-800 dark:text-zinc-200">
                <strong>Point:</strong>{" "}
                <Latex tex={`q = ${vectorTex(point, 2)}`} />
              </p>
              <p className="text-zinc-800 dark:text-zinc-200">
                <strong>Angle:</strong>{" "}
                <Latex tex={`\\theta = ${theta}^{\\circ} = ${thetaRad.toFixed(3)} \\text{ rad}`} />
              </p>
              <p className="text-zinc-800 dark:text-zinc-200">
                <strong>Pitch:</strong> <Latex tex={`h = ${pitch.toFixed(2)}`} />
              </p>
              <p className="text-zinc-800 dark:text-zinc-200">
                <strong>Translation:</strong>{" "}
                <Latex tex={`h\\theta = ${(pitch * thetaRad).toFixed(3)}`} />
              </p>
            </div>
          </InfoCard>

          <InfoCard className="lg:col-span-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              The screw axis passes through point <Latex tex="q" /> with direction{" "}
              <Latex tex="\hat{\omega}" />. The body rotates by <Latex tex="\theta" /> while
              translating <Latex tex="h\theta" /> along the axis.
            </p>
          </InfoCard>
        </div>
      </InfoPanel>
    </div>
  );

  return isFallbackFullscreen ? createPortal(demo, document.body) : demo;
}
