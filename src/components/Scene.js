import Box from "./Box";
import { Physics, CuboidCollider } from "@react-three/rapier";
import Monkey from "./Monkey";

export default function Scene() {
  // const planeRef = useRef(null);
  // useFrame(({ camera }) => {
  //   planeRef.current.lookAt(camera.position);
  //   planeRef.current.rotation.y = Math.PI / 4;
  // });

  return (
    <>
      {/* <Plane args={[0.5, 2.5]} position={intersectionPoint} ref={planeRef} /> */}
      <Physics timeStep="vary" gravity={[0, -25, 0]}>
        <Box position={[0, 0, 0]} />
        {/* <Monkey position={[0, 0, 0]} /> */}
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
