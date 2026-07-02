import logger from '../utils/logger.js';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',

  // Your Vercel frontend
  'https://weather-app-inky-eta-27.vercel.app',

  // Production domain (if you connect one later)
  'https://weather-app.vercel.app'
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost, explicit origins, and all Vercel deployments
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }

    logger.warn(`Blocked CORS request from: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept'
  ],

  credentials: true,
  optionsSuccessStatus: 200
};