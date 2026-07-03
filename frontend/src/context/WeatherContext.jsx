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
    {
      name: "New York",
      state: "New York",
      country: "United States",
      lat: 40.7128,
      lon: -74.006,
    },
    {
      name: "Delhi",
      state: "Delhi",
      country: "India",
      lat: 28.6139,
      lon: 77.209,
    },
    {
      name: "London",
      state: "England",
      country: "United Kingdom",
      lat: 51.5072,
      lon: -0.1276,
    },
    {
      name: "Tokyo",
      state: "Tokyo",
      country: "Japan",
      lat: 35.6762,
      lon: 139.6503,
    },
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