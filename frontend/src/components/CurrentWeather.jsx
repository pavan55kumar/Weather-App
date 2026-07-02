import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Compass,
  Eye,
  Gauge,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { motion } from "framer-motion";
// Translates WMO weather codes into clean text formats
export const getWeatherCondition = (code) => {
  if (code === 0) return 'Clear Sky';
  if ([1, 2, 3].includes(code)) return 'Partly Cloudy';
  if ([45, 48].includes(code)) return 'Foggy Visuals';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Light Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rainy Downpour';
  if ([71, 73, 75, 77].includes(code)) return 'Snow Flurries';
  if ([80, 81, 82].includes(code)) return 'Rain Showers';
  if ([85, 86].includes(code)) return 'Heavy Snow Storm';
  if (code >= 95) return 'Severe Thunderstorms';
  return 'Variable Conditions';
};

// Maps a WMO weather code to a matching animated icon
const getWeatherIcon = (weather_code) => {
  const code = weather_code;

  if (code === 0)
    return <Sun className="w-20 h-20 text-yellow-400 animate-pulse" />;

  if ([1, 2, 3].includes(code))
    return <Cloud className="w-20 h-20 text-slate-200" />;

  if ([61, 63, 65, 80, 81, 82].includes(code))
    return <CloudRain className="w-20 h-20 text-sky-400" />;

  if ([71, 73, 75].includes(code))
    return <CloudSnow className="w-20 h-20 text-cyan-300" />;

  return <CloudLightning className="w-20 h-20 text-purple-400" />;
};

// Small emoji for the "feels like" weather chip
const getWeatherEmoji = (code) => {
  if (code === 0) return '☀️';
  if ([1, 2, 3].includes(code)) return '🌤';
  if ([45, 48].includes(code)) return '🌫';
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦';
  if ([61, 63, 65, 66, 67].includes(code)) return '🌧';
  if ([71, 73, 75, 77].includes(code)) return '❄️';
  if ([80, 81, 82].includes(code)) return '🌧';
  if ([85, 86].includes(code)) return '🌨';
  if (code >= 95) return '⛈';
  return '🌡';
};

export default function CurrentWeather() {
  const { weatherData, currentLocation, isCelsius } = useWeather();

  if (!weatherData) return null;

  const { current, airQuality } = weatherData;
  const temp = Math.round(current.temperature_2m);
  const displayTemp = isCelsius ? temp : Math.round((temp * 9) / 5 + 32);
  const feel = Math.round(current.apparent_temperature);
  const displayFeel = isCelsius ? feel : Math.round((feel * 9) / 5 + 32);

  // Parse US EPA Air Quality standards
  const getAQIDesc = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400 bg-emerald-500/10', dot: '🟢' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-400 bg-amber-500/10', dot: '🟡' };
    return { label: 'Unhealthy', color: 'text-rose-400 bg-rose-500/10', dot: '🔴' };
  };

  const aqiMeta = getAQIDesc(airQuality.us_aqi);

  return (
    <motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  whileHover={{ y: -4 }}
  className="premium-card flex flex-col md:flex-row gap-8 items-center justify-between overflow-hidden relative">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:22px_22px]"></div>

      {/* Primary Metrics Group */}
      <div className="flex flex-col text-center md:text-left gap-2 relative">
        <div className="text-sm text-sky-400 font-semibold tracking-widest uppercase">Live Tracking Matrix</div>
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="dashboard-title text-slate-100"
        >
          📍 {currentLocation.name}
        </motion.h2>
        <div className="dashboard-subtitle">
          {currentLocation.state ? `${currentLocation.state}, ` : ''}{currentLocation.country}
        </div>
        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
          {getWeatherIcon(current.weather_code)}
          <div className="flex items-start gap-1">
            <motion.span
      initial={{ scale: 0.7 }}
      animate={{ scale: 1 }}
      transition={{
          type: "spring",
          stiffness: 120
      }}
      className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-b from-white via-sky-200 to-sky-500 bg-clip-text text-transparent">{displayTemp}</motion.span>
            <span className="text-3xl font-bold text-sky-400 mt-1">°{isCelsius ? 'C' : 'F'}</span>
          </div>
        </div>

        {/* Weather chip */}
        <div className="mt-4 inline-flex items-center gap-3 self-center md:self-start bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
          <span className="text-2xl">{getWeatherEmoji(current.weather_code)}</span>
          <div className="text-left">
            <div className="text-sm font-semibold text-slate-200">{getWeatherCondition(current.weather_code)}</div>
            <div className="text-xs text-slate-400">Feels Like {displayFeel}°</div>
          </div>
        </div>
      </div>

      {/* Grid Matrix Details Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:max-w-xl relative">
        <motion.div
          whileHover={{ scale: 1.06, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="metric-card p-4 rounded-xl flex items-center gap-3"
        >
          <Wind className="h-5 w-5 text-sky-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Wind Speed</div>
            <div className="text-sm font-semibold text-slate-200">{current.wind_speed_10m} km/h</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.06, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="metric-card p-4 rounded-xl flex items-center gap-3"
        >
          <Droplets className="h-5 w-5 text-blue-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Humidity</div>
            <div className="text-sm font-semibold text-slate-200">{current.relative_humidity_2m}%</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.06, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="metric-card p-4 rounded-xl flex items-center gap-3"
        >
          <Sun className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">UV Radiation</div>
            <div className="text-sm font-semibold text-slate-200">{current.uv_index} Index</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.06, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="metric-card p-4 rounded-xl flex items-center gap-3"
        >
          <Compass className="h-5 w-5 text-indigo-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Air Pressure</div>
            <div className="text-sm font-semibold text-slate-200">{Math.round(current.surface_pressure)} hPa</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.06, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="metric-card p-4 rounded-xl flex items-center gap-3"
        >
          <Eye className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Visibility</div>
            <div className="text-sm font-semibold text-slate-200">{Math.round(current.visibility / 1000)} km</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.06, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250 }}
          className="metric-card p-4 rounded-xl flex items-center gap-3"
        >
          <Gauge className="h-5 w-5 text-purple-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">US EPA AQI</div>
            <div className={`text-xs px-3 py-1 mt-0.5 rounded-full font-bold inline-flex items-center gap-1 shadow-[0_0_12px_rgba(255,255,255,0.08)] ${aqiMeta.color}`}>
              <span>{aqiMeta.dot} {aqiMeta.label.toUpperCase()}</span>
              <span className="opacity-70">• {airQuality.us_aqi} AQI</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}