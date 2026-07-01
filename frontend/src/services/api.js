import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

export const getWeatherData = async (lat, lon, timezone = 'auto') => {
  const response = await apiClient.get('/api/weather/dashboard', {
    params: { lat, lon, timezone }
  });
  return response.data;
};

export const searchCitiesByName = async (queryText) => {
  const response = await apiClient.get('/api/location/search', {
    params: { q: queryText }
  });
  return response.data;
};

export const reverseGeocodeCoords = async (lat, lon) => {
  const response = await apiClient.get('/api/location/reverse', {
    params: { lat, lon }
  });
  return response.data;
};