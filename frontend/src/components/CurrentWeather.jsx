import React from 'react';
import { Wind, Droplets, Sun, Compass, Eye, Gauge } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

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
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-400 bg-emerald-500/10' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-amber-400 bg-amber-500/10' };
    return { label: 'Unhealthy', color: 'text-rose-400 bg-rose-500/10' };
  };

  const aqiMeta = getAQIDesc(airQuality.us_aqi);

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
      {/* Primary Metrics Group */}
      <div className="flex flex-col text-center md:text-left gap-2">
        <div className="text-sm text-sky-400 font-semibold tracking-widest uppercase">Live Tracking Matrix</div>
        <h2 className="text-3xl font-extrabold text-slate-100">{currentLocation.name}</h2>
        <div className="text-sm text-slate-400">
          {currentLocation.state ? `${currentLocation.state}, ` : ''}{currentLocation.country}
        </div>
        <div className="flex items-start justify-center md:justify-start gap-1 mt-4">
          <span className="text-7xl font-black tracking-tighter text-slate-50">{displayTemp}</span>
          <span className="text-3xl font-bold text-sky-400 mt-1">°{isCelsius ? 'C' : 'F'}</span>
        </div>
        <div className="text-sm text-slate-400 font-medium">
          Feels like <span className="text-slate-200 font-bold">{displayFeel}°</span> • {getWeatherCondition(current.weather_code)}
        </div>
      </div>

      {/* Grid Matrix Details Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:max-w-xl">
        <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl flex items-center gap-3">
          <Wind className="h-5 w-5 text-sky-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Wind Speed</div>
            <div className="text-sm font-semibold text-slate-200">{current.wind_speed_10m} km/h</div>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl flex items-center gap-3">
          <Droplets className="h-5 w-5 text-blue-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Humidity</div>
            <div className="text-sm font-semibold text-slate-200">{current.relative_humidity_2m}%</div>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl flex items-center gap-3">
          <Sun className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">UV Radiation</div>
            <div className="text-sm font-semibold text-slate-200">{current.uv_index} Index</div>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl flex items-center gap-3">
          <Compass className="h-5 w-5 text-indigo-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Air Pressure</div>
            <div className="text-sm font-semibold text-slate-200">{Math.round(current.surface_pressure)} hPa</div>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl flex items-center gap-3">
          <Eye className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Visibility</div>
            <div className="text-sm font-semibold text-slate-200">{Math.round(current.visibility / 1000)} km</div>
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl flex items-center gap-3">
          <Gauge className="h-5 w-5 text-purple-400 shrink-0" />
          <div>
            <div className="text-xs text-slate-500 font-medium">US EPA AQI</div>
            <div className={`text-xs px-2 py-0.5 mt-0.5 rounded font-bold inline-block ${aqiMeta.color}`}>
              {airQuality.us_aqi} - {aqiMeta.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}