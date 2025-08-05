import axios from 'axios';
import { TrainConnection, SearchParams } from '../types';
import { getCache, setCache, generateCacheKey, clearExpiredCache } from '../utils/cache';

const NAVITIA_API_URL = 'https://api.navitia.io/v1';
const NAVITIA_TOKEN = '3b036afe-0110-4202-b9ed-99718476c2e0';
// Coordinates in lon;lat format for Navitia API
const HAMBURG_COORDS = '10.0014;53.5653';
const AMSTERDAM_COORDS = '4.9041;52.3676';

const getMockConnections = (params?: SearchParams): TrainConnection[] => {
    const baseConnections = [
        {
            duration: "5h 10m",
            price: 39,
            changes: 0,
            departure: "08:45",
            arrival: "13:55",
            trainType: "ICE International",
            carrier: "Deutsche Bahn"
        },
        {
            duration: "6h 05m",
            price: 29,
            changes: 1,
            departure: "07:00",
            arrival: "13:05",
            trainType: "IC + Intercity",
            carrier: "DB/NS"
        },
        {
            duration: "5h 45m",
            price: 45,
            changes: 0,
            departure: "10:30",
            arrival: "16:15",
            trainType: "ICE",
            carrier: "Deutsche Bahn"
        },
        {
            duration: "7h 20m",
            price: 25,
            changes: 2,
            departure: "06:15",
            arrival: "13:35",
            trainType: "Regional + IC",
            carrier: "DB/NS"
        },
        {
            duration: "5h 30m",
            price: 52,
            changes: 0,
            departure: "14:20",
            arrival: "19:50",
            trainType: "IC",
            carrier: "DB/NS"
        },
        {
            duration: "4h 55m",
            price: 65,
            changes: 0,
            departure: "16:45",
            arrival: "21:40",
            trainType: "ICE",
            carrier: "DB"
        },
        {
            duration: "6h 30m",
            price: 35,
            changes: 1,
            departure: "12:15",
            arrival: "18:45",
            trainType: "IC + NS",
            carrier: "DB/NS"
        }
    ];

    if (params?.departureDate) {
        const searchDate = new Date(params.departureDate);
        const dayOfWeek = searchDate.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return baseConnections.map(conn => ({
                ...conn,
                price: Math.round(conn.price * 1.15)
            }));
        }

        return baseConnections.map(conn => ({
            ...conn,
            price: Math.round(conn.price * (0.9 + Math.random() * 0.2))
        }));
    }

    return baseConnections;
};

export const fetchTrainConnections = async (params: SearchParams): Promise<TrainConnection[]> => {
    clearExpiredCache();
    const cacheKey = generateCacheKey(params);

    const cachedResult = getCache(cacheKey);
    if (cachedResult) {
        console.log('Returning cached result');
        return cachedResult;
    }

    try {
        // Simulate API delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Use high-quality mock data for demonstration
        const mockData = getMockConnections(params);
        setCache(cacheKey, mockData, 5 * 60 * 1000);

        return mockData;

    } catch (error) {
        console.error('Error fetching train connections:', error);
        const fallbackData = getMockConnections(params);
        setCache(cacheKey, fallbackData, 60 * 1000);
        return fallbackData;
    }
};

const formatDateForAPI = (dateString: string): string => {
    const date = new Date(dateString);
    // Add 8 AM as default departure time if no time specified
    date.setHours(8, 0, 0, 0);

    // Format as YYYYMMDDTHHMMSS for Navitia API
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

const parseNavitiaResponse = (data: any): TrainConnection[] => {
    if (!data.journeys) return [];

    return data.journeys.map((journey: any) => ({
        duration: formatDuration(journey.duration),
        price: Math.floor(Math.random() * 50) + 20,
        changes: journey.nb_transfers || 0,
        departure: formatTime(journey.departure_date_time),
        arrival: formatTime(journey.arrival_date_time),
        trainType: getTrainType(journey),
        carrier: getCarrier(journey)
    }));
};

const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

const formatTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const getTrainType = (journey: any): string => {
    const publicTransportSections = journey.sections?.filter((s: any) => s.type === 'public_transport') || [];
    if (publicTransportSections.length > 0) {
        return publicTransportSections[0].display_informations?.commercial_mode || 'Train';
    }
    return 'Train';
};

const getCarrier = (journey: any): string => {
    const publicTransportSections = journey.sections?.filter((s: any) => s.type === 'public_transport') || [];
    if (publicTransportSections.length > 0) {
        return publicTransportSections[0].display_informations?.network || 'Railway';
    }
    return 'Railway';
};

export const fetchReturnConnections = async (params: SearchParams): Promise<TrainConnection[]> => {
    if (params.tripType !== 'roundtrip' || !params.returnDate) {
        return [];
    }

    const returnParams = {
        ...params,
        departureDate: params.returnDate,
        returnDate: undefined
    };
    const cacheKey = generateCacheKey({ ...returnParams, direction: 'return' });

    const cachedResult = getCache(cacheKey);
    if (cachedResult) {
        console.log('Returning cached return journey result');
        return cachedResult;
    }

    try {
        // Simulate API delay for realistic UX
        await new Promise(resolve => setTimeout(resolve, 900));

        // Use high-quality mock data for demonstration
        const returnConnections = getMockReturnConnections(returnParams);
        setCache(cacheKey, returnConnections, 5 * 60 * 1000);

        return returnConnections;

    } catch (error) {
        console.error('Error fetching return connections:', error);
        const fallbackData = getMockReturnConnections(returnParams);
        setCache(cacheKey, fallbackData, 60 * 1000);
        return fallbackData;
    }
};

const getMockReturnConnections = (params: SearchParams): TrainConnection[] => {
    const baseReturnConnections = [
        {
            duration: "5h 15m",
            price: 42,
            changes: 0,
            departure: "09:30",
            arrival: "14:45",
            trainType: "IC",
            carrier: "NS/DB"
        },
        {
            duration: "6h 10m",
            price: 31,
            changes: 1,
            departure: "08:15",
            arrival: "14:25",
            trainType: "NS + IC",
            carrier: "NS/DB"
        },
        {
            duration: "5h 50m",
            price: 48,
            changes: 0,
            departure: "11:45",
            arrival: "17:35",
            trainType: "ICE",
            carrier: "DB"
        },
        {
            duration: "7h 25m",
            price: 27,
            changes: 2,
            departure: "07:30",
            arrival: "14:55",
            trainType: "Regional + IC",
            carrier: "NS/DB"
        },
        {
            duration: "5h 35m",
            price: 55,
            changes: 0,
            departure: "15:10",
            arrival: "20:45",
            trainType: "IC",
            carrier: "NS/DB"
        }
    ];

    if (params.departureDate) {
        const returnDate = new Date(params.departureDate);
        const dayOfWeek = returnDate.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return baseReturnConnections.map(conn => ({
                ...conn,
                price: Math.round(conn.price * 1.15)
            }));
        }

        return baseReturnConnections.map(conn => ({
            ...conn,
            price: Math.round(conn.price * (0.9 + Math.random() * 0.2))
        }));
    }

    return baseReturnConnections;
};