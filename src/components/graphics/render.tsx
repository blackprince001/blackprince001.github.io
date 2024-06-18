"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Mesh } from "three";
import { OrbitControls, useGLTF } from "@react-three/drei";

interface RenderProp {
    url: string
}

function MeshRender(prop: RenderProp) {
  const box = useRef<Mesh>(null);
  const gltf = useGLTF(prop.url);

  return (
    <div className='flex justify-center items-center w-auto h-96'>
      <Canvas flat linear className="border-solid border-2 border-[#63cc79] rounded-lg">
        <ambientLight intensity={1} />
        <OrbitControls />
        <pointLight position={[10, 10, 10]} />
            <mesh ref={box}>
                <primitive object={gltf.scene} />
                <meshStandardMaterial attach="material" color={'orange'} />
            </mesh>
      </Canvas>
    </div>
  );

}

export default MeshRender;