import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import { corsOptions } from './config/corsOptions.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import requestLogger from './middleware/requestLogger.js';
import logger from './utils/logger.js';

// Application Module Router Mount Interfaces
import weatherRoutes from './routes/weatherRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

// Load environmental context configuration variables
dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Production Grade Protocol Security & Networking Optimization
app.use(helmet()); // Patches headers to prevent script hijacking profiles
app.use(cors(corsOptions)); // Cross-Origin access rules matrix enforcement
app.use(compression()); // Deflates JSON text transfer objects to minimize pipe latency
app.use(express.json({ limit: '1mb' })); // Restricts memory overhead on heavy object payloads
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Trace Monitoring Injection Pipelines
app.use(requestLogger);
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev')); // Colorful developer console stream tracing
}

// Global API Rate Limiter
app.use('/api', apiLimiter);

// System Endpoint Module Route Map Implementations
app.use('/api/weather', weatherRoutes);
app.use('/api/location', locationRoutes);

// Core Structural Cluster Status Verification Route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    status: 'ONLINE', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Fallback Exception Routing Catch Blocks
app.use(notFound);
app.use(errorHandler);

export default app;

// Safeguard thread integrity against unhandled asynchronous execution anomalies
process.on('unhandledRejection', (err) => {
  logger.error(`Critical Unhandled Promise Rejection intercepted in system runtime: ${err.message}`, { stack: err.stack });
});