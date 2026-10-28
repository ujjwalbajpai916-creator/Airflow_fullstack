/**
 * Booking Operations Service
 * Handles booking creation with Flask `/api/bookings/` or explicit simulated test bookings.
 * Never represents simulated bookings as real-world reservations.
 */

import { api } from './api';

export const bookingService = {
    /**
     * Creates a flight booking.
     * When backend flight ID is present and backend is responsive, sends to Flask API.
     * For sample demonstration flights, generates an explicitly labeled simulated reservation.
     */
    async createBooking(bookingData) {
        const {
            flight,
            firstName,
            lastName,
            email,
            phone,
            seatClass = 'Economy',
            passengers = 1,
            selectedSeats = [],
        } = bookingData;

        // If it's a backend flight, attempt real booking on Flask API
        if (flight.backendId) {
            try {
                const res = await api.post('/bookings/', {
                    flight_id: flight.backendId,
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    seat_class: seatClass,
                    passengers: Number(passengers),
                });

                if (res.ok && res.data?.success) {
                    return {
                        success: true,
                        isSimulated: false,
                        booking: res.data.booking,
                        message: 'Real reservation successfully created in database.',
                    };
                } else if (res.status !== 0) {
                    // Actual backend error (e.g. 400 validation error) - do not silently replace with fake success!
                    return {
                        success: false,
                        isSimulated: false,
                        error: res.error || 'Failed to create booking on backend server.',
                    };
                }
            } catch (err) {
                console.warn('Backend booking attempt failed:', err);
            }
        }

        // For demonstration/sample flights or when working offline:
        const unitFare = seatClass === 'Business' ? flight.priceBusiness : flight.priceEconomy;
        const totalFare = unitFare * passengers;
        const simulatedRef = `SIM-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const simulatedBooking = {
            id: `sim-bkg-${Date.now()}`,
            booking_ref: simulatedRef,
            flight_id: flight.id,
            flight_number: flight.flightNumber,
            airline: flight.airline,
            from_city: flight.fromCity,
            to_city: flight.toCity,
            from: flight.from,
            to: flight.to,
            departure: flight.departureTime,
            arrival: flight.arrivalTime,
            travel_date: flight.departureDate,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            seat_class: seatClass,
            passengers: Number(passengers),
            selected_seats: selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Auto-assigned',
            total_price: totalFare,
            status: 'Simulated Confirmed',
            isSimulated: true,
            simulationNotice: 'DEMONSTRATION ONLY: This is a simulated ticket preview. No payment was charged and no airline seat was reserved.',
            createdAt: new Date().toISOString(),
        };

        return {
            success: true,
            isSimulated: true,
            booking: simulatedBooking,
            message: 'Simulated booking completed for demonstration.',
        };
    },

    /**
     * Fetch user bookings from Flask API if authenticated
     */
    async getUserBookings() {
        try {
            const res = await api.get('/bookings/');
            if (res.ok && res.data?.bookings) {
                return { success: true, bookings: res.data.bookings };
            }
            return { success: false, bookings: [] };
        } catch {
            return { success: false, bookings: [] };
        }
    },
};

export default bookingService;
