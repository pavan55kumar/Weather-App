import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchCitiesByName } from '../services/api';
import { useWeather } from '../context/WeatherContext';
import { globeTargetRotation } from "../globe/GlobeControls";
import { latLonToQuaternion } from "../globe/utils";
import { cameraTarget, FOCUSED_DISTANCE } from "../globe/CameraController";
import VoiceSearchButton from './VoiceSearchButton';


export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [dropdownRect, setDropdownRect] = useState(null);
  const containerRef = useRef(null);
  const portalListRef = useRef(null);

  const {
  loadDashboardTelemetry,
  addGlobeMarker,
  triggerBrowserGeolocationSync,
  loading,
   setSelectedMarker,
} = useWeather();

  // Close dropdown if user clicks anywhere outside the search container OR
  // the portaled dropdown itself (the list now lives in document.body, so a
  // click on it would otherwise register as "outside" the input container).
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideContainer =
        containerRef.current && containerRef.current.contains(event.target);
      const clickedInsideDropdown =
        portalListRef.current && portalListRef.current.contains(event.target);

      if (!clickedInsideContainer && !clickedInsideDropdown) {
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

  // Keep the portal-rendered dropdown glued to the input's real screen position,
  // since it now lives outside the normal DOM flow (in document.body).
  useLayoutEffect(() => {
    if (!isDropdownOpen) return;

    const updateRect = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    };

    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [isDropdownOpen, results]);

  const handleSelectCity = (city) => {
  const descriptiveLocation = {
  name: city.name,
  state: city.admin1 || "",
  country: city.country || "",
  lat: city.latitude,
  lon: city.longitude,
};

  // Use the same quaternion-based rotation GlobeGroup uses for marker
  // clicks. globeTargetRotation is a THREE.Quaternion, not an Euler —
  // writing raw radian values into its .x/.y (as the old latLonToRotation
  // formula did) corrupts it into an invalid rotation, which is what was
  // causing the globe to spin to the wrong place entirely on search.
  const targetQuaternion = latLonToQuaternion(
    descriptiveLocation.lat,
    descriptiveLocation.lon
  );
  globeTargetRotation.copy(targetQuaternion);

  cameraTarget.z = FOCUSED_DISTANCE;
  addGlobeMarker(descriptiveLocation);
  setSelectedMarker(descriptiveLocation);

  loadDashboardTelemetry(descriptiveLocation);

  setQuery("");
  setIsDropdownOpen(false);
};
  const showDropdown = isDropdownOpen && results.length > 0;

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={containerRef}>
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

        <VoiceSearchButton />
      </div>

      {/* Suggestion Dropdown Matrix — portaled to <body> so parent stacking
          contexts (created by framer-motion transforms/opacity) can never bury it */}
      {showDropdown && dropdownRect &&
        createPortal(
          <ul
            ref={portalListRef}
            style={{
              position: 'fixed',
              top: dropdownRect.top,
              left: dropdownRect.left,
              width: dropdownRect.width,
            }}
            className="z-[9999] max-h-64 overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] divide-y divide-slate-800/50 backdrop-blur-xl no-scrollbar animate-fadeIn"
          >
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
          </ul>,
          document.body
        )}
    </div>
  );
}