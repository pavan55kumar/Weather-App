import * as THREE from "three";

// Convert latitude & longitude to a point on the globe
export function latLonToVector3(lat, lon, radius = 2) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Convert latitude & longitude to globe rotation
const LONGITUDE_OFFSET = 90;

export function latLonToRotation(lat, lon) {
  return {
    x: THREE.MathUtils.degToRad(-lat),
    y: THREE.MathUtils.degToRad(lon + LONGITUDE_OFFSET),
  };
}