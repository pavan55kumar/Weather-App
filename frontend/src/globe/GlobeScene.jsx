import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import CameraController from "./CameraController";
import GlobeGroup from "./GlobeGroup";

export default function GlobeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.6} />

      <directionalLight
        position={[8, 4, 5]}
        intensity={3.8}
      />

      <directionalLight
        position={[-5, -2, -5]}
        intensity={0.4}
      />

      <pointLight
        position={[-8, -3, -6]}
        intensity={1}
        color="#60a5fa"
      />

      <Stars
        radius={120}
        depth={80}
        count={6000}
        factor={5}
        fade
      />
      

      <GlobeGroup />

      <OrbitControls
        enablePan={false}
        enableZoom
        autoRotate={false}
      />
    </Canvas>
  );
}