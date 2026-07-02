import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherEffects from './components/WeatherEffects'; // <-- Premium Effect Engine Imported
import HeroSection from './components/HeroSection';
import WeatherBackground from './components/WeatherBackground';
import { motion } from "framer-motion";
import { CloudLightning, Thermometer, RefreshCw } from 'lucide-react';
import GlobeSection from "./globe/GlobeSection";



function DashboardContainer() {
  const { loading, error, isCelsius, toggleUnitMetrics, weatherData } = useWeather();

  return (
    // Added 'relative' to anchor the particles, and 'overflow-hidden' to prevent canvas scroll bleeds
    <div className="relative overflow-hidden min-gradient-wrapper w-full min-h-screen pb-12 px-4 sm:px-6 lg:px-8">

      <WeatherBackground />

      {/* Wires ambient weather physics directly into the layout background matrix */}
      <WeatherEffects />

      {/* Decorative background visual elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Corporate Global Nav Header */}
      <header className="relative z-10 max-w-7xl mx-auto pt-6 pb-8 flex items-center justify-between border-b border-slate-900/60 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl shadow-inner text-sky-400 animate-spin-slow">
            <CloudLightning className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-50">
              AEROSKY <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-500/10 px-2 py-0.5 rounded ml-1.5 border border-sky-500/20">Premium</span>
            </h1>
            <p className="text-xs font-medium text-slate-500">Enterprise Meteorological Core v2.4</p>
          </div>
        </div>

        {/* Toggle Switch to Metric/Imperial Systems */}
        {weatherData && (
          <button 
            onClick={toggleUnitMetrics}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-slate-800 hover:border-sky-500/30 text-slate-300 font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer shadow-lg"
          >
            <Thermometer className="h-4 w-4 text-sky-400" />
            Displaying Metric: °{isCelsius ? 'C' : 'F'}
          </button>
        )}
      </header>

      {/* Main Structural Core Grid Framework */}
      <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-7xl mx-auto flex flex-col gap-8">

        <HeroSection />

        {/* System Error Notification Panels */}
        {error && (
          <div className="w-full max-w-xl mx-auto p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-sm font-semibold text-rose-400 animate-shake">
            ⚠️ Exception Warning: {error}
          </div>
        )}

        {/* Global Structural Action Interceptor Overlays */}
        {loading ? (
          <div className="w-full h-96 flex flex-col gap-3 items-center justify-center text-slate-400 font-medium">
            <RefreshCw className="h-8 w-8 text-sky-400 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Syncing telemetry arrays...</span>
          </div>
        ) : (
          weatherData && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <CurrentWeather />
              <GlobeSection />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 w-full">
                  <HourlyForecast />
                </div>
                <div className="w-full">
                  <DailyForecast />
                </div>
              </div>
            </div>
          )
        )}
      </motion.main>
    </div>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <DashboardContainer />
    </WeatherProvider>
  );
}