import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Sun,
  CloudRain,
} from "lucide-react";

const tabs = [
  {
    id: "temperature",
    label: "Temperature",
    icon: Thermometer,
  },
  {
    id: "humidity",
    label: "Humidity",
    icon: Droplets,
  },
  {
    id: "wind",
    label: "Wind",
    icon: Wind,
  },
  {
    id: "pressure",
    label: "Pressure",
    icon: Gauge,
  },
  {
    id: "uv",
    label: "UV Index",
    icon: Sun,
  },
  {
    id: "rain",
    label: "Rain",
    icon: CloudRain,
  },
];

export default function ChartTabs({
  selectedChart,
  setSelectedChart,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">

      {tabs.map((tab) => {

        const Icon = tab.icon;

        const active = selectedChart === tab.id;

        return (

          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedChart(tab.id)}
            className={`
              rounded-2xl
              p-4
              transition-all
              duration-300
              border

              ${
                active
                  ? "bg-sky-500/20 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)]"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }
            `}
          >

            <Icon
              className={`mx-auto mb-2 ${
                active
                  ? "text-sky-300"
                  : "text-slate-400"
              }`}
              size={24}
            />

            <p
              className={`text-sm font-semibold ${
                active
                  ? "text-white"
                  : "text-slate-400"
              }`}
            >
              {tab.label}
            </p>

          </motion.button>

        );

      })}

    </div>
  );
}