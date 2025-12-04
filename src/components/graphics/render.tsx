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



function STLRender(prop: RenderProp) {
  return (
    <div className="flex justify-center items-center w-full my-8">
      <StlViewer
        style={{
          top: 0,
          left: 0,
          height: "600px",
          width: "100%",
          maxWidth: "1000px"
        }}
        orbitControls
        shadows
        url={prop.url}
        groundColor="#2a2a2a"
        gridLineColor="#888888"
        showGrid
        modelColor="#aaaaaa"
        backgroundColor="transparent"
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
    if (box.current)
    {
      box.current.geometry?.center();
    }
  });

  // Enable shadows on all meshes
  gltf.scene.traverse((child) => {
    if ((child as any).isMesh)
    {
      (child as any).castShadow = true;
      (child as any).receiveShadow = true;
    }
  });

  return (
    <mesh ref={box} scale={0.7} position={[0, 1, 0]}>
      <primitive object={gltf.scene} />
    </mesh>
  );
}

function GLBMeshRender(prop: RenderProp) {
  return (
    <div className="flex justify-center items-center w-full my-8">
      <Canvas
        flat
        linear
        className="border-solid border-2 border-gray-500 rounded-lg"
        style={{ height: '600px', width: '100%', maxWidth: '1000px' }}
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
      >
        {/* Lighting - MuJoCo style */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        {/* Ground Plane with Grid */}
        <gridHelper args={[20, 20, '#888888', '#444444']} position={[0, 0, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>

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