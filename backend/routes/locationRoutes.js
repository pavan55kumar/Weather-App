import express from 'express';
import { searchCity, reverseGeocode } from '../controllers/locationController.js';
import { searchLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   GET /api/location/search
 * @desc    Forward autocomplete processing using structured lookup text keys. Protected by a dedicated input throttle rate limiter.
 * @access  Public
 */
router.get('/search', searchLimiter, searchCity);

/**
 * @route   GET /api/location/reverse
 * @desc    Reverse resolves physical spatial numbers into local metadata strings.
 * @access  Public
 */
router.get('/reverse', reverseGeocode);

export default router;