import * as THREE from "three";

// Now a Quaternion rather than an Euler — see utils.js (latLonToQuaternion)
// for why: independently lerping separate X/Y Euler angles doesn't reliably
// aim an arbitrary lat/lon point at the camera. A quaternion + slerp does.
export const globeTargetRotation = new THREE.Quaternion();