/**
 * Flight Data Access Service
 * Integrates with Flask `/api/flights` when available, falling back gracefully to realistic sample flights.
 */

import { api } from './api';
import { SAMPLE_FLIGHTS, AIRPORTS } from '../data/sampleFlights';

/**
 * Normalizes backend flight model to standard frontend flight format
 */
function normalizeBackendFlight(f) {
    return {
        id: `API-${f.id}`,
        backendId: f.id,
        flightNumber: f.flight_number || `AF-${f.id + 100}`,
        airline: 'AirFlow',
        airlineCode: 'AF',
        aircraft: 'Airbus A320neo',
        from: f.from_city,
        fromName: f.from_name,
        fromCity: f.from_name,
        to: f.to_city,
        toName: f.to_name,
        toCity: f.to_name,
        departureTime: f.departure,
        arrivalTime: f.arrival,
        departureDate: f.travel_date || new Date().toISOString().split('T')[0],
        duration: f.duration,
        durationMinutes: parseDurationToMinutes(f.duration),
        stops: 0,
        stopsLabel: 'Non-stop',
        priceEconomy: f.price,
        priceBusiness: Math.round(f.price * 2.5),
        currency: 'INR',
        currencySymbol: '₹',
        baggage: { cabin: '7 kg', checkin: '15 kg' },
        availableSeats: {
            economy: f.economy_avail ? 15 : 0,
            business: f.business_avail ? 4 : 0,
        },
        amenities: ['In-flight Wi-Fi', 'Complimentary Meal'],
        isSimulated: false,
        source: 'backend',
    };
}

function parseDurationToMinutes(durationStr) {
    if (!durationStr) return 120;
    const hoursMatch = durationStr.match(/(\d+)\s*h/i);
    const minsMatch = durationStr.match(/(\d+)\s*m/i);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    return hours * 60 + mins;
}

export const flightService = {
    /**
     * Get all flights: attempts Flask API first, falls back to SAMPLE_FLIGHTS
     */
    async getAllFlights() {
        try {
            const res = await api.get('/flights');
            if (res.ok && res.data?.flights && res.data.flights.length > 0) {
                return {
                    source: 'backend',
                    isSimulated: false,
                    flights: res.data.flights.map(normalizeBackendFlight),
                };
            }
        } catch {
            // fallback
        }

        return {
            source: 'sample',
            isSimulated: true,
            flights: SAMPLE_FLIGHTS,
        };
    },

    /**
     * Search flights with query params:
     * { from, to, departureDate, returnDate, tripType, passengers, cabinClass }
     */
    async searchFlights(params) {
        const {
            from = '',
            to = '',
            departureDate = '',
            passengers = 1,
            cabinClass = 'Economy',
            sortBy = 'price_asc', // price_asc, duration_asc, departure_asc
            filterStops = 'all', // all, nonstop, 1stop
            maxPrice = null,
            airline = 'all',
        } = params;

        const normalizedFrom = from.trim().toUpperCase();
        const normalizedTo = to.trim().toUpperCase();

        let rawResults = [];
        let dataSource = 'sample';
        let isSimulated = true;

        // 1. Try Flask API first if route is specified
        if (normalizedFrom && normalizedTo) {
            try {
                const apiRes = await api.get(`/flights/search?from=${encodeURIComponent(normalizedFrom)}&to=${encodeURIComponent(normalizedTo)}&passengers=${passengers}`);
                if (apiRes.ok && apiRes.data?.flights && apiRes.data.flights.length > 0) {
                    rawResults = apiRes.data.flights.map(normalizeBackendFlight);
                    dataSource = 'backend';
                    isSimulated = false;
                }
            } catch {
                // Network failure or backend down; fall back gracefully to sample data
            }
        }

        // 2. If backend yielded no flights or is offline, search sample flights
        if (rawResults.length === 0) {
            dataSource = 'sample';
            isSimulated = true;

            rawResults = SAMPLE_FLIGHTS.filter((flight) => {
                const matchFrom = !normalizedFrom ||
                    flight.from.toUpperCase() === normalizedFrom ||
                    flight.fromCity.toUpperCase().includes(normalizedFrom) ||
                    flight.fromName.toUpperCase().includes(normalizedFrom);

                const matchTo = !normalizedTo ||
                    flight.to.toUpperCase() === normalizedTo ||
                    flight.toCity.toUpperCase().includes(normalizedTo) ||
                    flight.toName.toUpperCase().includes(normalizedTo);

                return matchFrom && matchTo;
            });

            // If user searched a route with date, attach the user's selected date for visual consistency
            if (departureDate) {
                rawResults = rawResults.map((f) => ({
                    ...f,
                    departureDate: departureDate,
                    arrivalDate: departureDate,
                }));
            }
        }

        // 3. Apply Filters
        let filtered = [...rawResults];

        // Filter stops
        if (filterStops === 'nonstop') {
            filtered = filtered.filter((f) => f.stops === 0);
        } else if (filterStops === '1stop') {
            filtered = filtered.filter((f) => f.stops === 1);
        }

        // Filter airline
        if (airline !== 'all') {
            filtered = filtered.filter((f) => f.airline.toLowerCase().includes(airline.toLowerCase()));
        }

        // Filter max price
        if (maxPrice && !isNaN(maxPrice)) {
            filtered = filtered.filter((f) => {
                const fare = cabinClass === 'Business' ? f.priceBusiness : f.priceEconomy;
                return fare <= maxPrice;
            });
        }

        // 4. Sorting
        filtered.sort((a, b) => {
            const fareA = cabinClass === 'Business' ? a.priceBusiness : a.priceEconomy;
            const fareB = cabinClass === 'Business' ? b.priceBusiness : b.priceEconomy;

            if (sortBy === 'price_asc') return fareA - fareB;
            if (sortBy === 'price_desc') return fareB - fareA;
            if (sortBy === 'duration_asc') return a.durationMinutes - b.durationMinutes;
            if (sortBy === 'departure_asc') return a.departureTime.localeCompare(b.departureTime);
            return 0;
        });

        return {
            success: true,
            source: dataSource,
            isSimulated,
            count: filtered.length,
            flights: filtered,
        };
    },

    /**
     * Get airport suggestions based on user query
     */
    getAirportSuggestions(query) {
        if (!query || query.trim().length === 0) return AIRPORTS.slice(0, 6);
        const q = query.trim().toUpperCase();
        return AIRPORTS.filter(
            (a) =>
                a.code.includes(q) ||
                a.city.toUpperCase().includes(q) ||
                a.name.toUpperCase().includes(q)
        );
    },
};

export default flightService;
