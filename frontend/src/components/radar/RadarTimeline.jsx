import { Play, Pause } from "lucide-react";

function formatFrameLabel(frame, nowIndex, index) {
  const date = new Date(frame.time * 1000);
  const timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (index === nowIndex) return `${timeLabel} · Now`;
  if (index > nowIndex) return `${timeLabel} · +${(index - nowIndex) * 10}min`;
  return timeLabel;
}

export default function RadarTimeline({
  frames,
  nowIndex,
  selectedIndex,
  onChange,
  isPlaying,
  onTogglePlay,
}) {
  if (!frames || frames.length === 0) return null;

  const currentFrame = frames[selectedIndex];
  const isLive = selectedIndex === nowIndex;
  const isForecast = selectedIndex > nowIndex;

  return (
    <div className="absolute bottom-3 right-3 left-3 sm:left-auto sm:w-96 z-[400] bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-lg relative overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 hover:bg-sky-500/30 transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
          </button>

          <span className="text-xs font-semibold text-slate-200">
            {formatFrameLabel(currentFrame, nowIndex, selectedIndex)}
          </span>
        </div>

        {isLive && (
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        )}
        {isForecast && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 rounded-full px-2 py-0.5">
            Forecast
          </span>
        )}
      </div>

      <input
        type="range"
        min={0}
        max={frames.length - 1}
        value={selectedIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-800
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3.5
          [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-sky-400
          [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(56,189,248,0.9)]
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-white/80
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-125
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:w-3.5
          [&::-moz-range-thumb]:h-3.5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-sky-400
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-white/80
          [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(56,189,248,0.9)]"
      />

      {/* "Now" marker along the track, showing where past frames end and forecast begins */}
      <div className="relative h-1 mt-1">
        <div
          className="absolute top-0 w-0.5 h-2 bg-emerald-400"
          style={{ left: `${(nowIndex / (frames.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}