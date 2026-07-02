import { Html } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLonToVector3 } from "./utils";

export default function Marker ({
    lat,
    lon,
    label,
    onClick,
    selected,
}) {
  const position = latLonToVector3(lat, lon, 2.1);
  const ringRef = useRef();
   console.log(label, selected);
  useFrame(({ clock }) => {

  if (!ringRef.current) return;

  const t = clock.elapsedTime;

  const scale = 1 + Math.sin(t * 3) * 0.35;

  ringRef.current.scale.set(scale, scale, scale);

  ringRef.current.material.opacity =
    0.55 + Math.sin(t * 3) * 0.25;

});
  return (
    <>
      <group position={position}>

  {/* Main Marker */}

  <mesh
    onPointerDown={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
  >

    <sphereGeometry args={[0.045,24,24]} />

    <meshBasicMaterial
      color="#38bdf8"
      toneMapped={false}
    />

  </mesh>

  {/* Animated Ring */}

  <mesh ref={ringRef}>

    <ringGeometry args={[0.06,0.075,64]} />

    <meshBasicMaterial
      color="#38bdf8"
      transparent
      opacity={0.5}
      side={THREE.DoubleSide}
      toneMapped={false}
    />

  </mesh>
<sprite scale={[0.22,0.22,0.22]}>

  <spriteMaterial
    color="#38bdf8"
    transparent
    opacity={0.22}
  />

</sprite>
{selected && (
  <Html
    position={[0, 0.35, 0]}
    center
    occlude={false}
    transform={false}
    distanceFactor={6}
  >
    <div
      style={{
        background: "red",
        color: "white",
        padding: "8px 12px",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "14px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  </Html>
)}
</group>

    
    </>
  );
}