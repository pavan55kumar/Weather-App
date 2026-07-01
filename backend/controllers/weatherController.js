import { fetchWeatherData } from '../services/openMeteoService.js';
import logger from '../utils/logger.js';

/**
 * Main dashboard controller to process aggregated weather data pipelines.
 * Validates request coordinate profiles before requesting service hydration.
 */
export const getWeatherDashboardData = async (req, res, next) => {
  try {
    const { lat, lon, timezone } = req.query;

    // Strict validation check for coordinate visibility
    if (!lat || !lon) {
      res.status(400);
      throw new Error('Coordinate validation failed: Latitude (lat) and Longitude (lon) parameters are mandatory.');
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Guard against corrupt or malformed coordinate strings
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      res.status(400);
      throw new Error('Geographic validation failed: Coordinates fall outside valid physical boundaries.');
    }

    // Call service to gather open-meteo telemetry
    const analyticsData = await fetchWeatherData(latitude, longitude, timezone || 'auto');
    
    return res.status(200).json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    logger.error(`Controller tracking anomaly encountered within weather router: ${error.message}`);
    next(error); // Push downstream to our global errorHandler middleware
  }
};