import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchCitiesByName } from '../services/api';
import { useWeather } from '../context/WeatherContext';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef(null);
  
  const { loadDashboardTelemetry, triggerBrowserGeolocationSync, loading } = useWeather();

  // Close dropdown if user clicks anywhere outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simple debounced lookup engine to prevent spamming the geocoding server
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchCitiesByName(query);
        setResults(data.results || []);
        setIsDropdownOpen(true);
      } catch (err) {
        console.error('Failed to resolve city queries:', err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectCity = (city) => {
    const descriptiveLocation = {
      name: city.name,
      state: city.admin1 || '',
      country: city.country || '',
      lat: city.latitude,
      lon: city.longitude
    };
    loadDashboardTelemetry(descriptiveLocation);
    setQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto z-50" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search city destinations globally..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsDropdownOpen(true)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-12 pr-10 text-slate-200 placeholder-slate-400 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all duration-200 backdrop-blur-md"
          />
          {searching && (
            <Loader2 className="absolute right-4 top-3.5 h-5 w-5 text-sky-400 animate-spin" />
          )}
        </div>
        
        <button
          onClick={triggerBrowserGeolocationSync}
          disabled={loading}
          title="Use current GPS position"
          className="p-3 bg-slate-900/80 border border-slate-800 hover:border-sky-500/30 text-sky-400 hover:text-sky-300 rounded-xl transition-all duration-200 disabled:opacity-50 backdrop-blur-md cursor-pointer"
        >
          <MapPin className="h-5 w-5" />
        </button>
      </div>

      {/* Suggestion Dropdown Matrix */}
      {isDropdownOpen && results.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl divide-y divide-slate-800/50 backdrop-blur-xl no-scrollbar animate-fadeIn">
          {results.map((city) => (
            <li key={city.id}>
              <button
                onClick={() => handleSelectCity(city)}
                className="w-full text-left px-4 py-3 hover:bg-slate-800/40 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-medium text-slate-200">{city.name}</span>
                  {city.admin1 && <span className="text-sm text-slate-400 ml-2">, {city.admin1}</span>}
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded-md text-slate-400 uppercase tracking-wider">
                  {city.country_code || 'GEO'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}