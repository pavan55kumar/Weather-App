import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Two named distances instead of one fixed value: the globe sits back at
// DEFAULT_DISTANCE normally, and dollies in to FOCUSED_DISTANCE whenever a
// city marker is selected (see GlobeGroup), for a deliberate cinematic
// "fly to city" feel instead of a static, locked-off camera.
export const DEFAULT_DISTANCE = 6;
export const FOCUSED_DISTANCE = 4.4;

export const cameraTarget = {
  z: DEFAULT_DISTANCE,
};

export default function CameraController() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      cameraTarget.z,
      0.06
    );
  });

  return null;
}