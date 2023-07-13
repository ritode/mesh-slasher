
import {useCursor, useGLTF } from '@react-three/drei'
import { Geometry, Base, Subtraction, Addition } from '@react-three/csg'
import { RigidBody } from '@react-three/rapier'
import { Parts,Part } from "./part.tsx";
import { useState } from 'react';
import { TorusKnotGeometry } from 'three';
import { useRef } from 'react';
export default function LoopyObject({position,running}) {
    const mesh = useRef();
    const plane = useRef();
    const torusKnotGeometry = new TorusKnotGeometry(1,0.4,200,50);
    let planeProxyClip;
    const [hovered, hover] = useState(false)
      const [clicked, click] = useState(false)
      useCursor(hovered)
  
    // useFrame(({ camera }) => {
    //   plane.current.lookAt(camera.position);
    //   plane.current.rotation.y = Math.PI / 2;
    // });
    // useFrame((state, delta) => (mesh.current.rotation.x = mesh.current.rotation.y += delta))
    return (
      <>
      {!clicked ? (
            <RigidBody colliders="hull" type="fixed">
      <mesh
        ref={mesh}
        position={position}
        geometry={torusKnotGeometry}
        onPointerMove={(e) =>{
          // plane.current.position.copy(mesh.current.worldToLocal(e.point));
          if(running)click(true);
        }
        }
        onPointerOver={() => {
          // plane.current.visible = true; 
          hover(true)}}
        onPointerOut={() => {
          // (plane.current.visible = false);
          hover(false)}}
      >
        
        <meshNormalMaterial />
        {/* <mesh
          raycast={() => null}
          ref={plane}
          visible={false}
          rotation={new Euler(0, Math.PI / 2, 0)}
        >
          <planeGeometry args={[0.2, 4]} />
          <meshBasicMaterial color="orange" toneMapped={false} side={2} />
        </mesh> */}
      </mesh>
      </RigidBody>):(
        <Parts>
        <Geometry>
          <Base geometry={torusKnotGeometry} position={[0, 0, 0]} />
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
      </>
    );
  }