import { Html } from "@react-three/drei";
import { latLonToVector3 } from "./utils";

export default function Marker({ lat, lon, label, onClick }) {
  const position = latLonToVector3(lat, lon, 2.1);

  return (
    <>
      <mesh
        position={position}
        onPointerDown={(e) => {
          e.stopPropagation();
          console.log("MARKER CLICKED:", label);
          onClick?.();
        }}
      >
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>

      <Html
        position={position}
        distanceFactor={10}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div className="px-2 py-1 rounded bg-black/80 text-white text-xs">
          📍 {label}
        </div>
      </Html>
    </>
  );
}