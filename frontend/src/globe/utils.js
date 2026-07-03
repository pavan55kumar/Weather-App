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

// Computes the quaternion that rotates the globe so a given lat/lon point
// ends up facing the camera (+Z axis).
//
// The previous approach set rotation.x = -lat and rotation.y = lon + 90
// independently, then lerped each as separate Euler angles. That only
// produces the correct result for points near the equator/reference
// meridian — rotations around two different axes don't compose the way
// you'd want for aiming an arbitrary sphere point at the camera, so cities
// further from that reference line (like New York) would end up rotated to
// the wrong place entirely.
//
// This version instead takes the exact same 3D point Marker.jsx uses
// (via latLonToVector3) and finds the single rotation that moves THAT
// point to (0, 0, 1). Since the marker and the rotation now derive from
// the identical vector, they can never disagree.
export function latLonToQuaternion(lat, lon) {
  const point = latLonToVector3(lat, lon, 1).normalize();
  const faceCamera = new THREE.Vector3(0, 0, 1);
  return new THREE.Quaternion().setFromUnitVectors(point, faceCamera);
}