import { TransformControls } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import {useCursor, useGLTF } from '@react-three/drei'
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg'
import { RigidBody } from '@react-three/rapier'
import { Parts,Part } from "./part.tsx";
import { BoxGeometry } from "three";
export default function Box({
  position,
  setIntersectionPoint,
  plane,
  running,
}) {
  const meshRef = useRef();
  const boxRef = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [run, setRun] = useState(false);
  const box = new BoxGeometry(1,1,1);
  useCursor(hovered)


  return (
    // <TransformControls object={meshRef}>
    <group position={position}>
        {!active ? (
          <RigidBody colliders="hull" type="fixed">
            <mesh
        geometry={box}
        ref={meshRef}
        scale={active ? 1.5 : 1}
onPointerMove={()=>{if(running)setActive(true)}}
        onPointerOver={(event) => {
          setHover(true);
          setIntersectionPoint(event.point);
        }}
        onPointerOut={(event) => {
          setHover(false);
        }}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      </mesh>
          </RigidBody>
        ) : (
          <Parts>
            <Geometry>
              <Base geometry={box} position={[0, 0, 0]} />
              <Subtraction>
                <Geometry>
                  <Base position={[0, 1, 0]} rotation={[Math.PI / 4, -Math.PI / 4, 0]}>
                    <boxGeometry args={[1000, 0.02, 1000]} />
                  </Base>
                  <Addition position={[0, 1, 0]} rotation={[Math.PI / 4, -Math.PI / 4, 0]}>
                    <boxGeometry args={[1000, 1000, 0.02]} />
                  </Addition>
                </Geometry>
              </Subtraction>
            </Geometry>
            <Part>
              {(geometry, index) => (
                <RigidBody key={index} colliders="hull">
                  <mesh castShadow receiveShadow geometry={geometry}>
                    <meshStandardMaterial color={Math.random() * 0xffffff} />
                  </mesh>
                </RigidBody>
              )}
            </Part>
          </Parts>
        )}
      </group>
      
    // </TransformControls>
  );
}
