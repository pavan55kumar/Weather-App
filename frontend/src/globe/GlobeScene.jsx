import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import CameraController from "./CameraController";
import GlobeGroup from "./GlobeGroup";

export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6] }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 2]}
    >
      <CameraController />
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 8, 16]} />

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
        speed={0.5}
      />

      <GlobeGroup />

      {/*
        Both rotate AND zoom are intentionally disabled here. City selection
        drives the camera entirely: GlobeGroup lerps globe rotation toward a
        target orientation, and CameraController lerps camera distance
        (cameraTarget.z) toward a "focused" dolly-in distance. Leaving either
        OrbitControls rotate or zoom enabled would let manual drags/scrolls
        fight those animations every frame — the exact "controls feel
        broken" symptom this replaces.
      */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        autoRotate={false}
      />
    </Canvas>
  );
}