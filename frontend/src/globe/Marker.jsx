import { Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLonToVector3 } from "./utils";

// Generates a soft radial-gradient glow texture once per marker. Using an
// actual texture (instead of a flat-color sprite, which renders as a hard
// square) is what gives the glow its soft, photorealistic falloff.
function useGlowTexture(color) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, `${color}CC`);
    gradient.addColorStop(0.35, `${color}55`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [color]);
}

export default function Marker({
  lat,
  lon,
  label,
  onClick,
  selected,
}) {
  const position = latLonToVector3(lat, lon, 2.1);
  const ringRef = useRef();
  const dotRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Randomized per-marker phase so the pulse animation doesn't tick in
  // perfect unison across every city — small detail, much more organic.
  const phaseOffset = useRef(Math.random() * Math.PI * 2);

  const glowTexture = useGlowTexture("#38bdf8");

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phaseOffset.current;

    if (ringRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.35;
      ringRef.current.scale.set(scale, scale, scale);
      ringRef.current.material.opacity = 0.55 + Math.sin(t * 3) * 0.25;
    }

    if (dotRef.current) {
      const targetScale = hovered || selected ? 1.5 : 1;
      dotRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  return (
    <group position={position}>

      {/* Larger invisible hit-area — the visible dot is intentionally tiny,
          but users need a forgiving click/tap target, especially on mobile. */}
      <mesh
        onPointerDown={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        visible={false}
      >
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Main Marker dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.045, 24, 24]} />
        <meshBasicMaterial
          color={selected ? "#facc15" : "#38bdf8"}
          toneMapped={false}
        />
      </mesh>

      {/* Animated pulse ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.06, 0.075, 64]} />
        <meshBasicMaterial
          color={selected ? "#facc15" : "#38bdf8"}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Soft glow sprite */}
      <sprite scale={[0.3, 0.3, 0.3]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={hovered || selected ? 0.55 : 0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {(selected || hovered) && (
        <Html
          position={[0, 0.35, 0]}
          center
          occlude={false}
          transform={false}
          distanceFactor={6}
        >
          <div className="relative flex flex-col items-center pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md border border-sky-500/30 text-white font-bold text-sm px-3 py-1.5 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] whitespace-nowrap">
              {label}
            </div>
            <div className="w-2 h-2 bg-slate-900/90 border-r border-b border-sky-500/30 rotate-45 -mt-1" />
          </div>
        </Html>
      )}
    </group>
  );
}