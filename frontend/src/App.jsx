import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AuthModals from './components/AuthModals';
import BookingModal from './components/BookingModal';
import Home from './pages/Home';
import authService from './services/authService';

export default function App() {
    const [user, setUser] = useState(null);
    const [authOpen, setAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState('login');

    // Selected flight for booking modal
    const [bookingFlight, setBookingFlight] = useState(null);
    const [bookingClass, setBookingClass] = useState('Economy');

    // On mount, check if user has an active session
    useEffect(() => {
        async function checkSession() {
            try {
                const res = await authService.getCurrentUser();
                if (res.success && res.user) {
                    setUser(res.user);
                }
            } catch {
                // Flask session not found or offline
            }
        }
        checkSession();
    }, []);

    const handleOpenAuth = (tab = 'login') => {
        setAuthTab(tab);
        setAuthOpen(true);
    };

    const handleCloseAuth = () => {
        setAuthOpen(false);
    };

    const handleLogout = async () => {
        await authService.logout();
        setUser(null);
    };

    const handleOpenBooking = (flight, cabinClass = 'Economy') => {
        setBookingFlight(flight);
        setBookingClass(cabinClass);
    };

    const handleCloseBooking = () => {
        setBookingFlight(null);
    };

    return (
        <div className="bg-[#0A0F1E] min-h-screen text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
            {/* Sticky Glass Navbar */}
            <Navbar
                user={user}
                onOpenAuth={handleOpenAuth}
                onLogout={handleLogout}
            />

            {/* Page Routes */}
            <div className="flex-1">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                user={user}
                                onBookFlight={handleOpenBooking}
                            />
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <Home
                                user={user}
                                onBookFlight={handleOpenBooking}
                            />
                        }
                    />
                </Routes>
            </div>

            {/* Premium Airline Footer */}
            <Footer />

            {/* Floating AI Concierge Chatbot */}
            <Chatbot />

            {/* Authentication Modal (Sign In / Register) */}
            <AuthModals
                open={authOpen}
                initialTab={authTab}
                onClose={handleCloseAuth}
                onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
            />

            {/* Booking & Seat Selection Modal */}
            <BookingModal
                flight={bookingFlight}
                cabinClass={bookingClass}
                onClose={handleCloseBooking}
                user={user}
            />
        </div>
    );
}
