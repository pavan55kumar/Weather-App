import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Thermometer,
  Snowflake,
  Wind,
  Droplets,
  CloudRain,
  CloudLightning,
  Sun,
  CheckCircle2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "../context/WeatherContext";

// Severity tiers, from calmest to most urgent
const SEVERITY = {
  info: {
    label: "Info",
    dot: "🟢",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    glow: "shadow-[0_0_25px_rgba(16,185,129,0.08)]",
  },
  watch: {
    label: "Watch",
    dot: "🟡",
    badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.1)]",
  },
  warning: {
    label: "Warning",
    dot: "🟠",
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    glow: "shadow-[0_0_25px_rgba(249,115,22,0.12)]",
  },
  extreme: {
    label: "Extreme",
    dot: "🔴",
    badgeClass: "bg-red-500/15 text-red-300 border-red-500/30",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.15)]",
  },
};

// "2026-07-02T14:00" -> "2 PM"
function formatHourLabel(dateInput) {
  const d = new Date(dateInput);
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h} ${ampm}`;
}

// Scans the next 24h of hourly data for the first/last hour matching a
// condition and returns a human time range like "2 PM – 6 PM".
function getTimeRange(hourlyTimes, values, predicate) {
  if (!hourlyTimes || !values || !values.length) return null;

  let startIdx = -1;
  let endIdx = -1;
  const span = Math.min(24, hourlyTimes.length, values.length);

  for (let i = 0; i < span; i++) {
    if (predicate(values[i])) {
      if (startIdx === -1) startIdx = i;
      endIdx = i;
    }
  }

  if (startIdx === -1) return null;

  const startLabel = formatHourLabel(hourlyTimes[startIdx]);
  const endDate = new Date(hourlyTimes[endIdx]);
  endDate.setHours(endDate.getHours() + 1);
  const endLabel = formatHourLabel(endDate);

  return `${startLabel} – ${endLabel}`;
}

export default function WeatherAlerts() {

  const { weatherData } = useWeather();
  const [dismissed, setDismissed] = useState(new Set());

  const alerts = useMemo(() => {
    if (!weatherData) return [];

    const current = weatherData.current;
    const hourly = weatherData.hourly;
    const times = hourly?.time;

    const list = [];

    // High Temperature
    if (current.temperature_2m >= 35) {
      list.push({
        id: "heat",
        title: "Heat Advisory",
        message: "High temperatures are expected today. Stay hydrated.",
        icon: Thermometer,
        severity: current.temperature_2m >= 40 ? "extreme" : "warning",
        timeRange: getTimeRange(times, hourly?.temperature_2m, (v) => v >= 35),
        accent: "text-red-400",
        animate: { scale: [1, 1.12, 1] },
      });
    }

    // Cold
    if (current.temperature_2m <= 5) {
      list.push({
        id: "cold",
        title: "Cold Weather",
        message: "Dress warmly. Low temperatures expected.",
        icon: Snowflake,
        severity: current.temperature_2m <= 0 ? "warning" : "watch",
        timeRange: getTimeRange(times, hourly?.temperature_2m, (v) => v <= 5),
        accent: "text-cyan-300",
        animate: { rotate: [0, 15, -15, 0] },
      });
    }

    // Wind
    if (current.wind_speed_10m >= 30) {
      list.push({
        id: "wind",
        title: "Strong Wind",
        message: "Strong winds may affect outdoor activities.",
        icon: Wind,
        severity: current.wind_speed_10m >= 50 ? "warning" : "watch",
        timeRange: getTimeRange(times, hourly?.wind_speed_10m, (v) => v >= 30),
        accent: "text-sky-300",
        animate: { x: [0, 4, 0, -4, 0] },
      });
    }

    // Humidity
    if (current.relative_humidity_2m >= 85) {
      list.push({
        id: "humidity",
        title: "High Humidity",
        message: "Conditions may feel warmer than the actual temperature.",
        icon: Droplets,
        severity: "info",
        timeRange: getTimeRange(times, hourly?.relative_humidity_2m, (v) => v >= 85),
        accent: "text-emerald-300",
        animate: { y: [0, 4, 0] },
      });
    }

    // Rain
    if ([61, 63, 65, 80, 81, 82].includes(current.weather_code)) {
      list.push({
        id: "rain",
        title: "Rain Expected",
        message: "Carry an umbrella when going outside.",
        icon: CloudRain,
        severity: "watch",
        timeRange: getTimeRange(times, hourly?.weather_code, (v) =>
          [61, 63, 65, 80, 81, 82].includes(v)
        ),
        accent: "text-blue-300",
        animate: { y: [0, 3, 0] },
      });
    }

    // Thunderstorm
    if (current.weather_code >= 95) {
      list.push({
        id: "thunderstorm",
        title: "Thunderstorm Warning",
        message: "Avoid open areas during thunderstorms.",
        icon: CloudLightning,
        severity: "extreme",
        timeRange: getTimeRange(times, hourly?.weather_code, (v) => v >= 95),
        accent: "text-yellow-300",
        animate: { opacity: [1, 0.4, 1] },
      });
    }

    // UV
    if (current.uv_index >= 7) {
      list.push({
        id: "uv",
        title: "High UV Index",
        message: "Use sunscreen and avoid prolonged exposure.",
        icon: Sun,
        severity: current.uv_index >= 10 ? "warning" : "watch",
        timeRange: getTimeRange(times, hourly?.uv_index, (v) => v >= 7),
        accent: "text-orange-300",
        animate: { rotate: [0, 360] },
      });
    }

    if (list.length === 0) {
      list.push({
        id: "clear",
        title: "No Alerts",
        message: "Current weather conditions look good.",
        icon: CheckCircle2,
        severity: "info",
        timeRange: null,
        accent: "text-green-400",
        animate: { scale: [1, 1.08, 1] },
      });
    }

    return list;
  }, [weatherData]);

  if (!weatherData) return null;

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id));

  const handleDismiss = (id) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  return (
    <div className="premium-card mt-8">

      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-yellow-400 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Weather Alerts
          </h2>
        </div>
        {visibleAlerts.length > 0 && (
          <span className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            {visibleAlerts.length} active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">

        <AnimatePresence>

          {visibleAlerts.length === 0 && (
            <motion.div
              key="all-clear"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-400 text-sm text-center py-6 sm:col-span-2"
            >
              All alerts dismissed. ✨
            </motion.div>
          )}

          {visibleAlerts.map((alert, index) => {
            const sev = SEVERITY[alert.severity];
            const Icon = alert.icon;

            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                transition={{ delay: index * 0.08 }}
                className={`relative rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 ${sev.glow} overflow-hidden`}
              >
                <button
                  onClick={() => handleDismiss(alert.id)}
                  aria-label="Dismiss alert"
                  className="absolute top-3 right-3 text-slate-500 hover:text-slate-200 hover:bg-white/10 rounded-full p-1 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>

                <div className="flex items-start gap-3 pr-6">
                  <motion.div
                    animate={alert.animate}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className={`shrink-0 mt-0.5 ${alert.accent}`}
                  >
                    <Icon size={26} />
                  </motion.div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="font-bold text-white text-sm sm:text-base">
                        {alert.title}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${sev.badgeClass}`}
                      >
                        {sev.dot} {sev.label}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {alert.message}
                    </p>

                    {alert.timeRange && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                        ⏰ {alert.timeRange}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

        </AnimatePresence>

      </div>

    </div>
  );

}