import NodeCache from 'node-cache';

// Initialize cache with a default TTL of 30 minutes (1800 seconds)
const appCache = new NodeCache({ stdTTL: 1800, checkperiod: 120 });

export const setCache = (key, data, ttl = 1800) => {
  return appCache.set(key, data, ttl);
};

export const getCache = (key) => {
  return appCache.get(key);
};

export const deleteCache = (key) => {
  return appCache.del(key);
};

export const flushCache = () => {
  return appCache.flushAll();
};

export default appCache;