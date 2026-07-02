import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export default function AIWeatherInsights() {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const current = weatherData.current;

  const insights = [];

  // Temperature
  if (current.temperature_2m >= 35)
    insights.push("🔥 It will be extremely hot today. Stay hydrated and avoid prolonged sun exposure.");

  else if (current.temperature_2m >= 28)
    insights.push("☀️ Warm weather is expected throughout the day.");

  else if (current.temperature_2m <= 10)
    insights.push("🥶 Cold conditions today. Wear warm clothing.");

  else
    insights.push("🌤️ Comfortable temperatures for most outdoor activities.");

  // Rain
  if ([61,63,65,80,81,82].includes(current.weather_code))
    insights.push("🌧 Carry an umbrella. Rain is expected.");

  // Wind
  if (current.wind_speed_10m > 30)
    insights.push("💨 Strong winds may affect outdoor plans.");

  // Humidity
  if (current.relative_humidity_2m > 80)
    insights.push("💧 High humidity may make it feel warmer.");

  // UV
  if (current.uv_index >= 7)
    insights.push("🧴 UV levels are high. Sunscreen is recommended.");

  return (
    <motion.div
      initial={{ opacity:0,y:20 }}
      animate={{ opacity:1,y:0 }}
      className="premium-card mt-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <Sparkles className="text-sky-400" />
        <h2 className="text-2xl font-bold text-white">
          AI Weather Insights
        </h2>
      </div>

      <div className="space-y-4">
        {insights.map((tip,index)=>(
          <div
            key={index}
            className="rounded-xl bg-white/5 border border-white/10 p-4 text-slate-300"
          >
            {tip}
          </div>
        ))}
      </div>
    </motion.div>
  );
}