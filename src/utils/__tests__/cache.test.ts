import { 
    setCache, 
    getCache, 
    invalidateCache, 
    clearExpiredCache, 
    getCacheStats, 
    generateCacheKey 
} from '../cache';

describe('cache utility', () => {
    beforeEach(() => {

        const { cache } = require('../cache');
        cache.clear();
    });

    describe('setCache and getCache', () => {
        it('should store and retrieve data', () => {
            const key = 'test-key';
            const value = { data: 'test-data' };

            setCache(key, value);
            const retrieved = getCache(key);

            expect(retrieved).toEqual(value);
        });

        it('should return null for non-existent key', () => {
            const retrieved = getCache('non-existent-key');
            expect(retrieved).toBeNull();
        });

        it('should handle different data types', () => {
            setCache('string', 'test string');
            setCache('number', 42);
            setCache('boolean', true);
            setCache('object', { key: 'value' });
            setCache('array', [1, 2, 3]);

            expect(getCache('string')).toBe('test string');
            expect(getCache('number')).toBe(42);
            expect(getCache('boolean')).toBe(true);
            expect(getCache('object')).toEqual({ key: 'value' });
            expect(getCache('array')).toEqual([1, 2, 3]);
        });
    });

    describe('cache expiration', () => {
        it('should expire cache after specified time', (done) => {
            const key = 'expiring-key';
            const value = 'expiring-value';
            const expiresIn = 100;

            setCache(key, value, expiresIn);
            

            expect(getCache(key)).toBe(value);


            setTimeout(() => {
                expect(getCache(key)).toBeNull();
                done();
            }, expiresIn + 50);
        });

        it('should use default expiration time', () => {
            const key = 'default-expiry';
            const value = 'test-value';

            setCache(key, value); // Using default expiration
            
            // Should be available immediately
            expect(getCache(key)).toBe(value);
        });

        it('should not expire before the specified time', (done) => {
            const key = 'not-expiring-key';
            const value = 'not-expiring-value';
            const expiresIn = 200; // 200ms

            setCache(key, value, expiresIn);

            // Should still be available before expiration
            setTimeout(() => {
                expect(getCache(key)).toBe(value);
                done();
            }, expiresIn / 2);
        });
    });

    describe('invalidateCache', () => {
        it('should remove specific cache entry', () => {
            const key1 = 'key1';
            const key2 = 'key2';
            const value1 = 'value1';
            const value2 = 'value2';

            setCache(key1, value1);
            setCache(key2, value2);

            expect(getCache(key1)).toBe(value1);
            expect(getCache(key2)).toBe(value2);

            invalidateCache(key1);

            expect(getCache(key1)).toBeNull();
            expect(getCache(key2)).toBe(value2);
        });

        it('should handle invalidating non-existent key', () => {
            expect(() => invalidateCache('non-existent')).not.toThrow();
        });
    });

    describe('clearExpiredCache', () => {
        it('should remove only expired entries', (done) => {
            const key1 = 'short-lived';
            const key2 = 'long-lived';
            const value1 = 'value1';
            const value2 = 'value2';

            setCache(key1, value1, 50); // 50ms
            setCache(key2, value2, 200); // 200ms

            setTimeout(() => {
                clearExpiredCache();
                
                expect(getCache(key1)).toBeNull(); // Should be expired
                expect(getCache(key2)).toBe(value2); // Should still exist
                done();
            }, 100);
        });

        it('should not affect non-expired entries', () => {
            const key = 'valid-key';
            const value = 'valid-value';

            setCache(key, value, 10000); // 10 seconds
            clearExpiredCache();

            expect(getCache(key)).toBe(value);
        });
    });

    describe('getCacheStats', () => {
        it('should return correct stats for empty cache', () => {
            const stats = getCacheStats();
            
            expect(stats.totalEntries).toBe(0);
            expect(stats.validEntries).toBe(0);
            expect(stats.expiredEntries).toBe(0);
        });

        it('should return correct stats for valid entries', () => {
            setCache('key1', 'value1', 10000);
            setCache('key2', 'value2', 10000);

            const stats = getCacheStats();
            
            expect(stats.totalEntries).toBe(2);
            expect(stats.validEntries).toBe(2);
            expect(stats.expiredEntries).toBe(0);
        });

        it('should count expired entries correctly', (done) => {
            setCache('valid', 'value', 10000);
            setCache('expired', 'value', 50);

            setTimeout(() => {
                const stats = getCacheStats();
                
                expect(stats.totalEntries).toBe(2);
                expect(stats.validEntries).toBe(1);
                expect(stats.expiredEntries).toBe(1);
                done();
            }, 100);
        });
    });

    describe('generateCacheKey', () => {
        it('should generate consistent keys for same input', () => {
            const params1 = { tripType: 'one-way', date: '2025-08-15' };
            const params2 = { tripType: 'one-way', date: '2025-08-15' };

            const key1 = generateCacheKey(params1);
            const key2 = generateCacheKey(params2);

            expect(key1).toBe(key2);
        });

        it('should generate different keys for different input', () => {
            const params1 = { tripType: 'one-way', date: '2025-08-15' };
            const params2 = { tripType: 'roundtrip', date: '2025-08-15' };

            const key1 = generateCacheKey(params1);
            const key2 = generateCacheKey(params2);

            expect(key1).not.toBe(key2);
        });

        it('should handle complex objects', () => {
            const params = {
                tripType: 'roundtrip',
                departureDate: '2025-08-15',
                returnDate: '2025-08-17',
                overnightStays: 2,
                nested: {
                    option: 'value'
                }
            };

            const key = generateCacheKey(params);
            expect(typeof key).toBe('string');
            expect(key.length).toBeGreaterThan(0);
        });
    });
});
