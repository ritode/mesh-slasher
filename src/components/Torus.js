import { useCursor, useGLTF } from "@react-three/drei";
import {
  Geometry,
  Base,
  Subtraction,
  Addition,
  Difference,
} from "@react-three/csg";
import { RigidBody } from "@react-three/rapier";
import { Parts, Part } from "./part.tsx";
import { useEffect, useState } from "react";
import { TorusKnotGeometry, Euler, Vector3, BoxGeometry } from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
export default function LoopyObject({ position, running }) {
  const mesh = useRef();
  const plane = useRef();
  const torusKnotGeometry = new BoxGeometry(2, 2, 2);
  let planeProxyClip;
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  const [start, setStart] = useState(new Vector3(0, 0, 0));
  const [end, setEnd] = useState(new Vector3(0, 0, 0));

  useCursor(hovered);

  // useFrame(({ camera }) => {
  //   plane.current.quaternion.copy(camera.quaternion);
  //   plane.current.rotation.y = plane.current.rotation.y + Math.PI / 2;
  //   // plane.current.rotation.y = plane.current.rotation.y + Math.PI / 2;
  // });
  // useFrame((state, delta) => (mesh.current.rotation.x = mesh.current.rotation.y += delta))
  return (
    <>
      {!clicked ? (
        <mesh
          ref={mesh}
          geometry={torusKnotGeometry}
          position={position}
          onPointerMove={(e) => {
            plane.current.position.copy(mesh.current.worldToLocal(e.point));
            if (running) click(true);
          }}
          onPointerOver={(e) => {
            plane.current.visible = true;
            setStart(mesh.current.worldToLocal(e.point));
            setEnd(mesh.current.worldToLocal(e.point));
            // console.log(mesh.current.worldToLocal(e.point));
            hover(true);

            setStart();
          }}
          onPointerOut={(e) => {
            // plane.current.visible = false;
            // if (running)
            setEnd(mesh.current.worldToLocal(e.point));
            // console.log(mesh.current.worldToLocal(e.point));
            hover(false);
          }}
        >
          <meshNormalMaterial />
          <mesh
            raycast={() => null}
            ref={plane}
            visible={false}
            rotation={new Euler(0, Math.PI / 2, 0)}
          >
            <planeGeometry args={[0.2, 4]} />
            <meshBasicMaterial color="orange" toneMapped={false} side={2} />
          </mesh>
        </mesh>
      ) : (
        <Parts>
          <Geometry>
            <Base geometry={torusKnotGeometry} position={position} />
            <Difference>
              <Geometry>
                <Base position={start} rotation={[0, 0, 0]}>
                  <boxGeometry args={[0.2, 1, 1]} />
                  <meshBasicMaterial
                    color="orange"
                    toneMapped={false}
                    side={2}
                  />
                </Base>
              </Geometry>
            </Difference>
          </Geometry>
          <Part>
            {(geometry, index) => (
              <RigidBody key={index} colliders="hull">
                <mesh castShadow receiveShadow geometry={geometry}>
                  <meshStandardMaterial color={Math.random() * 0xffffff} />
                  <mesh
                    raycast={() => null}
                    ref={plane}
                    visible={false}
                    rotation={new Euler(0, Math.PI / 2, 0)}
                  >
                    <planeGeometry args={[0.2, 4]} />
                    <meshBasicMaterial
                      color="orange"
                      toneMapped={false}
                      side={2}
                    />
                  </mesh>
                </mesh>
                <mesh position={position}>
                  <boxGeometry args={[0.3, 0.3, 0.3]} />
                  <meshBasicMaterial color="red" toneMapped={false} side={2} />
                </mesh>
              </RigidBody>
            )}
          </Part>
        </Parts>
      )}
    </>
  );
}
