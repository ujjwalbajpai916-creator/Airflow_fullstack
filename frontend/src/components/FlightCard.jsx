import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plane,
    Clock,
    Luggage,
    ChevronDown,
    Wifi,
    Coffee,
    Tv,
    ShieldAlert,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';

export default function FlightCard({ flight, onBook, cabinClass = 'Economy' }) {
    const [expanded, setExpanded] = useState(false);
    const [selectedClass, setSelectedClass] = useState(cabinClass);

    const price = selectedClass === 'Business' ? flight.priceBusiness : flight.priceEconomy;
    const availableSeats = selectedClass === 'Business'
        ? flight.availableSeats?.business
        : flight.availableSeats?.economy;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-[#0E152B]/80 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-xl overflow-hidden group"
        >
            {/* Top Indicator Bar: Simulated vs Live Data */}
            <div className="px-5 py-2.5 bg-black/30 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5 text-blue-400 transform -rotate-45" />
                        {flight.airline}
                    </span>
                    <span className="text-slate-400 font-mono">[{flight.flightNumber}]</span>
                    {flight.aircraft && (
                        <span className="hidden sm:inline-block text-[11px] text-slate-400">
                            • {flight.aircraft}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {flight.isSimulated ? (
                        <span
                            title={flight.simulationNotice || 'Simulated demonstration flight'}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-amber-400/10 text-amber-300 border border-amber-400/25"
                        >
                            <Sparkles className="w-2.5 h-2.5" />
                            Simulated Demonstration Flight
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-400/10 text-emerald-300 border border-emerald-400/25">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Live Flask Backend
                        </span>
                    )}
                </div>
            </div>

            {/* Main Flight Info Section */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Route Information */}
                <div className="md:col-span-7 flex items-center justify-between gap-3">
                    {/* Origin */}
                    <div className="text-left min-w-[80px]">
                        <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                            {flight.departureTime}
                        </div>
                        <div className="text-sm font-bold text-blue-400 tracking-wider">
                            {flight.from}
                        </div>
                        <div className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
                            {flight.fromCity}
                        </div>
                    </div>

                    {/* Flight Duration Visual Line */}
                    <div className="flex-1 flex flex-col items-center px-2">
                        <span className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {flight.duration}
                        </span>

                        <div className="w-full flex items-center relative py-1">
                            <div className="h-[2px] w-full bg-gradient-to-r from-blue-500/20 via-blue-400 to-blue-500/20 relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-500/30" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400 ring-2 ring-blue-400/30" />
                                <Plane className="w-3.5 h-3.5 text-blue-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-45" />
                            </div>
                        </div>

                        <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase mt-1">
                            {flight.stopsLabel || (flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`)}
                        </span>
                    </div>

                    {/* Destination */}
                    <div className="text-right min-w-[80px]">
                        <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                            {flight.arrivalTime}
                        </div>
                        <div className="text-sm font-bold text-blue-400 tracking-wider">
                            {flight.to}
                        </div>
                        <div className="text-xs text-slate-300 font-medium truncate max-w-[120px]">
                            {flight.toCity}
                        </div>
                    </div>
                </div>

                {/* Pricing, Class Switcher & Book Action */}
                <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col lg:flex-row items-end sm:items-center md:items-end lg:items-center justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
                    {/* Class Selector Pill & Seat Note */}
                    <div className="w-full sm:w-auto text-left">
                        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 mb-2 inline-flex">
                            <button
                                type="button"
                                onClick={() => setSelectedClass('Economy')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                    selectedClass === 'Economy'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Economy
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedClass('Business')}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                                    selectedClass === 'Business'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Business
                            </button>
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-slate-400">{flight.currencySymbol || '₹'}</span>
                            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {price?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400">/ person</span>
                        </div>

                        <div className="text-[10px] text-slate-400 mt-0.5">
                            {availableSeats > 0 ? (
                                <span className="text-emerald-400 font-medium">
                                    {availableSeats} seats remaining
                                </span>
                            ) : (
                                <span className="text-rose-400 font-medium">Sold Out</span>
                            )}
                        </div>
                    </div>

                    {/* Book Now Button */}
                    <div className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={availableSeats <= 0}
                            onClick={() => onBook(flight, selectedClass)}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap"
                        >
                            Book Flight
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Bottom Accordion Bar for Details */}
            <div className="px-5 py-2.5 bg-black/20 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1.5 text-[11px]">
                        <Luggage className="w-3.5 h-3.5 text-blue-400" />
                        Cabin: {flight.baggage?.cabin || '7 kg'} | Check-in: {flight.baggage?.checkin || '15 kg'}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <span>{expanded ? 'Hide Details' : 'Flight Details & Perks'}</span>
                    <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                </button>
            </div>

            {/* Expandable Flight Amenities & Simulation Notice */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 py-4 bg-[#0A0F1E]/90 border-t border-white/5 text-xs text-slate-300 space-y-3"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                    Aircraft
                                </span>
                                <span className="text-white font-medium">
                                    {flight.aircraft || 'Airbus A320neo'}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                    Departure Date
                                </span>
                                <span className="text-white font-medium">{flight.departureDate}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                    Fare Breakdown
                                </span>
                                <span className="text-white font-medium">
                                    Base Fare: ₹{Math.round(price * 0.85).toLocaleString('en-IN')} + Taxes: ₹
                                    {Math.round(price * 0.15).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        {flight.amenities && flight.amenities.length > 0 && (
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">
                                    Included Amenities
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {flight.amenities.map((item, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-[11px]"
                                        >
                                            ✓ {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {flight.isSimulated && (
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                                <span>
                                    <strong>Notice:</strong> This flight schedule and pricing are simulated demonstration data for testing the AirFlow reservation interface.
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
