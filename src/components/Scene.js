import Model from "./Model";
import { Physics, CuboidCollider } from "@react-three/rapier";
import { BoxGeometry, SphereGeometry } from "three";
import { useGLTF } from "@react-three/drei";

export default function Scene() {
  // const planeRef = useRef(null);
  // useFrame(({ camera }) => {
  //   planeRef.current.lookAt(camera.position);
  //   planeRef.current.rotation.y = Math.PI / 4;
  // });

  const { nodes } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-low-poly/model.gltf"
  );
  const boxGeometry = new BoxGeometry(3, 3, 3);
  const sphereGeometry = new SphereGeometry(2, 40, 40);

  return (
    <>
      {/* <Plane args={[0.5, 2.5]} position={intersectionPoint} ref={planeRef} /> */}
      <Physics timeStep="vary" gravity={[0, -25, 0]}>
        {/* <Model position={[0, 0, 0]} meshGeo={nodes.Suzanne.geometry} /> */}
        <Model position={[0, 0, 0]} meshGeo={sphereGeometry} />
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
