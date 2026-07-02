import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const cameraTarget = {
  z: 6,
};

export default function CameraController() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      cameraTarget.z,
      0.05
    );
  });

  return null;
}