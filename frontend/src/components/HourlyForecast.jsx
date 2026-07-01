import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useWeather } from '../context/WeatherContext';

export default function HourlyForecast() {
  const { weatherData, isCelsius } = useWeather();

  if (!weatherData) return null;

  const { hourly } = weatherData;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Parse chronological arrays into structured objects tracking the next 24 hours
  const chronologicalChartData = hourly.time
    .map((timeStr, index) => {
      const entryEpoch = Math.floor(new Date(timeStr).getTime() / 1000);
      const rawTemp = hourly.temperature_2m[index];
      const displayTemp = isCelsius ? Math.round(rawTemp) : Math.round((rawTemp * 9) / 5 + 32);

      return {
        epoch: entryEpoch,
        displayTime: new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        Temperature: displayTemp,
        Precipitation: Math.round(hourly.precipitation_probability[index])
      };
    })
    .filter(item => item.epoch >= currentTimestamp - 3600) // Keep current hour onwards
    .slice(0, 24); // Constrain display bounding box exactly to 24 cycles

  // Custom styling layout configuration matrix for chart overlays
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/90 border border-slate-800 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-400 mb-1">{payload[0].payload.displayTime}</p>
          <p className="text-sm font-semibold text-sky-400">Temp: {payload[0].value}°{isCelsius ? 'C' : 'F'}</p>
          <p className="text-sm font-semibold text-blue-400">Rain: {payload[1].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <div className="text-xs text-sky-400 font-bold tracking-widest uppercase">Chronological Vector</div>
        <h3 className="text-lg font-bold text-slate-200">24-Hour Atmospheric Timeline</h3>
      </div>

      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chronologicalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="displayTime" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area type="monotone" dataKey="Temperature" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
            <Area type="monotone" dataKey="Precipitation" stroke="#3b82f6" strokeWidth={1} fillOpacity={0} visible={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}