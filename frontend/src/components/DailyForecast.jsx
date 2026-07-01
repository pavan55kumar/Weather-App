import React from 'react';
import { Calendar, Umbrella } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherCondition } from './CurrentWeather';

export default function DailyForecast() {
  const { weatherData, isCelsius } = useWeather();

  if (!weatherData) return null;

  const { daily } = weatherData;

  const formatCalendarDayName = (dateStr) => {
    const day = new Date(dateStr);
    const today = new Date();
    
    if (day.toDateString() === today.toDateString()) return 'Today';
    
    return day.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div className="flex flex-col gap-0.5">
          <div className="text-xs text-sky-400 font-bold tracking-widest uppercase">Outlook Scope Matrix</div>
          <h3 className="text-lg font-bold text-slate-200">7-Day Extended Macro Forecast</h3>
        </div>
        <Calendar className="h-5 w-5 text-slate-500" />
      </div>

      <div className="flex flex-col gap-3">
        {daily.time.map((dateString, idx) => {
          const rawMax = daily.temperature_2m_max[idx];
          const rawMin = daily.temperature_2m_min[idx];
          const precipProb = Math.round(daily.precipitation_probability_max[idx]);

          const maxTemp = isCelsius ? Math.round(rawMax) : Math.round((rawMax * 9) / 5 + 32);
          const minTemp = isCelsius ? Math.round(rawMin) : Math.round((rawMin * 9) / 5 + 32);

          return (
            <div 
              key={dateString} 
              className="flex items-center justify-between p-3 bg-slate-950/20 border border-slate-900/40 rounded-xl hover:bg-slate-900/30 transition-colors duration-200"
            >
              {/* Day Indicator */}
              <div className="w-28 font-semibold text-sm text-slate-300">
                {formatCalendarDayName(dateString)}
              </div>

              {/* Rain Risk Indicator */}
              <div className="flex items-center gap-1.5 w-16 text-left">
                {precipProb > 15 ? (
                  <>
                    <Umbrella className="h-4 w-4 text-blue-400 shrink-0" />
                    <span className="text-xs font-bold text-blue-400">{precipProb}%</span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-slate-600">—</span>
                )}
              </div>

              {/* Textual Description Marker */}
              <div className="hidden sm:block flex-1 text-center text-xs font-medium text-slate-400">
                {getWeatherCondition(daily.weather_code[idx])}
              </div>

              {/* Dynamic Min / Max Range Splitter */}
              <div className="flex items-center gap-3 text-right">
                <span className="text-sm font-bold text-slate-100">{maxTemp}°</span>
                <span className="text-sm font-semibold text-slate-500">{minTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}