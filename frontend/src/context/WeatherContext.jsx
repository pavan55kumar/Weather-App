import React, { createContext, useContext, useState, useEffect } from 'react';
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
      error,
      isCelsius,
      toggleUnitMetrics: () => setIsCelsius(!isCelsius),
      loadDashboardTelemetry,
      triggerBrowserGeolocationSync
    }}>
      {children}
    </WeatherContext.Provider>
  );
};