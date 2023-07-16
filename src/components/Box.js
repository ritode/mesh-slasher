import { useState, useRef, useEffect } from "react";
import { useCursor } from "@react-three/drei";
import { Geometry, Base, Subtraction, Intersection } from "@react-three/csg";
import { BoxGeometry, Euler, Vector3 } from "three";
import { PivotControls } from "@react-three/drei";
import { Matrix4 } from "three";

export default function Box({ position }) {
  const mesh = useRef();
  const csg = useRef();

  const [cut, setCut] = useState(false);
  const [running, setRunning] = useState(false);

  const [start, setStart] = useState(new Vector3());
  const [end, setEnd] = useState(new Vector3());

  const [planePosition, setPlanePosition] = useState(new Vector3());
  const [planeRotation, setPlaneRotation] = useState(new Euler(0, 0, 0.1));

  const boxCut = new BoxGeometry(2, 10, 10);
  boxCut.applyMatrix4(new Matrix4().makeTranslation(1, 0, 0));

  function Cutter({ start }) {
    return (
      <Subtraction position={start} rotation={planeRotation}>
        <boxGeometry args={[0.1, 10, 10]} />
      </Subtraction>
    );
  }

  const boxGeometry = new BoxGeometry(3, 3, 3);

  function handleClick() {
    setCut(false);
    setRunning(true);
    setStart(new Vector3(0, 0, 0));
  }

  function handleUnClick() {
    setCut(true);
    setRunning(false);
  }

  useEffect(() => {
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("mouseup", handleUnClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("mouseup", handleUnClick);
    };
  }, []);

  return (
    <group>
      {!cut ? (
        <mesh
          position={position}
          onPointerMove={(e) => {
            setEnd(mesh.current.worldToLocal(e.point));
            if (running) {
              if ((start.x === 0) & (start.y === 0) & (start.z === 0)) {
                setStart(mesh.current.worldToLocal(e.point));
                setPlanePosition(mesh.current.worldToLocal(e.point));
              } else {
                if (start.x > end.x) {
                  setPlanePosition(
                    new Vector3(
                      (start.x + end.x) / 2,
                      (start.y + end.y) / 2,
                      (start.z + end.z) / 2
                    )
                  );
                  const x =
                    Math.PI / 2 +
                    Math.atan((start.y - end.y) / (start.x - end.x));
                  setPlaneRotation(new Euler(0, 0, x));
                } else {
                  setPlanePosition(
                    new Vector3(
                      (start.x + end.x) / 2,
                      (start.y + end.y) / 2,
                      (start.z + end.z) / 2
                    )
                  );
                  const x =
                    Math.PI / 2 +
                    Math.atan((start.y - end.y) / (start.x - end.x));
                  setPlaneRotation(new Euler(0, 0, x));
                }
              }
              csg.current.update();
            }
          }}
          ref={mesh}
        >
          <meshNormalMaterial />
          <Geometry ref={csg}>
            <Base geometry={boxGeometry} />
            <Cutter start={planePosition} />
          </Geometry>
        </mesh>
      ) : (
        <group>
          <mesh position={position}>
            <meshNormalMaterial />
            <Geometry ref={csg}>
              <Base geometry={boxGeometry} />
              <Subtraction
                position={planePosition}
                rotation={planeRotation}
                geometry={boxCut}
              ></Subtraction>
            </Geometry>
          </mesh>
          <mesh position={[position[0] + 1, position[1] + 1, position[2]]}>
            <meshNormalMaterial />
            <Geometry ref={csg}>
              <Base geometry={boxGeometry} />
              <Intersection
                position={planePosition}
                rotation={planeRotation}
                geometry={boxCut}
              ></Intersection>
            </Geometry>
          </mesh>
        </group>
      )}
      {/* <mesh geometry={boxCut} position={planePosition} rotation={planeRotation}>
        <meshNormalMaterial />
      </mesh> */}
    </group>
  );
}
