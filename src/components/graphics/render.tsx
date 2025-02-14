"use client";

import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Mesh } from "three";
import { STLLoader } from 'three-stdlib';
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { StlViewer } from "react-stl-viewer";

interface RenderProp {
  url: string
}

const style = {
  top: 0,
  left: 0,
  height: "24rem",
  width: "54rem"
}

function STLRender(prop: RenderProp) {
  return (
    <div className="flex justify-center items-center max-w-2xl mx-auto border-solid border border-gray-600 rounded-lg">
      <StlViewer
        style={style}
        orbitControls
        shadows
        url={prop.url}
      />
    </div>
  );
}

// function STLMesh({ url }: RenderProp) {
//   const box = useRef<Mesh>(null);
//   const stl = useLoader(STLLoader, url); // Load STL model

//   // Center the model
//   useFrame(() => {
//     if (box.current) {
//       box.current.geometry.center();
//     }
//   });

//   return (
//     <mesh ref={box} scale={0.01}>
//       <primitive object={stl} position={[1, 1, 1]}/>
//       <meshStandardMaterial roughness={0.2} color={"#777"} />
//     </mesh>
//   );
// }

// function STLMeshRender(prop: RenderProp) {
//   return (
//     <div className="flex justify-center items-center w-auto h-96">
//       <Canvas flat linear className="border-solid border-2 border-gray-500 rounded-lg">
//         {/* Lighting */}
//         <ambientLight intensity={0.4} />
//         <pointLight position={[10, 10, 10]} intensity={1.2} />
//         <directionalLight position={[-5, 5, 5]} intensity={0.8} castShadow />
//         <Environment preset="sunset" background backgroundBlurriness={0.5} />
//         <OrbitControls />

//         <Suspense fallback={null}>
//           <STLMesh url={prop.url} />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }

function GLBMesh({ url }: RenderProp) {
  const box = useRef<Mesh>(null);
  const gltf = useGLTF(url); // Load GLTF model

  // Center the model
  useFrame(() => {
    if (box.current) {
      box.current.geometry?.center();
    }
  });

  return (
    <mesh ref={box} scale={0.7}>
      <primitive object={gltf.scene} />
      <meshStandardMaterial metalness={0.5} roughness={0.3} color={"#aaaaaa"} />
    </mesh>
  );
}

function GLBMeshRender(prop: RenderProp) {
  return (
    <div className="flex justify-center items-center max-w-2xl mx-auto">
      <Canvas flat linear className="border-solid border-2 border-gray-500 rounded-lg">
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-5, 5, 5]} intensity={0.8} castShadow />
        <Environment preset="city" />
        <OrbitControls />

        <Suspense fallback={null}>
          <GLBMesh url={prop.url} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function MeshRenderSwitch({ url }: RenderProp) {
  const isSTL = url.endsWith(".stl");

  return isSTL ? <STLRender url={url} /> : <GLBMeshRender url={url} />;
}

export default MeshRenderSwitch