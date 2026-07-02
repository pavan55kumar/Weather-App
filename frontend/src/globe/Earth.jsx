import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

import dayMap from "../assets/earth/earth_day.jpg";
import normalMap from "../assets/earth/earth_normal.jpg";
import specularMap from "../assets/earth/earth_specular.jpg";
import cloudMap from "../assets/earth/clouds.png";
import nightMap from "../assets/earth/night.png";
import { Sphere } from "@react-three/drei";

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

 
  return (
    <group>

      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 128, 128]} />

        <meshPhongMaterial
          map={earthTexture}
          normalMap={normalTexture}
          specularMap={specularTexture}
          emissiveMap={nightTexture}
          emissive={new THREE.Color("#222222")}
          shininess={18}
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
{/* Atmosphere Glow */}

<Sphere args={[2.15, 64, 64]}>

  <meshBasicMaterial
    color="#38bdf8"
    transparent
    opacity={0.15}
    side={THREE.BackSide}
  />

</Sphere>
    </group>
  );
}