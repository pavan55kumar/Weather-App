import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

import { useWeather } from "../context/WeatherContext";
import ChartTabs from "./ChartTabs";

// Per-chart color theme + display metadata. Each theme drives the line/area/bar
// color, its gradient fill, and the labels shown in the stat cards + tooltip.
const CHART_THEME = {
  temperature: {
    key: "temperature",
    label: "Temperature",
    unit: "°",
    icon: "🌡️",
    color: "#38bdf8",
    color2: "#0ea5e9",
  },
  humidity: {
    key: "humidity",
    label: "Humidity",
    unit: "%",
    icon: "💧",
    color: "#34d399",
    color2: "#10b981",
  },
  wind: {
    key: "wind",
    label: "Wind Speed",
    unit: " km/h",
    icon: "🌬️",
    color: "#22d3ee",
    color2: "#06b6d4",
  },
  pressure: {
    key: "pressure",
    label: "Pressure",
    unit: " hPa",
    icon: "🧭",
    color: "#f59e0b",
    color2: "#d97706",
  },
  uv: {
    key: "uv",
    label: "UV Index",
    unit: "",
    icon: "☀️",
    color: "#facc15",
    color2: "#eab308",
  },
  rain: {
    key: "rain",
    label: "Rain Chance",
    unit: "%",
    icon: "🌧️",
    color: "#3b82f6",
    color2: "#2563eb",
  },
};

// Glassmorphism tooltip shared by every chart
function GlassTooltip({ active, payload, label, theme }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1">
        {label}
      </div>
      <div className="flex items-center gap-2 text-sm font-bold text-white">
        <span>{theme.icon}</span>
        <span style={{ color: theme.color }}>
          {typeof value === "number" ? Math.round(value * 10) / 10 : value}
          {theme.unit}
        </span>
      </div>
    </div>
  );
}

// Small "Now" flag rendered above the current-hour reference line
function NowLabel({ viewBox }) {
  if (!viewBox) return null;
  const { x, y } = viewBox;
  return (
    <g>
      <rect x={x - 18} y={y - 4} width={36} height={18} rx={9} fill="#38bdf8" opacity={0.9} />
      <text x={x} y={y + 8.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#020617">
        NOW
      </text>
    </g>
  );
}

export default function WeatherAnalytics() {

  const { weatherData } = useWeather();

  const [selectedChart, setSelectedChart] =
    useState("temperature");

  if (!weatherData) return null;

  const hourly = weatherData.hourly;

  const data = hourly.time.slice(0, 24).map((time, index) => ({

    hour: new Date(time).getHours() + ":00",

    temperature: hourly.temperature_2m[index],

    humidity: hourly.relative_humidity_2m[index],

    wind: hourly.wind_speed_10m[index],

    pressure: hourly.surface_pressure?.[index] ?? 0,

    uv: hourly.uv_index?.[index] ?? 0,

    rain:
      hourly.precipitation_probability?.[index] ?? 0,

  }));

  const theme = CHART_THEME[selectedChart];
  const gradientId = `chartGradient-${selectedChart}`;
  const currentHourLabel = `${new Date().getHours()}:00`;

  // Min / max / average for whichever metric is currently selected
  const stats = useMemo(() => {
    const values = data.map((d) => d[theme.key]).filter((v) => typeof v === "number");
    if (!values.length) return { min: 0, max: 0, avg: 0 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    return {
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
      avg: Math.round(avg * 10) / 10,
    };
  }, [data, theme.key]);

  const sharedGradientDefs = (
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={theme.color} stopOpacity={0.55} />
        <stop offset="100%" stopColor={theme.color2} stopOpacity={0.02} />
      </linearGradient>
      <linearGradient id={`${gradientId}-line`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={theme.color2} />
        <stop offset="100%" stopColor={theme.color} />
      </linearGradient>
    </defs>
  );

  const sharedAxisProps = {
    stroke: "#475569",
    tick: { fill: "#94a3b8", fontSize: 12 },
  };

  const renderChart = () => {

    switch (selectedChart) {

      case "temperature":
      case "pressure":

        return (

          <LineChart data={data}>

            {sharedGradientDefs}

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis dataKey="hour" {...sharedAxisProps} />

            <YAxis {...sharedAxisProps} />

            <Tooltip content={<GlassTooltip theme={theme} />} cursor={{ stroke: theme.color, strokeOpacity: 0.2, strokeWidth: 2 }} />

            <ReferenceLine
              x={currentHourLabel}
              stroke={theme.color}
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={<NowLabel />}
            />

            <Line
              type="monotone"
              dataKey={theme.key}
              stroke={`url(#${gradientId}-line)`}
              strokeWidth={4}
              dot={false}
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
            />

          </LineChart>

        );

      case "humidity":
      case "uv":
      case "rain":

        return (

          <AreaChart data={data}>

            {sharedGradientDefs}

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis dataKey="hour" {...sharedAxisProps} />

            <YAxis {...sharedAxisProps} />

            <Tooltip content={<GlassTooltip theme={theme} />} cursor={{ stroke: theme.color, strokeOpacity: 0.2, strokeWidth: 2 }} />

            <ReferenceLine
              x={currentHourLabel}
              stroke={theme.color}
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={<NowLabel />}
            />

            <Area
              type="monotone"
              dataKey={theme.key}
              stroke={theme.color}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
            />

          </AreaChart>

        );

      case "wind":

        return (

          <BarChart data={data}>

            {sharedGradientDefs}

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis dataKey="hour" {...sharedAxisProps} />

            <YAxis {...sharedAxisProps} />

            <Tooltip content={<GlassTooltip theme={theme} />} cursor={{ fill: theme.color, fillOpacity: 0.08 }} />

            <ReferenceLine
              x={currentHourLabel}
              stroke={theme.color}
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={<NowLabel />}
            />

            <Bar
              dataKey="wind"
              fill={`url(#${gradientId})`}
              stroke={theme.color}
              strokeWidth={1}
              radius={[6, 6, 0, 0]}
              isAnimationActive
              animationDuration={1000}
              animationEasing="ease-out"
            />

          </BarChart>

        );

      default:
        return null;

    }

  };

  return (

    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card mt-8"
    >

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 shrink-0">
            <TrendingUp size={19} strokeWidth={2.4} />
          </span>
          Weather Analytics
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedChart}-header`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit"
            style={{ color: theme.color }}
          >
            <span>{theme.icon}</span>
            <span>{theme.label} (24h)</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <ChartTabs
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
      />

      {/* Min / Max / Average stat cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedChart}-stats`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-3 gap-2 sm:gap-4 my-5"
        >
          {[
            { label: "Min", value: stats.min },
            { label: "Avg", value: stats.avg },
            { label: "Max", value: stats.max },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3 py-3 sm:px-4 sm:py-4 text-center"
            >
              <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-semibold">
                {s.label}
              </div>
              <div
                className="text-lg sm:text-2xl font-black mt-1"
                style={{ color: theme.color }}
              >
                {s.value}
                <span className="text-xs sm:text-sm font-semibold ml-0.5 text-slate-300">
                  {theme.unit}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">

        <motion.div
          key={selectedChart}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
          className="h-[280px] sm:h-[420px] -ml-3 sm:ml-0"
        >

          <ResponsiveContainer>

            {renderChart()}

          </ResponsiveContainer>

        </motion.div>

      </AnimatePresence>

    </motion.div>

  );

}