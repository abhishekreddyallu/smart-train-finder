interface CacheEntry {
    data: any;
    timestamp: number;
    expiresIn: number;
}

export const cache = new Map<string, CacheEntry>();

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

export const setCache = (key: string, value: any, expiresIn: number = DEFAULT_CACHE_DURATION) => {
    const entry: CacheEntry = {
        data: value,
        timestamp: Date.now(),
        expiresIn
    };
    cache.set(key, entry);
};

export const getCache = (key: string) => {
    const entry = cache.get(key);

    if (!entry) {
        return null;
    }

    if (Date.now() - entry.timestamp > entry.expiresIn) {
        cache.delete(key);
        return null;
    }

    return entry.data;
};

export const invalidateCache = (key: string) => {
    cache.delete(key);
};

export const clearExpiredCache = () => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    cache.forEach((entry, key) => {
        if (now - entry.timestamp > entry.expiresIn) {
            keysToDelete.push(key);
        }
    });

    keysToDelete.forEach(key => cache.delete(key));
};

export const getCacheStats = () => {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    cache.forEach((entry) => {
        if (now - entry.timestamp > entry.expiresIn) {
            expiredEntries++;
        } else {
            validEntries++;
        }
    });

    return {
        totalEntries: cache.size,
        validEntries,
        expiredEntries
    };
};

export const generateCacheKey = (params: any): string => {
    return JSON.stringify(params);
};