import { useThree, useFrame } from "@react-three/fiber";
import { useWeather } from "../context/WeatherContext";
import { useEffect } from "react";
import * as THREE from "three";
import { globeTargetRotation } from "./GlobeControls";
import { latLonToRotation } from "./utils";

export default function CameraController() {
  const { currentLocation } = useWeather();
  const { camera } = useThree();

  useEffect(() => {
    if (!currentLocation) return;

    const rotation = latLonToRotation(
      currentLocation.lat,
      currentLocation.lon
    );

    globeTargetRotation.x = rotation.x;
    globeTargetRotation.y = rotation.y;
  }, [currentLocation]);

  useFrame(() => {
    camera.position.lerp(
      new THREE.Vector3(0, 0, 6),
      0.05
    );

    camera.lookAt(0, 0, 0);
  });

  return null;
}