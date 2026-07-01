import logger from '../utils/logger.js';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Default Vite Port allocation
  'http://127.0.0.1:5173'
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      logger.warn(`CORS security violation blocked request from origin: ${origin}`);
      callback(new Error('Cross-Origin Request Blocked by AeroSky Security Policy.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};