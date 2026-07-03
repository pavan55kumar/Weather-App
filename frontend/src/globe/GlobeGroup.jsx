import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import Earth from "./Earth";
import Marker from "./Marker";
import { globeTargetRotation } from "./GlobeControls";
import { cameraTarget, FOCUSED_DISTANCE } from "./CameraController";
import { useWeather } from "../context/WeatherContext";
import { latLonToQuaternion } from "./utils";

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

    // Slerp (spherical interpolation) between quaternions instead of
    // lerping two separate Euler angles — this is what guarantees the
    // globe always ends up rotated so the selected marker's exact 3D
    // point faces the camera, no matter which city was clicked.
    earthGroup.current.quaternion.slerp(globeTargetRotation, 0.08);
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

            const targetQuaternion = latLonToQuaternion(city.lat, city.lon);
            globeTargetRotation.copy(targetQuaternion);
            cameraTarget.z = FOCUSED_DISTANCE;
            setSelectedMarker(city);
            loadDashboardTelemetry(city);

          }}

        />

      ))}
    </group>
  );
}