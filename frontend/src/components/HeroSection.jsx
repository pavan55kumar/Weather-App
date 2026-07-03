import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  MoonStar,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
} from "lucide-react";
import LiveClock from "./LiveClock";
import SearchBar from "./SearchBar";
import { useWeather } from "../context/WeatherContext";
import FavoriteButton from "./FavoriteButton";
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
} from "../utils/favorites";
// Maps a WMO weather code to a matching animated icon
const getWeatherIcon = (code) => {
  if (code === 0)
    return <Sun className="w-16 h-16 text-yellow-300 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)] animate-pulse" />;
  if ([1, 2, 3].includes(code))
    return <Cloud className="w-16 h-16 text-slate-200 drop-shadow-[0_0_20px_rgba(226,232,240,0.35)]" />;
  if ([61, 63, 65, 80, 81, 82].includes(code))
    return <CloudRain className="w-16 h-16 text-sky-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.45)]" />;
  if ([71, 73, 75].includes(code))
    return <CloudSnow className="w-16 h-16 text-cyan-200 drop-shadow-[0_0_20px_rgba(165,243,252,0.45)]" />;
  if (code >= 95)
    return <CloudLightning className="w-16 h-16 text-purple-300 drop-shadow-[0_0_20px_rgba(216,180,254,0.5)]" />;
  return <Sun className="w-16 h-16 text-yellow-300" />;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
};

export default function HeroSection() {
 const {
  currentLocation,
  weatherData,
  isCelsius,
  favorites,
  addFavoriteCity,
  removeFavoriteCity,
} = useWeather();
const favorite = favorites.some(
  (city) =>
    Math.abs(city.lat - currentLocation.lat) < 0.01 &&
    Math.abs(city.lon - currentLocation.lon) < 0.01
);

const toggleFavorite = () => {
  if (favorite) {
    removeFavoriteCity(currentLocation);
  } else {
    addFavoriteCity(currentLocation);
  }
};

  // Open-Meteo returns `current.time` as a local ISO string already in the
  // selected location's own timezone (e.g. "2026-07-02T14:30"). Reading the
  // hour straight out of that string (rather than `new Date(...).getHours()`,
  // which would reinterpret it in the browser's timezone) keeps the greeting
  // accurate per-city instead of always reflecting the visitor's local time.
  const hour = weatherData?.current?.time
    ? parseInt(weatherData.current.time.split('T')[1].split(':')[0], 10)
    : new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : hour < 20
      ? "Good Evening"
      : "Good Night";

  const GreetingIcon =
    hour < 12
      ? Sunrise
      : hour < 17
      ? Sun
      : hour < 20
      ? Sunset
      : MoonStar;

  const currentTemp = weatherData
    ? Math.round(weatherData.current.temperature_2m)
    : "--";
  const weatherCondition = weatherData
    ? weatherData.current.weather_code
    : null;
  const wind = weatherData ? weatherData.current.wind_speed_10m : null;
  const humidity = weatherData ? weatherData.current.relative_humidity_2m : null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative mb-12 overflow-hidden rounded-[2rem]"
    >
      {/* Ambient floating glow orbs */}
      <motion.div
        className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-sky-500/20 blur-[100px] pointer-events-none"
        animate={{ y: [0, 25, 0], x: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-purple-500/15 blur-[110px] pointer-events-none"
        animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle dot-grid texture */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative grid lg:grid-cols-2 gap-10 items-center p-2">
        {/* Left Side */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 text-sky-300 font-semibold mb-4 bg-sky-500/10 border border-sky-500/20 px-3 py-1.5 rounded-full backdrop-blur-md w-fit"
          >
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em]">Welcome to AeroSky Premium</span>
          </motion.div>

          <motion.div
            variants={item}
            className="flex items-center gap-5"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/20 flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.2)]">

              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <GreetingIcon
                  className="w-10 h-10 text-yellow-300"
                  strokeWidth={2.2}
                />
              </motion.div>

            </div>

            <h1
              className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-br from-white via-sky-100 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(56,189,248,0.25)]"
            >
              {greeting}
            </h1>
          </motion.div>

          <motion.div
  variants={item}
  className="flex items-center justify-between mt-6"
>

  <div className="flex items-center gap-2 text-slate-300">

    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20">
      <MapPin className="text-sky-400" size={16} />
    </span>

    <span className="text-lg font-medium">
      {currentLocation.name}, {currentLocation.country}
    </span>

  </div>

  <FavoriteButton
    active={favorite}
    onClick={toggleFavorite}
  />

</motion.div>

          {weatherData && (
            <motion.div variants={item} className="flex items-center gap-3 mt-5">
              <div className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Wind size={14} className="text-sky-400" />
                {wind} km/h
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Droplets size={14} className="text-blue-400" />
                {humidity}%
              </div>
            </motion.div>
          )}

          <motion.div variants={item} className="mt-8">
            <SearchBar />
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ x: 30, opacity: 0, scale: 0.96 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.2 }}
          whileHover={{ y: -6 }}
          className="relative glass-panel rounded-3xl p-8 border border-white/10 shadow-[0_0_60px_rgba(56,189,248,0.08)] overflow-hidden"
        >
          {/* Inner glow accent */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-sky-400/20 blur-[80px] pointer-events-none" />
          <div className="relative">
            <LiveClock />

            <div className="mt-8 text-center relative">
              <p className="text-slate-400 uppercase tracking-[0.35em] text-xs font-semibold">
                Current Temperature
              </p>

              <div className="flex items-center justify-center gap-4 mt-4">
                {weatherCondition !== null && (
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {getWeatherIcon(weatherCondition)}
                  </motion.div>
                )}
                <motion.h2
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 140, delay: 0.4 }}
                  className="text-7xl md:text-8xl font-black bg-gradient-to-b from-white via-sky-200 to-sky-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(56,189,248,0.35)]"
                >
                  {currentTemp}°{isCelsius ? "C" : "F"}
                </motion.h2>
              </div>

              {weatherData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-5 inline-flex items-center gap-2 text-slate-300 text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  Weather Code: {weatherCondition}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}