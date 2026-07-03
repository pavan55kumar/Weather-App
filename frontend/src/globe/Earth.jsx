import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import dayMap from "../assets/earth/earth_day.jpg";
import normalMap from "../assets/earth/earth_normal.jpg";
import specularMap from "../assets/earth/earth_specular.jpg";
import cloudMap from "../assets/earth/clouds.png";
import nightMap from "../assets/earth/night.png";

// Classic Fresnel rim-light shader — real atmosphere glow that brightens
// toward the planet's silhouette instead of a flat, uniform opacity sphere.
const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize( normalMatrix * normal );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
    gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity;
  }
`;

export default function Earth() {
  const earthRef = useRef();
  const cloudRef = useRef();

  const [
    earthTexture,
    normalTexture,
    specularTexture,
    cloudsTexture,
    nightTexture,
  ] = useLoader(THREE.TextureLoader, [
    dayMap,
    normalMap,
    specularMap,
    cloudMap,
    nightMap,
  ]);

  // Clouds drift independently of the planet surface, purely for visual
  // realism. They are NOT attached to earthRef, so this never desyncs city
  // markers from the texture — only the cloud layer moves on its own.
  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.018;
    }
  });

  return (
    <group>

      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 128, 128]} />

        <meshPhongMaterial
          map={earthTexture}
          normalMap={normalTexture}
          specularMap={specularTexture}
          specular={new THREE.Color("#333333")}
          emissiveMap={nightTexture}
          emissive={new THREE.Color("#222222")}
          emissiveIntensity={1.1}
          shininess={14}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.03, 128, 128]} />

        <meshPhongMaterial
          map={cloudsTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere Glow — Fresnel rim light, brightest at the silhouette */}
      <mesh scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* Soft outer haze for extra depth */}
      <mesh scale={[1.22, 1.22, 1.22]}>
        <sphereGeometry args={[2, 48, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}