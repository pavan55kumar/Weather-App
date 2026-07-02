import React from "react";
import { useWeather } from "../context/WeatherContext";

import SunnyBackground from "../weather/SunnyBackground";

// We'll create these next
import CloudyBackground from "../weather/CloudyBackground";
// import RainBackground from "../weather/RainBackground";
import RainBackground from "../weather/RainBackground";
// import SnowBackground from "../weather/SnowBackground";
import SnowBackground from "../weather/SnowBackground";
// import ThunderBackground from "../weather/ThunderBackground";
import ThunderBackground from "../weather/ThunderBackground";
// import FogBackground from "../weather/FogBackground";
import FogBackground from "../weather/FogBackground";

export default function WeatherBackground() {
  const { weatherData } = useWeather();

  if (!weatherData) {
    return <SunnyBackground />;
  }

  const code = weatherData.current.weather_code;

  // Clear Sky
  if (code === 0) {
    return <SunnyBackground />;
  }

  // Partly Cloudy
if ([1, 2, 3].includes(code)) {
    return <CloudyBackground />;
}

  // Fog
if ([45,48].includes(code)) {
    return <FogBackground />;
}

  // Rain
if (
[
51,53,55,56,57,
61,63,65,66,67,
80,81,82
].includes(code)
){
    return <RainBackground />;
}

  // Snow
  if ([71,73,75,77,85,86].includes(code)) {
    return <SnowBackground />;
}

  // Thunderstorm
  if (code >= 95) {
  return <ThunderBackground />;
}

  return <SunnyBackground />;
}