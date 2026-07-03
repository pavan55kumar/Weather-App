import React, { useEffect, useState } from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherEffects from './components/WeatherEffects'; // <-- Premium Effect Engine Imported
import HeroSection from './components/HeroSection';
import WeatherBackground from './components/WeatherBackground';
import RippleButton from './components/RippleButton';
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { CloudLightning, Thermometer, RefreshCw, ArrowUp } from 'lucide-react';
import GlobeSection from "./globe/GlobeSection";
import AIWeatherInsights from "./components/AIWeatherInsights";
import FavoriteCities from "./components/FavoriteCities";
import WeatherAnalytics from "./components/WeatherAnalytics";
import WeatherAlerts from "./components/WeatherAlerts";

/* ------------------------------------------------------------------ */
/* Small self-contained UI helpers (kept in this file on purpose, so  */
/* no other files in the project need to change).                    */
/* ------------------------------------------------------------------ */

// Thin animated bar pinned to the top of the viewport, tracks scroll %.
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-sky-400 via-indigo-400 to-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.6)]"
    />
  );
}

// Floating back-to-top button, fades/scales in once the user scrolls down.
function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-50 p-3.5 rounded-full bg-sky-500/90 hover:bg-sky-400 text-slate-950 shadow-xl shadow-sky-500/30 border border-sky-300/40 backdrop-blur-sm transition-colors duration-200 cursor-pointer"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={2.75} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Full-screen overlay shown only on the very first data fetch, so
// returning users refreshing a city aren't blocked by a full takeover.
function GlobalLoadingOverlay({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-slate-950/90 backdrop-blur-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
            className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400"
          >
            <CloudLightning className="h-8 w-8" />
          </motion.div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Booting Meteorological Core…
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Wraps a section so it fades/rises into view the first time it's scrolled to.
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function DashboardContainer() {
  const { loading, error, isCelsius, toggleUnitMetrics, weatherData } = useWeather();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!loading && weatherData) setHasLoadedOnce(true);
  }, [loading, weatherData]);

  const showFullScreenLoader = loading && !hasLoadedOnce;

  return (
    <div className="
      relative
      overflow-hidden
      w-full
      min-h-screen
      pb-5 sm:pb-7 lg:pb-10
      px-3 sm:px-5 lg:px-8
    ">
      <ScrollProgressBar />
      <GlobalLoadingOverlay show={showFullScreenLoader} />
      <BackToTopButton />

      <WeatherBackground />

      <WeatherEffects />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <header className="relative z-10 max-w-7xl mx-auto pt-6 pb-5 sm:pb-7 lg:pb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-900/60 mb-5 sm:mb-7 lg:mb-10">
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

        {weatherData && (
          <RippleButton
            onClick={toggleUnitMetrics}
            glowColor="rgba(56, 189, 248, 0.4)"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 border border-slate-800 hover:border-sky-500/30 text-slate-300 font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer shadow-lg"
          >
            <Thermometer className="h-4 w-4 text-sky-400" />
            Displaying Metric: °{isCelsius ? 'C' : 'F'}
          </RippleButton>
        )}
      </header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-7xl mx-auto flex flex-col gap-5 sm:gap-6 lg:gap-8">

        <Reveal>
          <HeroSection />
        </Reveal>

        {error && (
          <div className="w-full max-w-xl mx-auto p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-sm font-semibold text-rose-400 animate-shake">
            ⚠️ Exception Warning: {error}
          </div>
        )}

        {loading && hasLoadedOnce && (
          <div className="w-full flex items-center justify-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <RefreshCw className="h-3.5 w-3.5 text-sky-400 animate-spin" />
            Syncing telemetry arrays...
          </div>
        )}

        {!loading && !weatherData && !error && (
          <div className="w-full h-64 flex items-center justify-center text-slate-500 text-sm font-medium">
            Search a city to begin tracking conditions.
          </div>
        )}

        {weatherData && (
          <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8">
            <Reveal>
              <CurrentWeather />
            </Reveal>

            <Reveal delay={0.05}>
              <AIWeatherInsights />
            </Reveal>

            <Reveal delay={0.1}>
              <FavoriteCities />
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 items-start">
              <Reveal delay={0.1} className="lg:col-span-2 w-full">
                <HourlyForecast />
              </Reveal>

              <div className="w-full flex flex-col gap-5 sm:gap-6 lg:gap-8">
                <Reveal delay={0.15}>
                  <DailyForecast />
                </Reveal>
                <Reveal delay={0.2}>
                  <WeatherAnalytics />
                </Reveal>
                <Reveal delay={0.25}>
                  <WeatherAlerts />
                </Reveal>
                <Reveal delay={0.3}>
                  <GlobeSection />
                </Reveal>
              </div>
            </div>
          </div>
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