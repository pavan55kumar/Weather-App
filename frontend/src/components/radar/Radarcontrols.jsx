import { CloudRain, Cloud, Thermometer, Wind, Locate, Maximize, Minimize } from "lucide-react";

const LAYERS = [
  { id: "rain", label: "Rain", icon: CloudRain, available: true },
  { id: "clouds", label: "Clouds", icon: Cloud, available: true },
  { id: "temp", label: "Temp", icon: Thermometer, available: false },
  { id: "wind", label: "Wind", icon: Wind, available: false },
];

export default function RadarControls({
  activeLayer,
  onChangeLayer,
  onLocateMe,
  locating,
  isFullscreen,
  onToggleFullscreen,
}) {
  return (
    <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between gap-2 flex-wrap pointer-events-none">

      {/* Layer toggles */}
      <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full p-1 pointer-events-auto shadow-lg">
        {LAYERS.map((layer) => {
          const Icon = layer.icon;
          const active = activeLayer === layer.id;

          return (
            <button
              key={layer.id}
              disabled={!layer.available}
              title={layer.available ? layer.label : `${layer.label} (requires API key — coming soon)`}
              onClick={() => layer.available && onChangeLayer(active ? null : layer.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? "bg-sky-500/25 border border-sky-400/40 text-sky-200"
                  : "text-slate-300 hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon size={14} />
              {layer.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        {/* My Location */}
        <button
          onClick={onLocateMe}
          disabled={locating}
          title="Use my current location"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-sky-300 hover:border-sky-400/40 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Locate size={14} className={locating ? "animate-spin" : ""} />
          My Location
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-sky-300 hover:border-sky-400/40 transition-all cursor-pointer shadow-lg"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>
      </div>

    </div>
  );
}