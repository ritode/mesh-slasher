import Box from "./Box";
import { useRef, useState } from "react";
import { Plane, Bvh } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3, Euler, BoxGeometry } from "three";
import { Physics, CuboidCollider } from "@react-three/rapier";
import Monkey from "./Monkey";
import LoopyObject from "./Torus";

export default function Scene({ point1, point2, running }) {
  // console.log(point1, point2);

  // const planeRef = useRef(null);
  // useFrame(({ camera }) => {
  //   planeRef.current.lookAt(camera.position);
  //   planeRef.current.rotation.y = Math.PI / 4;
  // });
  const [intersectionPoint, setIntersectionPoint] = useState(
    new Vector3(-2, -1.25, 0)
  );
  return (
    <>
      {/* <Plane args={[0.5, 2.5]} position={intersectionPoint} ref={planeRef} /> */}
      <Physics timeStep="vary" gravity={[0, -25, 0]}>
        <Box position={[0, 0, 0]} running={running} />
        {/* <Box position={[2, 0, 0]} running={running} />
        <Box position={[-2, 0, 0]} running={running} /> */}
        {/* <Box position={[0, 2, 0]} running={running} />
        <Box position={[0, -2, 0]} running={running} /> */}
        {/* <Monkey
          position={[-1.25, 0.25, 0]}
          rotation={[-0.5, 1, 0]}
          running={running}
        />
        <Monkey
          position={[0.8, 0.25, 0.25]}
          rotation={[-0.5, -0.5, 0]}
          running={running}
        />
        <Monkey
          position={[0.5, 1, -0.5]}
          rotation={[0, 0, 0.5]}
          running={running}
        />
        <Monkey
          position={[0, 2, 0]}
          rotation={[-0.5, 0.5, 0.5]}
          running={running}
        />
        <LoopyObject position={[2, -1, 0]} running={running} /> */}
        <CuboidCollider
          args={[10, 0.1, 10]}
          type="fixed"
          position={[0, -2.5, 0]}
        />
      </Physics>
      <mesh
        receiveShadow
        scale={[100, 100, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.5, 0]}
      >
        <planeGeometry />
        <shadowMaterial />
      </mesh>
    </>
  );
}
