import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getFavorites,
  saveFavorite,
  removeFavorite,
} from "../utils/favorites";
import { getWeatherData, reverseGeocodeCoords } from '../services/api';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    name: 'New York',
    state: 'New York',
    country: 'United States',
    lat: 40.7128,
    lon: -74.0060
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const [globeMarkers, setGlobeMarkers] = useState([
    // North America
    { name: "New York", state: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
    { name: "Los Angeles", state: "California", country: "United States", lat: 34.0522, lon: -118.2437 },
    { name: "Mexico City", state: "Mexico City", country: "Mexico", lat: 19.4326, lon: -99.1332 },

    // South America
    { name: "São Paulo", state: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333 },
    { name: "Buenos Aires", state: "Buenos Aires", country: "Argentina", lat: -34.6037, lon: -58.3816 },

    // Europe
    { name: "London", state: "England", country: "United Kingdom", lat: 51.5072, lon: -0.1276 },
    { name: "Paris", state: "Île-de-France", country: "France", lat: 48.8566, lon: 2.3522 },
    { name: "Moscow", state: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173 },

    // Africa
    { name: "Cairo", state: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357 },
    { name: "Lagos", state: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792 },
    { name: "Johannesburg", state: "Gauteng", country: "South Africa", lat: -26.2041, lon: 28.0473 },

    // Middle East
    { name: "Dubai", state: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },

    // Asia
    { name: "Delhi", state: "Delhi", country: "India", lat: 28.6139, lon: 77.209 },
    { name: "Beijing", state: "Beijing", country: "China", lat: 39.9042, lon: 116.4074 },
    { name: "Tokyo", state: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
    { name: "Singapore", state: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },

    // Oceania
    { name: "Sydney", state: "New South Wales", country: "Australia", lat: -33.8688, lon: 151.2093 },
  ]);
const [selectedMarker, setSelectedMarker] = useState(null);
const [favorites, setFavorites] = useState(getFavorites());

  const loadDashboardTelemetry = async (targetLocation) => {
    setLoading(true);
    setError(null);
    try {
      const payload = await getWeatherData(targetLocation.lat, targetLocation.lon);
      setWeatherData(payload.data);
      setCurrentLocation(targetLocation);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync weather data.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const addGlobeMarker = (city) => {
    setGlobeMarkers((prev) => {
      const exists = prev.some(
        (item) =>
          Math.abs(item.lat - city.lat) < 0.01 &&
          Math.abs(item.lon - city.lon) < 0.01
      );

      if (exists) return prev;

      return [...prev, city];
    });
  };
  const addFavoriteCity = (city) => {
  saveFavorite(city);

  setFavorites(getFavorites());
};

const removeFavoriteCity = (city) => {
  removeFavorite(city.lat, city.lon);

  setFavorites(getFavorites());
};

  const triggerBrowserGeolocationSync = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const addressMeta = await reverseGeocodeCoords(latitude, longitude);
          
          const consolidatedLoc = {
            name: addressMeta.location.city,
            state: addressMeta.location.state,
            country: addressMeta.location.country,
            lat: latitude,
            lon: longitude
          };
          
          await loadDashboardTelemetry(consolidatedLoc);
        } catch (err) {
          setError('Failed to resolve coordinates.');
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied.');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadDashboardTelemetry(currentLocation);
  }, []);

  return (
    <WeatherContext.Provider value={{
      weatherData,
      currentLocation,
      loading,
      selectedMarker,
      error,
      isCelsius,
      globeMarkers,
      favorites,
addFavoriteCity,
removeFavoriteCity,
      setSelectedMarker,
      addGlobeMarker,
      toggleUnitMetrics: () => setIsCelsius(!isCelsius),
      loadDashboardTelemetry,
      triggerBrowserGeolocationSync
    }}>
      {children}
    </WeatherContext.Provider>
  );
};