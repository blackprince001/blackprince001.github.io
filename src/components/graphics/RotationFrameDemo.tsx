"use client";

import { useState, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { FrameAxes, BODY_FRAME_COLORS, WORLD_FRAME_COLORS } from "./FrameAxes";
import { DemoSlider } from "@/components/ui/demo-slider";
import { InfoPanel, InfoCard } from "./demo-panel";
import { Latex, matrixTex } from "@/components/ui/latex";
import { Maximize2, Minimize2 } from "lucide-react";

// Compute rotation matrix from Euler angles (ZYX convention: yaw-pitch-roll)
function computeRotationMatrix(roll: number, pitch: number, yaw: number): number[][] {
  const cr = Math.cos(roll);
  const sr = Math.sin(roll);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);

  return [
    [cy * cp, cy * sp * sr - sy * cr, cy * sp * cr + sy * sr],
    [sy * cp, sy * sp * sr + cy * cr, sy * sp * cr - cy * sr],
    [-sp, cp * sr, cp * cr],
  ];
}

// Body frame is drawn offset from the world frame so both are legible
const BODY_FRAME_POSITION: [number, number, number] = [1.8, 1.8, 0];

export default function RotationFrameDemo() {
  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [yaw, setYaw] = useState(30);
  const [mode, setMode] = useState<"fixed" | "body">("fixed");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const R = useMemo(
    () =>
      computeRotationMatrix(
        (roll * Math.PI) / 180,
        (pitch * Math.PI) / 180,
        (yaw * Math.PI) / 180
      ),
    [roll, pitch, yaw]
  );

  // Compute determinant and check orthogonality
  const det = useMemo(() => {
    return R[0][0] * (R[1][1] * R[2][2] - R[1][2] * R[2][1])
         - R[0][1] * (R[1][0] * R[2][2] - R[1][2] * R[2][0])
         + R[0][2] * (R[1][0] * R[2][1] - R[1][1] * R[2][0]);
  }, [R]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 h-[100dvh] bg-zinc-950 flex flex-col overflow-y-auto overscroll-contain"
    : "my-8 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden flex flex-col";

  const canvasHeight = isFullscreen ? "h-[45vh] min-h-[280px] shrink-0" : "h-[450px]";

  const degrees = (v: number) => `${v}°`;

  return (
    <div className={containerClass}>
      {/* Controls - Always at top */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            3D Rotation Frame
          </h3>
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen rotation demo" : "Open rotation demo fullscreen"}
            aria-pressed={isFullscreen}
            className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <DemoSlider
            label={<span>Roll <Latex tex="(\hat{x})" /></span>}
            ariaLabel="Roll angle"
            value={roll}
            min={-180}
            max={180}
            onChange={setRoll}
            format={degrees}
          />
          <DemoSlider
            label={<span>Pitch <Latex tex="(\hat{y})" /></span>}
            ariaLabel="Pitch angle"
            value={pitch}
            min={-180}
            max={180}
            onChange={setPitch}
            format={degrees}
          />
          <DemoSlider
            label={<span>Yaw <Latex tex="(\hat{z})" /></span>}
            ariaLabel="Yaw angle"
            value={yaw}
            min={-180}
            max={180}
            onChange={setYaw}
            format={degrees}
          />
          <div>
            <label htmlFor="rotation-frame-mode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Frame Mode
            </label>
            <select
              id="rotation-frame-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as "fixed" | "body")}
              className="w-full h-10 px-3 text-sm bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-xl"
            >
              <option value="fixed">Fixed Frame (pre-multiply)</option>
              <option value="body">Body Frame (post-multiply)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3D Canvas - Center, takes most space */}
      <div className={`${canvasHeight} bg-gradient-to-b from-zinc-900 to-zinc-950 shrink-0`}>
        <Canvas camera={{ position: [4.2, -3.6, 2.6], up: [0, 0, 1], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, -5, 5]} intensity={0.8} />

          {/* Fixed world frame at the origin (gray, semi-transparent) */}
          <FrameAxes
            rotationMatrix={null}
            label="World {s}"
            scale={0.9}
            colors={WORLD_FRAME_COLORS}
            opacity={0.5}
            showLabels={true}
          />

          {/* Rotating body frame, offset from the world frame */}
          <FrameAxes
            rotationMatrix={R}
            position={BODY_FRAME_POSITION}
            label="Body {b}"
            scale={1}
            colors={BODY_FRAME_COLORS}
            showLabels={true}
          />

          <OrbitControls enablePan={false} target={[0.9, 0.9, 0]} />
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
          <InfoCard
            title={<>Rotation Matrix <Latex tex="R \in SO(3)" /></>}
            className="lg:col-span-2 overflow-x-auto"
          >
            <Latex display tex={`R_{sb} = ${matrixTex(R)}`} />
          </InfoCard>

          <InfoCard title="Properties">
            <div className="text-sm space-y-2">
              <p className="text-zinc-800 dark:text-zinc-200">
                <Latex tex="\det(R) = " />{" "}
                <span className={Math.abs(det - 1) < 0.001 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {det.toFixed(6)}
                </span>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-2">
                <strong>Mode:</strong> {mode === "fixed" ? "Fixed frame rotation" : "Body frame rotation"}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                {mode === "fixed" ? (
                  <>
                    <Latex tex="R" /> is applied relative to the world axes:{" "}
                    <Latex tex="R_{new} = R \, R_{old}" />
                  </>
                ) : (
                  <>
                    <Latex tex="R" /> is applied relative to the body axes:{" "}
                    <Latex tex="R_{new} = R_{old} \, R" />
                  </>
                )}
              </p>
            </div>
          </InfoCard>

          <InfoCard className="lg:col-span-3">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-600" />
                <span className="text-zinc-600 dark:text-zinc-400">
                  <Latex tex="\hat{x}" /> (Roll)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-600" />
                <span className="text-zinc-600 dark:text-zinc-400">
                  <Latex tex="\hat{y}" /> (Pitch)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-blue-600" />
                <span className="text-zinc-600 dark:text-zinc-400">
                  <Latex tex="\hat{z}" /> (Yaw)
                </span>
              </div>
            </div>
          </InfoCard>
        </div>
      </InfoPanel>
    </div>
  );
}
