import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  Sun,
  Snowflake,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  ShieldAlert,
} from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export default function AIWeatherInsights() {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const current = weatherData.current;

  const insights = [];

  // Temperature
  if (current.temperature_2m >= 35)
    insights.push({
      icon: Flame,
      badgeClass: "bg-red-500/10 border-red-500/20 text-red-400",
      text: "It will be extremely hot today. Stay hydrated and avoid prolonged sun exposure.",
    });
  else if (current.temperature_2m >= 28)
    insights.push({
      icon: Sun,
      badgeClass: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      text: "Warm weather is expected throughout the day.",
    });
  else if (current.temperature_2m <= 10)
    insights.push({
      icon: Snowflake,
      badgeClass: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
      text: "Cold conditions today. Wear warm clothing.",
    });
  else
    insights.push({
      icon: CloudSun,
      badgeClass: "bg-sky-500/10 border-sky-500/20 text-sky-400",
      text: "Comfortable temperatures for most outdoor activities.",
    });

  // Rain
  if ([61, 63, 65, 80, 81, 82].includes(current.weather_code))
    insights.push({
      icon: CloudRain,
      badgeClass: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      text: "Carry an umbrella. Rain is expected.",
    });

  // Wind
  if (current.wind_speed_10m > 30)
    insights.push({
      icon: Wind,
      badgeClass: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
      text: "Strong winds may affect outdoor plans.",
    });

  // Humidity
  if (current.relative_humidity_2m > 80)
    insights.push({
      icon: Droplets,
      badgeClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      text: "High humidity may make it feel warmer.",
    });

  // UV
  if (current.uv_index >= 7)
    insights.push({
      icon: ShieldAlert,
      badgeClass: "bg-orange-500/10 border-orange-500/20 text-orange-400",
      text: "UV levels are high. Sunscreen is recommended.",
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card mt-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
          <Sparkles size={19} strokeWidth={2.4} />
        </span>
        <h2 className="text-2xl font-bold text-white">
          AI Weather Insights
        </h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-start gap-3"
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-lg border shrink-0 ${insight.badgeClass}`}
              >
                <Icon size={17} strokeWidth={2.2} />
              </span>
              <p className="text-slate-300 pt-1.5 leading-relaxed">
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}