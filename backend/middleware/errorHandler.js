import logger from '../utils/logger.js';

/**
 * Route fallback for unmatched endpoint requests (404 Handlers)
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - Specified route mapping does not exist: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global centralized application exception interceptor
 */
export const errorHandler = (err, req, res, next) => {
  // If a status code was already specified by a controller, use it; otherwise default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  logger.error(`Exception captured in processing pipeline: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🛡️' : err.stack,
  });
};