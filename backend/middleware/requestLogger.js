import logger from '../utils/logger.js';

/**
 * Custom request logging middleware for production tracing.
 * Captures request details and performance metrics.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Listen for the response to finish to log completion details
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms - IP: ${req.ip}`;

    if (res.statusCode >= 500) {
      logger.error(logMessage);
    } else if (res.statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.info(logMessage);
    }
  });

  next();
};

export default requestLogger;