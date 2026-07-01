import express from 'express';
import { getWeatherDashboardData } from '../controllers/weatherController.js';

const router = express.Router();

/**
 * @route   GET /api/weather/dashboard
 * @desc    Exposes a unified stream of meteorological dashboards and local air quality profiles.
 * @access  Public
 */
router.get('/dashboard', getWeatherDashboardData);

export default router;