// Simple in-memory cache implementation
const cache = new Map();

module.exports = {
  get: async (key) => {
    const item = cache.get(key);
    if (!item) return null;
    
    if (item.expiry < Date.now()) {
      cache.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  set: async (key, value, ttl = 300) => {
    cache.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000)
    });
  },
  
  del: async (key) => {
    cache.delete(key);
  },
  
  flush: async () => {
    cache.clear();
  }
};