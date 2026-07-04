import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Radar as RadarIcon } from "lucide-react";
import GlobeSection from "../../globe/GlobeSection";
import RadarMap from "./RadarMap";

const TABS = [
  {
    id: "globe",
    label: "Globe",
    icon: Globe2,
    heading: "🌍 Explore the World",
    description: "Rotate the Earth and explore weather anywhere.",
  },
  {
    id: "radar",
    label: "Radar",
    icon: RadarIcon,
    heading: "🛰 Weather Radar",
    description: "Live map view centered on your selected city.",
  },
];

export default function RadarSection() {
  const [activeTab, setActiveTab] = useState("globe");
  const currentTab = TABS.find((tab) => tab.id === activeTab);

  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.005,
        boxShadow: "0 20px 60px rgba(56, 189, 248, 0.18)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="premium-card mt-8 relative overflow-hidden border border-white/10 hover:border-sky-400/30 transition-colors duration-300"
    >

      {/* Subtle noise/dot texture for depth */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:22px_22px] pointer-events-none" />

      {/* Glass reflection sheen across the top edge */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentTab.heading}
            </h2>
            <p className="text-slate-400">
              {currentTab.description}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 w-fit">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    active ? "text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="radar-globe-tab-highlight"
                      className="absolute inset-0 bg-sky-500/20 border border-sky-500/30 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={16} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {activeTab === "globe" ? <GlobeSection /> : <RadarMap />}
          </motion.div>
        </AnimatePresence>
      </div>

    </motion.div>
  );
}