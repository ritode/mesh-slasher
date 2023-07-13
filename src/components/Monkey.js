
import {useCursor, useGLTF } from '@react-three/drei'
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg'
import { RigidBody } from '@react-three/rapier'
import { Parts,Part } from "./part.tsx";
import { useState, useEffect } from 'react';
export default function Monkey({position,rotation,running}) {
    const { nodes } = useGLTF('./models/model.gltf')
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)

    useCursor(hovered)
    return (
      <group position={position} rotation={rotation}>
        {!clicked ? (
          <RigidBody colliders="hull" type="fixed">
            <mesh
              castShadow
              receiveShadow
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerMove={()=>{if(running)click(true)}}
              geometry={nodes.Suzanne.geometry}>
              <meshStandardMaterial color={hovered ? 'hotpink' : 'aquamarine'} />
            </mesh>
          </RigidBody>
        ) : (
          <Parts>
            <Geometry>
              <Base geometry={nodes.Suzanne.geometry} position={[0, 0, 0]} />
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
    )
  }