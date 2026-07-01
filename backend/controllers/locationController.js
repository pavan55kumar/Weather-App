import { searchLocationByName, reverseGeocodeCoords } from '../services/geocodeService.js';
import logger from '../utils/logger.js';

/**
 * Processes text queries to fetch geographic autocomplete options.
 */
export const searchCity = async (req, res, next) => {
  try {
    const { q, lang } = req.query;

    if (!q || q.trim() === '') {
      res.status(400);
      throw new Error('Query string missing: Parameter "q" must contain text keywords to execute a geographic catalog match.');
    }

    const matchedLocations = await searchLocationByName(q.trim(), 10, lang || 'en');
    
    return res.status(200).json({
      success: true,
      results: matchedLocations
    });
  } catch (error) {
    logger.error(`Controller tracking anomaly encountered within forward search catalog: ${error.message}`);
    next(error);
  }
};

/**
 * Processes physical GPS numeric matrices into real human-readable descriptive text markers.
 */
export const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400);
      throw new Error('Coordinate reference missing: Parameters "lat" and "lon" are required for spatial transformation.');
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400);
      throw new Error('Spatial schema validation failure: Floating numerical values expected.');
    }

    const locationMetaLabels = await reverseGeocodeCoords(latitude, longitude);

    return res.status(200).json({
      success: true,
      location: locationMetaLabels
    });
  } catch (error) {
    logger.error(`Controller tracking anomaly encountered within reverse spatial engine: ${error.message}`);
    next(error);
  }
};