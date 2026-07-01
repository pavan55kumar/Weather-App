import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

/**
 * Standard rate limiting configuration profile across global endpoints.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minute window
  max: 100, // Limit each IP address to 100 queries per window
  standardHeaders: true, 
  legacyHeaders: false, 
  handler: (req, res) => {
    logger.warn(`API Rate Limit Threshold reached by client IP tracking identity: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests generated from this endpoint. Please try again after 15 minutes.'
    });
  }
});

/**
 * Stricter configuration constraint profile for location searching autocomplete inputs.
 */
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 Minute window tracking
  max: 30, // Limit each IP address to 30 location searches per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Search Autocomplete Threshold reached by client IP tracking identity: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Search operations executing too rapidly. Please slow down your search typing.'
    });
  }
});