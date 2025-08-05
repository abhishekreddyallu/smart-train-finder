export interface TrainConnection {
    duration: string;
    price: number;
    changes: number;
    departure: string;
    arrival: string;
    trainType: string;
    carrier: string;
}

export interface SearchParams {
    tripType: 'one-way' | 'roundtrip';
    departureDate: string;
    returnDate?: string;
    overnightStays?: number;
}

export interface FilterOptions {
    fastest: boolean;
    cheapest: boolean;
    leastChanges: boolean;
}

export interface RoundtripResult {
    outbound: TrainConnection[];
    return: TrainConnection[];
    totalPrice: number;
    totalDuration: string;
}

export interface JourneyStep {
    type: 'train' | 'transfer' | 'walking';
    from: string;
    to: string;
    departure?: string;
    arrival?: string;
    duration?: string;
    trainType?: string;
    carrier?: string;
    station?: string;
}