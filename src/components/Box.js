import { useState, useRef, useEffect } from "react";
import { useCursor } from "@react-three/drei";
import { Geometry, Base, Subtraction, Intersection } from "@react-three/csg";
import { BoxGeometry, Euler, Vector3 } from "three";
import { PivotControls } from "@react-three/drei";

export default function Box({ position }) {
  const mesh = useRef();
  const csg = useRef();

  const [start, setStart] = useState(new Vector3());
  const end = new Vector3();

  function Cutter({ start }) {
    return (
      <Subtraction
        position={[start.x, start.y, start.z]}
        rotation={new Euler(0, 0, 0)}
      >
        <boxGeometry args={[0.1, 10, 10]} />
      </Subtraction>
    );
  }

  const boxGeometry = new BoxGeometry(3, 3, 3);

  return (
    <mesh
      position={position}
      onPointerMove={(e) => {
        // if ((start.x === 0) & (start.y === 0) & (start.z === 0))
        // start.copy(mesh.current.worldToLocal(e.point));
        setStart(mesh.current.worldToLocal(e.point));
        // else
        end.copy(mesh.current.worldToLocal(e.point));
        csg.current.update();
      }}
      // onPointerLeave={() => {
      //   handleUnclick();
      // }}
      ref={mesh}
    >
      <meshNormalMaterial />
      <Geometry ref={csg}>
        <Base geometry={boxGeometry} />
        <Cutter start={start} />
      </Geometry>
    </mesh>
  );
}
