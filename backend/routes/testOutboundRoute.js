// TEMPORARY DIAGNOSTIC ROUTE — remove after debugging.
// Add this to your Express app (e.g. in server.js or its own route file)
// to test whether outbound HTTPS calls work AT ALL from this Vercel
// deployment, independent of Open-Meteo. This isolates whether the problem
// is specific to Open-Meteo or a general outbound networking issue.
//
// Usage: add the following in server.js near your other routes:
//
//   import testOutboundRoute from './routes/testOutboundRoute.js';
//   app.use('/api/test-outbound', testOutboundRoute);
//
// Then visit: https://weather-app-va6s.vercel.app/api/test-outbound

import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  const results = {};

  // Test 1: A totally different, unrelated API (GitHub)
  try {
    const start = Date.now();
    const r = await axios.get('https://api.github.com', { timeout: 8000 });
    results.github = { ok: true, status: r.status, ms: Date.now() - start };
  } catch (err) {
    results.github = { ok: false, error: err.message, code: err.code };
  }

  // Test 2: Open-Meteo forecast endpoint directly
  try {
    const start = Date.now();
    const r = await axios.get('https://api.open-meteo.com/v1/forecast', {
      timeout: 8000,
      params: { latitude: 40.7128, longitude: -74.006, current: 'temperature_2m' },
    });
    results.openMeteoForecast = { ok: true, status: r.status, ms: Date.now() - start };
  } catch (err) {
    results.openMeteoForecast = { ok: false, error: err.message, code: err.code };
  }

  // Test 3: Open-Meteo air-quality endpoint directly
  try {
    const start = Date.now();
    const r = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
      timeout: 8000,
      params: { latitude: 40.7128, longitude: -74.006, current: 'us_aqi' },
    });
    results.openMeteoAirQuality = { ok: true, status: r.status, ms: Date.now() - start };
  } catch (err) {
    results.openMeteoAirQuality = { ok: false, error: err.message, code: err.code };
  }

  res.json(results);
});

export default router;