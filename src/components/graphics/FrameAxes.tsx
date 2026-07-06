"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Billboard, Text } from "@react-three/drei";

export interface FrameAxesProps {
  rotationMatrix?: number[][] | null;
  position?: [number, number, number];
  scale?: number;
  label?: string;
  colors?: { x: string; y: string; z: string };
  opacity?: number;
  showLabels?: boolean;
  axisLength?: number;
}

/**
 * A properly rendered coordinate frame with X, Y, Z axes meeting at the origin.
 * Uses standard robotics convention: Red=X, Green=Y, Blue=Z (RGB-XYZ)
 * Axes are drawn as cylinders with cone arrowheads, meeting cleanly at origin.
 */
export function FrameAxes({
  rotationMatrix,
  position = [0, 0, 0],
  scale = 1,
  label = "",
  colors = { x: "#dc2626", y: "#16a34a", z: "#2563eb" }, // Red, Green, Blue
  opacity = 1,
  showLabels = true,
  axisLength = 1.0,
}: FrameAxesProps) {
  const shaftRadius = 0.025 * scale;
  const headRadius = 0.08 * scale;
  const headLength = 0.18 * scale;
  const shaftLength = axisLength * scale - headLength;

  // Convert rotation matrix to Euler for Three.js
  const euler = useMemo(() => {
    if (!rotationMatrix) return [0, 0, 0];
    const matrix = new THREE.Matrix4();
    matrix.set(
      rotationMatrix[0][0], rotationMatrix[0][1], rotationMatrix[0][2], 0,
      rotationMatrix[1][0], rotationMatrix[1][1], rotationMatrix[1][2], 0,
      rotationMatrix[2][0], rotationMatrix[2][1], rotationMatrix[2][2], 0,
      0, 0, 0, 1
    );
    const e = new THREE.Euler();
    e.setFromRotationMatrix(matrix);
    return [e.x, e.y, e.z];
  }, [rotationMatrix]);

  return (
    <group position={position} rotation={euler as unknown as THREE.Euler}>
      {/* X-axis (Red) - pointing in +X direction */}
      <group>
        {/* Shaft along X */}
        <mesh position={[shaftLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={colors.x} transparent opacity={opacity} />
        </mesh>
        {/* Arrow head at tip */}
        <mesh position={[shaftLength + headLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[headRadius, headLength, 16]} />
          <meshStandardMaterial color={colors.x} transparent opacity={opacity} />
        </mesh>
        {/* Label */}
        {showLabels && (
          <Billboard position={[axisLength * scale + 0.2, 0, 0]}>
            <Text
              fontSize={0.18 * scale}
              color={colors.x}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              X
            </Text>
          </Billboard>
        )}
      </group>

      {/* Y-axis (Green) - pointing in +Y direction */}
      <group>
        {/* Shaft along Y */}
        <mesh position={[0, shaftLength / 2, 0]}>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={colors.y} transparent opacity={opacity} />
        </mesh>
        {/* Arrow head at tip */}
        <mesh position={[0, shaftLength + headLength / 2, 0]}>
          <coneGeometry args={[headRadius, headLength, 16]} />
          <meshStandardMaterial color={colors.y} transparent opacity={opacity} />
        </mesh>
        {/* Label */}
        {showLabels && (
          <Billboard position={[0, axisLength * scale + 0.2, 0]}>
            <Text
              fontSize={0.18 * scale}
              color={colors.y}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              Y
            </Text>
          </Billboard>
        )}
      </group>

      {/* Z-axis (Blue) - pointing in +Z direction */}
      <group>
        {/* Shaft along Z */}
        <mesh position={[0, 0, shaftLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
          <meshStandardMaterial color={colors.z} transparent opacity={opacity} />
        </mesh>
        {/* Arrow head at tip */}
        <mesh position={[0, 0, shaftLength + headLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[headRadius, headLength, 16]} />
          <meshStandardMaterial color={colors.z} transparent opacity={opacity} />
        </mesh>
        {/* Label */}
        {showLabels && (
          <Billboard position={[0, 0, axisLength * scale + 0.2]}>
            <Text
              fontSize={0.18 * scale}
              color={colors.z}
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              Z
            </Text>
          </Billboard>
        )}
      </group>

      {/* Origin sphere */}
      <mesh>
        <sphereGeometry args={[shaftRadius * 1.5, 16, 16]} />
        <meshStandardMaterial color="#888888" transparent opacity={opacity} />
      </mesh>

      {/* Frame label — offset below the origin (Z-up scenes) */}
      {label && (
        <Billboard position={[0, 0, -0.4 * scale]}>
          <Text
            fontSize={0.22 * scale}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {label}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

// Default world/reference frame colors (grayed out)
export const WORLD_FRAME_COLORS = { x: "#e6d70c", y: "#e6d70c", z: "#e6d70c" };

// Standard body frame colors (RGB)
export const BODY_FRAME_COLORS = { x: "#dc2626", y: "#16a34a", z: "#2563eb" };

export default FrameAxes;
