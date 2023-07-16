import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import Scene from "./components/Scene";
import { Vector2 } from "three";
import "./App.css";

import { OrbitControls } from "@react-three/drei";

function App() {
  const [point1, setPoint1] = useState(new Vector2(0, 0));
  const [point2, setPoint2] = useState(new Vector2(0, 0));
  const [orbitMode, setOrbitMode] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "q") {
        setOrbitMode(true);
      }
    };
    const handleKeyUp = (event) => {
      if (event.key === "q") {
        setOrbitMode(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyUp);
      document.addEventListener("keyup", handleKeyDown);
    };
  }, []);

  function handleClick(e) {
    const point = new Vector2(e.clientX, e.clientY, 0);
    setPoint1(point);
    setPoint2(point);
  }

  function handleUnclick(e) {
    const point = new Vector2(e.clientX, e.clientY, 0);

    setPoint2(point);
  }

  useEffect(() => {
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("mouseup", handleUnclick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("mouseup", handleUnclick);
    };
  }, []);
  return (
    <div className="App">
      <Canvas ref={canvasRef}>
        <pointLight position={[10, 10, 10]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 15, 5]} angle={0.25} penumbra={1} castShadow />
        <pointLight position={[-10, -10, -10]} />
        <Scene />
        <OrbitControls enabled={orbitMode} zoomSpeed={1} />
      </Canvas>
      <svg
        className="line"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 99999,
          pointerEvents: "none",
          top: 0,
          left: 0,
        }}
      >
        <line
          x1={point1.x}
          y1={point1.y}
          x2={point2.x}
          y2={point2.y}
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export default App;
