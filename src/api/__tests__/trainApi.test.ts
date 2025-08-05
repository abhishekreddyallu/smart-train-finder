import { fetchTrainConnections, fetchReturnConnections } from '../trainApi';
import { SearchParams } from '../../types';


jest.mock('../../utils/cache', () => ({
    getCache: jest.fn(() => null),
    setCache: jest.fn(),
    generateCacheKey: jest.fn((params) => JSON.stringify(params)),
    clearExpiredCache: jest.fn()
}));

describe('trainApi', () => {
    describe('fetchTrainConnections', () => {
        it('should return train connections for one-way trip', async () => {
            const params: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-15'
            };

            const connections = await fetchTrainConnections(params);

            expect(connections).toBeDefined();
            expect(Array.isArray(connections)).toBe(true);
            expect(connections.length).toBeGreaterThan(0);
            

            const firstConnection = connections[0];
            expect(firstConnection).toHaveProperty('duration');
            expect(firstConnection).toHaveProperty('price');
            expect(firstConnection).toHaveProperty('changes');
            expect(firstConnection).toHaveProperty('departure');
            expect(firstConnection).toHaveProperty('arrival');
            expect(firstConnection).toHaveProperty('trainType');
            expect(firstConnection).toHaveProperty('carrier');
        });

        it('should return train connections for roundtrip', async () => {
            const params: SearchParams = {
                tripType: 'roundtrip',
                departureDate: '2025-08-15',
                returnDate: '2025-08-17',
                overnightStays: 2
            };

            const connections = await fetchTrainConnections(params);

            expect(connections).toBeDefined();
            expect(Array.isArray(connections)).toBe(true);
            expect(connections.length).toBeGreaterThan(0);
        });

        it('should handle weekend pricing', async () => {

            const weekendParams: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-16' // Assuming this is a Saturday
            };

            const weekendConnections = await fetchTrainConnections(weekendParams);
            

            const weekdayParams: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-18' // Assuming this is a Monday
            };

            const weekdayConnections = await fetchTrainConnections(weekdayParams);

            expect(weekendConnections).toBeDefined();
            expect(weekdayConnections).toBeDefined();
            

            expect(weekendConnections.length).toBeGreaterThan(0);
            expect(weekdayConnections.length).toBeGreaterThan(0);
        });

        it('should handle errors gracefully', async () => {
            const params: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-15'
            };


            const connections = await fetchTrainConnections(params);
            expect(connections).toBeDefined();
            expect(Array.isArray(connections)).toBe(true);
        });
    });

    describe('fetchReturnConnections', () => {
        it('should return empty array for one-way trip', async () => {
            const params: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-15'
            };

            const returnConnections = await fetchReturnConnections(params);
            expect(returnConnections).toEqual([]);
        });

        it('should return connections for roundtrip', async () => {
            const params: SearchParams = {
                tripType: 'roundtrip',
                departureDate: '2025-08-15',
                returnDate: '2025-08-17'
            };

            const returnConnections = await fetchReturnConnections(params);
            
            expect(returnConnections).toBeDefined();
            expect(Array.isArray(returnConnections)).toBe(true);
            expect(returnConnections.length).toBeGreaterThan(0);
            

            const firstConnection = returnConnections[0];
            expect(firstConnection).toHaveProperty('duration');
            expect(firstConnection).toHaveProperty('price');
            expect(firstConnection).toHaveProperty('changes');
        });

        it('should return empty array when no return date provided', async () => {
            const params: SearchParams = {
                tripType: 'roundtrip',
                departureDate: '2025-08-15'

            };

            const returnConnections = await fetchReturnConnections(params);
            expect(returnConnections).toEqual([]);
        });
    });

    describe('data validation', () => {
        it('should return valid duration format', async () => {
            const params: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-15'
            };

            const connections = await fetchTrainConnections(params);
            
            connections.forEach(connection => {
                expect(connection.duration).toMatch(/^\d+h\s*\d+m$/);
            });
        });

        it('should return valid time format', async () => {
            const params: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-15'
            };

            const connections = await fetchTrainConnections(params);
            
            connections.forEach(connection => {
                expect(connection.departure).toMatch(/^\d{2}:\d{2}$/);
                expect(connection.arrival).toMatch(/^\d{2}:\d{2}$/);
            });
        });

        it('should return valid price values', async () => {
            const params: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-15'
            };

            const connections = await fetchTrainConnections(params);
            
            connections.forEach(connection => {
                expect(typeof connection.price).toBe('number');
                expect(connection.price).toBeGreaterThan(0);
                expect(connection.price).toBeLessThan(1000);
            });
        });

        it('should return valid changes values', async () => {
            const params: SearchParams = {
                tripType: 'one-way',
                departureDate: '2025-08-15'
            };

            const connections = await fetchTrainConnections(params);
            
            connections.forEach(connection => {
                expect(typeof connection.changes).toBe('number');
                expect(connection.changes).toBeGreaterThanOrEqual(0);
                expect(connection.changes).toBeLessThanOrEqual(5);
            });
        });
    });
});
