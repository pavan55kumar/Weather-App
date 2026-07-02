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
  const {
    loadDashboardTelemetry,
    globeMarkers,
    selectedMarker,
    setSelectedMarker,
  } = useWeather();

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

      {globeMarkers.map((city) => (

        <Marker
          key={`${city.lat}-${city.lon}`}
          lat={city.lat}
          lon={city.lon}
          label={city.name}
                  selected={
    selectedMarker?.lat === city.lat &&
    selectedMarker?.lon === city.lon
  }
          onClick={() => {

            const rotation = latLonToRotation(
              city.lat,
              city.lon
            );

            globeTargetRotation.x = rotation.x;
            globeTargetRotation.y = rotation.y;
            setSelectedMarker(city);
            loadDashboardTelemetry(city);

          }}

        />

      ))}
    </group>
  );
}