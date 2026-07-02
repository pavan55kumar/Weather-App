import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Earth from "./Earth";
import Marker from "./Marker";
import { globeTargetRotation } from "./GlobeControls";
import { useWeather } from "../context/WeatherContext";
import { latLonToRotation } from "./utils";

export default function GlobeGroup() {
  const earthGroup = useRef();
  const { loadDashboardTelemetry } = useWeather();

  useFrame(() => {
    if (!earthGroup.current) return;

    earthGroup.current.rotation.x = THREE.MathUtils.lerp(
      earthGroup.current.rotation.x,
      globeTargetRotation.x,
      0.08
    );

    earthGroup.current.rotation.y = THREE.MathUtils.lerp(
      earthGroup.current.rotation.y,
      globeTargetRotation.y,
      0.08
    );
  });

  return (
    <group ref={earthGroup}>
      <Earth />

    

<Marker
  lat={28.6139}
  lon={77.2090}
  label="Delhi"
  onClick={() => {
    const rotation = latLonToRotation(28.6139, 77.2090);

    globeTargetRotation.x = rotation.x;
    globeTargetRotation.y = rotation.y;

    loadDashboardTelemetry({
      name: "Delhi",
      state: "Delhi",
      country: "India",
      lat: 28.6139,
      lon: 77.2090,
    });
  }}
/>

      <Marker
        lat={35.6762}
        lon={139.6503}
        label="Tokyo"
     onClick={() => {

    const rotation = latLonToRotation(
        35.6762,
        139.6503
    );

    globeTargetRotation.x = rotation.x;
    globeTargetRotation.y = rotation.y;

    loadDashboardTelemetry({
        name: "Tokyo",
        state: "Tokyo",
        country: "Japan",
        lat: 35.6762,
        lon: 139.6503,
    });

}}
      />

      <Marker
        lat={51.5072}
        lon={-0.1276}
        label="London"
        onClick={() => {
         const rotation = latLonToRotation(
    51.5072,
    -0.1276
);

globeTargetRotation.x = rotation.x;
globeTargetRotation.y = rotation.y;

          loadDashboardTelemetry({
            name: "London",
            state: "England",
            country: "United Kingdom",
            lat: 51.5072,
            lon: -0.1276,
          });
        }}
      />
    </group>
  );
}