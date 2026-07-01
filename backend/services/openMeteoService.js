import axios from 'axios';
import { getCache, setCache } from '../cache/nodeCache.js';
import logger from '../utils/logger.js';

const BASE_URL = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

/**
 * Service to orchestrate requests to the Open-Meteo APIs.
 * Includes explicit error parsing and automated cache checking layers.
 */
export const fetchWeatherData = async (lat, lon, timezone = 'auto') => {
  const cacheKey = `weather_data_${lat}_${lon}`;
  const cachedData = getCache(cacheKey);

  // Return from memory cache instantly if within the TTL window
  if (cachedData) {
    logger.debug(`Cache collection intercept hit for coordinates: [${lat}, ${lon}]`);
    return cachedData;
  }

  try {
    logger.info(`Dispatching external grid queries to Open-Meteo APIs for Lat: ${lat}, Lon: ${lon}`);
    
    // Execute both independent forecast requests simultaneously to maximize processing throughput
    const [weatherResponse, airQualityResponse] = await Promise.all([
      axios.get(`${BASE_URL}/forecast`, {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,dew_point_2m,visibility',
          hourly: 'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
          timezone: timezone,
          models: 'best_match'
        }
      }),
      axios.get(AIR_QUALITY_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'european_aqi,us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
          timezone: timezone
        }
      })
    ]);

    // Aggregate external feeds into a standardized dashboard schema
    const consolidatedPayload = {
      current: weatherResponse.data.current,
      hourly: weatherResponse.data.hourly,
      daily: weatherResponse.data.daily,
      airQuality: airQualityResponse.data.current,
      metadata: {
        latitude: weatherResponse.data.latitude,
        longitude: weatherResponse.data.longitude,
        elevation: weatherResponse.data.elevation,
        timezone: weatherResponse.data.timezone,
        timezone_abbreviation: weatherResponse.data.timezone_abbreviation,
      }
    };

    // Store inside our in-memory cache container
    setCache(cacheKey, consolidatedPayload);

    return consolidatedPayload;
  } catch (error) {
    logger.error(`Failed to map meteorological data feeds from upstream providers: ${error.message}`);
    throw new Error('Upstream meteorological data cluster is temporarily unreachable.');
  }
};