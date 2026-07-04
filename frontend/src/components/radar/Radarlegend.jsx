export default function RadarLegend({ activeLayer }) {
  if (!activeLayer) return null;

  const config = {
    rain: {
      label: "Precipitation Intensity",
      gradient: "from-sky-300 via-blue-500 to-purple-600",
    },
    clouds: {
      label: "Cloud Density",
      gradient: "from-slate-100 via-slate-400 to-slate-700",
    },
  }[activeLayer];

  if (!config) return null;

  return (
    <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
        {config.label}
      </p>
      <div className={`h-2 w-40 rounded-full bg-gradient-to-r ${config.gradient}`} />
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>Light</span>
        <span>Heavy</span>
      </div>
    </div>
  );
}