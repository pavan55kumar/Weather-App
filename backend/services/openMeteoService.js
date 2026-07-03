import axios from 'axios';
import https from 'https';
import { getCache, setCache } from '../cache/nodeCache.js';
import logger from '../utils/logger.js';

const BASE_URL = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Upstream calls must never be allowed to hang indefinitely inside a
// serverless function — without an explicit timeout, axios will wait
// forever if Open-Meteo is slow/unreachable, and Vercel eventually kills
// the whole function after 300s with an opaque 504. Failing fast here lets
// us return a real error to the client in a few seconds instead.
const UPSTREAM_TIMEOUT_MS = 8000;

// Serverless environments (Vercel/AWS Lambda) sometimes attempt an IPv6
// connection first; if IPv6 egress isn't properly routed in that region,
// the socket just hangs instead of failing fast, which looks identical to
// a slow upstream API. Forcing IPv4 and disabling keep-alive (stale reused
// sockets across frozen/thawed Lambda invocations are another common cause
// of hangs) avoids both failure modes.
const outboundAgent = new https.Agent({ family: 4, keepAlive: false });

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

    const weatherStart = Date.now();
    const airQualityStart = Date.now();

    // Run both requests independently — if one is slow or fails, the other
    // can still succeed. We no longer let a struggling air-quality call take
    // down the entire dashboard response.
    const [weatherResult, airQualityResult] = await Promise.allSettled([
      axios.get(`${BASE_URL}/forecast`, {
        timeout: UPSTREAM_TIMEOUT_MS,
        httpsAgent: outboundAgent,
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,dew_point_2m,visibility',
          hourly: 'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant',
          timezone: timezone,
          models: 'best_match'
        }
      }).then((res) => {
        logger.info(`Forecast call succeeded in ${Date.now() - weatherStart}ms`);
        return res;
      }),
      axios.get(AIR_QUALITY_URL, {
        timeout: UPSTREAM_TIMEOUT_MS,
        httpsAgent: outboundAgent,
        params: {
          latitude: lat,
          longitude: lon,
          current: 'european_aqi,us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
          timezone: timezone
        }
      }).then((res) => {
        logger.info(`Air quality call succeeded in ${Date.now() - airQualityStart}ms`);
        return res;
      })
    ]);

    // The core forecast is required — if that failed, we have nothing useful to return.
    if (weatherResult.status === 'rejected') {
      logger.error(`Forecast call failed after ${Date.now() - weatherStart}ms: ${weatherResult.reason?.message}`);
      throw weatherResult.reason;
    }

    if (airQualityResult.status === 'rejected') {
      logger.warn(`Air quality call failed after ${Date.now() - airQualityStart}ms: ${airQualityResult.reason?.message}. Continuing without it.`);
    }

    const weatherResponse = weatherResult.value;
    const airQualityResponse = airQualityResult.status === 'fulfilled' ? airQualityResult.value : null;

    // Aggregate external feeds into a standardized dashboard schema
    const consolidatedPayload = {
      current: weatherResponse.data.current,
      hourly: weatherResponse.data.hourly,
      daily: weatherResponse.data.daily,
      airQuality: airQualityResponse ? airQualityResponse.data.current : null,
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
    if (error.code === 'ECONNABORTED') {
      logger.error(`Upstream Open-Meteo request timed out after ${UPSTREAM_TIMEOUT_MS}ms for [${lat}, ${lon}]`);
    } else {
      logger.error(`Failed to map meteorological data feeds from upstream providers: ${error.message}`);
    }
    throw new Error('Upstream meteorological data cluster is temporarily unreachable.');
  }
};