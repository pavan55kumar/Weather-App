import axios from 'axios';
import { getCache, setCache } from '../cache/nodeCache.js';
import logger from '../utils/logger.js';

const GEOCODE_URL = process.env.GEOCODE_BASE_URL || 'https://geocoding-api.open-meteo.com/v1';
const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse';

/**
 * Service to manage geographic translation pipelines (Geocoding / Reverse Geocoding).
 */
export const searchLocationByName = async (name, count = 10, language = 'en') => {
  const cleanName = name.toLowerCase().trim();
  const cacheKey = `geo_search_${cleanName}_${language}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    logger.info(`Searching geographic catalog databases for keyword token: "${cleanName}"`);
    const response = await axios.get(`${GEOCODE_URL}/search`, {
      params: {
        name: cleanName,
        count: count,
        language: language,
        format: 'json'
      }
    });

    const locations = response.data.results || [];
    
    // Store search matches with a shorter 5-minute cache window to match rapid text inputs
    setCache(cacheKey, locations, 300);

    return locations;
  } catch (error) {
    logger.error(`Geographical index lookup failed for target token "${cleanName}": ${error.message}`);
    throw new Error('Geographic spatial engine query failed.');
  }
};

export const reverseGeocodeCoords = async (lat, lon) => {
  const cacheKey = `reverse_geo_${lat}_${lon}`;
  const cachedData = getCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    logger.info(`Reversing spatial reference indicators for GPS Coordinates: [${lat}, ${lon}]`);
    const response = await axios.get(REVERSE_GEOCODE_URL, {
      params: {
        lat: lat,
        lon: lon,
        format: 'jsonv2',
        'accept-language': 'en'
      },
      headers: {
        // Descriptive required Header according to Nominatim Usage Policy Guidelines
        'User-Agent': 'AeroSkyPremiumWeatherDashProductionGatewayApplication'
      }
    });

    const address = response.data.address || {};
    
    // Parse response layers to select the closest distinct municipal identification tag
    const normalizedAddress = {
      city: address.city || address.town || address.village || address.suburb || 'Unknown Location',
      state: address.state || '',
      country: address.country || '',
      country_code: address.country_code?.toUpperCase() || '',
      display_name: response.data.display_name || ''
    };

    // Store static address lookups inside the cache for 24 hours (86400 seconds)
    setCache(cacheKey, normalizedAddress, 86400);

    return normalizedAddress;
  } catch (error) {
    logger.error(`Spatial coordinate matrix resolution crashed for parameters Lat: ${lat}, Lon: ${lon}: ${error.message}`);
    throw new Error('Unable to resolve GPS indicators into real addresses.');
  }
};