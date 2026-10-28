import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlaneTakeoff,
    PlaneLanding,
    Calendar,
    Users,
    ArrowLeftRight,
    Search,
    ChevronDown,
    Check,
    AlertCircle,
} from 'lucide-react';
import { AIRPORTS } from '../data/sampleFlights';

export default function FlightSearch({ onSearch, isSearching }) {
    const [tripType, setTripType] = useState('round'); // 'round' | 'oneway'
    const [fromCity, setFromCity] = useState('DEL');
    const [toCity, setToCity] = useState('BOM');
    const [departureDate, setDepartureDate] = useState('2026-11-01');
    const [returnDate, setReturnDate] = useState('2026-11-05');
    const [cabinClass, setCabinClass] = useState('Economy'); // 'Economy' | 'Business'

    // Passenger State
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [passengerDropdownOpen, setPassengerDropdownOpen] = useState(false);

    // Dropdown / Autocomplete state
    const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
    const [toDropdownOpen, setToDropdownOpen] = useState(false);
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [swapRotate, setSwapRotate] = useState(0);

    const passengerRef = useRef(null);
    const fromRef = useRef(null);
    const toRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (passengerRef.current && !passengerRef.current.contains(e.target)) {
                setPassengerDropdownOpen(false);
            }
            if (fromRef.current && !fromRef.current.contains(e.target)) {
                setFromDropdownOpen(false);
            }
            if (toRef.current && !toRef.current.contains(e.target)) {
                setToDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Total passenger count
    const totalPassengers = passengers.adults + passengers.children + passengers.infants;

    const handleSwap = () => {
        setSwapRotate((prev) => prev + 180);
        const temp = fromCity;
        setFromCity(toCity);
        setToCity(temp);
    };

    const getAirportDetails = (code) => {
        return AIRPORTS.find((a) => a.code === code) || { code, city: code, name: code };
    };

    const filteredFromAirports = AIRPORTS.filter(
        (a) =>
            a.code.toLowerCase().includes(fromQuery.toLowerCase()) ||
            a.city.toLowerCase().includes(fromQuery.toLowerCase()) ||
            a.name.toLowerCase().includes(fromQuery.toLowerCase())
    );

    const filteredToAirports = AIRPORTS.filter(
        (a) =>
            a.code.toLowerCase().includes(toQuery.toLowerCase()) ||
            a.city.toLowerCase().includes(toQuery.toLowerCase()) ||
            a.name.toLowerCase().includes(toQuery.toLowerCase())
    );

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setErrorMsg('');

        if (!fromCity || !toCity) {
            setErrorMsg('Please select both departure and destination airports.');
            return;
        }

        if (fromCity === toCity) {
            setErrorMsg('Departure and destination cannot be the same airport.');
            return;
        }

        if (tripType === 'round' && returnDate && departureDate && returnDate < departureDate) {
            setErrorMsg('Return date cannot be earlier than departure date.');
            return;
        }

        onSearch({
            from: fromCity,
            to: toCity,
            departureDate,
            returnDate: tripType === 'round' ? returnDate : null,
            tripType,
            passengers: totalPassengers,
            passengerBreakdown: passengers,
            cabinClass,
        });
    };

    const fromAirport = getAirportDetails(fromCity);
    const toAirport = getAirportDetails(toCity);

    return (
        <div id="search" className="w-full max-w-6xl mx-auto px-4 -mt-10 sm:-mt-14 relative z-30">
            <div className="rounded-3xl bg-[#0E152B]/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-5 sm:p-7">
                {/* Trip Options Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                    {/* Trip Type Tabs */}
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-black/30 border border-white/5">
                        <button
                            type="button"
                            onClick={() => setTripType('round')}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                                tripType === 'round'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            Round Trip
                        </button>
                        <button
                            type="button"
                            onClick={() => setTripType('oneway')}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                                tripType === 'oneway'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            One Way
                        </button>
                    </div>

                    {/* Passenger & Cabin Class Selector */}
                    <div className="flex items-center gap-3">
                        {/* Passenger Popover */}
                        <div className="relative" ref={passengerRef}>
                            <button
                                type="button"
                                onClick={() => setPassengerDropdownOpen(!passengerDropdownOpen)}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
                            >
                                <Users className="w-4 h-4 text-blue-400" />
                                <span>
                                    {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            <AnimatePresence>
                                {passengerDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0E152B] border border-white/15 shadow-2xl p-4 z-50 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-semibold text-white">Adults</div>
                                                <div className="text-xs text-slate-400">Age 12+</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    disabled={passengers.adults <= 1}
                                                    onClick={() => setPassengers((p) => ({ ...p, adults: p.adults - 1 }))}
                                                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center font-bold text-sm text-white">
                                                    {passengers.adults}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={passengers.adults >= 8}
                                                    onClick={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
                                                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                            <div>
                                                <div className="text-sm font-semibold text-white">Children</div>
                                                <div className="text-xs text-slate-400">Age 2-11</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    disabled={passengers.children <= 0}
                                                    onClick={() => setPassengers((p) => ({ ...p, children: p.children - 1 }))}
                                                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center font-bold text-sm text-white">
                                                    {passengers.children}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={passengers.children >= 6}
                                                    onClick={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
                                                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                            <div>
                                                <div className="text-sm font-semibold text-white">Infants</div>
                                                <div className="text-xs text-slate-400">Under 2 yrs</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    disabled={passengers.infants <= 0}
                                                    onClick={() => setPassengers((p) => ({ ...p, infants: p.infants - 1 }))}
                                                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                                                >
                                                    -
                                                </button>
                                                <span className="w-4 text-center font-bold text-sm text-white">
                                                    {passengers.infants}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={passengers.infants >= 4}
                                                    onClick={() => setPassengers((p) => ({ ...p, infants: p.infants + 1 }))}
                                                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setPassengerDropdownOpen(false)}
                                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-colors"
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Cabin Class Selection */}
                        <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
                            <button
                                type="button"
                                onClick={() => setCabinClass('Economy')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    cabinClass === 'Economy' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Economy
                            </button>
                            <button
                                type="button"
                                onClick={() => setCabinClass('Business')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    cabinClass === 'Business' ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Business
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Inputs Grid */}
                <form onSubmit={handleSearchSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
                        {/* Origin Airport Input */}
                        <div className="lg:col-span-3 relative" ref={fromRef}>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <PlaneTakeoff className="w-3.5 h-3.5 text-blue-400" />
                                From (Origin)
                            </label>
                            <div
                                onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
                                className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 cursor-pointer transition-all flex items-center justify-between"
                            >
                                <div>
                                    <div className="text-xl font-extrabold text-white tracking-wide">
                                        {fromAirport.code}
                                    </div>
                                    <div className="text-xs text-slate-300 font-medium truncate max-w-[170px]">
                                        {fromAirport.city} ({fromAirport.name})
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>

                            <AnimatePresence>
                                {fromDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-[#0E152B] border border-white/15 shadow-2xl p-2 z-50 max-h-64 overflow-y-auto"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search city or code..."
                                            value={fromQuery}
                                            onChange={(e) => setFromQuery(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full mb-2 px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500"
                                            autoFocus
                                        />
                                        <div className="space-y-1">
                                            {filteredFromAirports.map((airport) => (
                                                <button
                                                    key={airport.code}
                                                    type="button"
                                                    onClick={() => {
                                                        setFromCity(airport.code);
                                                        setFromDropdownOpen(false);
                                                        setFromQuery('');
                                                    }}
                                                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-left transition-colors"
                                                >
                                                    <div>
                                                        <span className="font-bold text-white text-xs">{airport.code}</span>
                                                        <span className="text-slate-300 text-xs ml-2">{airport.city}</span>
                                                    </div>
                                                    {fromCity === airport.code && <Check className="w-3.5 h-3.5 text-blue-400" />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Swap Button */}
                        <div className="flex justify-center -my-2 lg:my-0 lg:col-span-1">
                            <motion.button
                                type="button"
                                onClick={handleSwap}
                                animate={{ rotate: swapRotate }}
                                transition={{ duration: 0.3 }}
                                className="w-10 h-10 rounded-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-md transition-colors"
                                title="Swap Origin and Destination"
                            >
                                <ArrowLeftRight className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* Destination Airport Input */}
                        <div className="lg:col-span-3 relative" ref={toRef}>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <PlaneLanding className="w-3.5 h-3.5 text-blue-400" />
                                To (Destination)
                            </label>
                            <div
                                onClick={() => setToDropdownOpen(!toDropdownOpen)}
                                className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 cursor-pointer transition-all flex items-center justify-between"
                            >
                                <div>
                                    <div className="text-xl font-extrabold text-white tracking-wide">
                                        {toAirport.code}
                                    </div>
                                    <div className="text-xs text-slate-300 font-medium truncate max-w-[170px]">
                                        {toAirport.city} ({toAirport.name})
                                    </div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>

                            <AnimatePresence>
                                {toDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-[#0E152B] border border-white/15 shadow-2xl p-2 z-50 max-h-64 overflow-y-auto"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Search city or code..."
                                            value={toQuery}
                                            onChange={(e) => setToQuery(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full mb-2 px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500"
                                            autoFocus
                                        />
                                        <div className="space-y-1">
                                            {filteredToAirports.map((airport) => (
                                                <button
                                                    key={airport.code}
                                                    type="button"
                                                    onClick={() => {
                                                        setToCity(airport.code);
                                                        setToDropdownOpen(false);
                                                        setToQuery('');
                                                    }}
                                                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-left transition-colors"
                                                >
                                                    <div>
                                                        <span className="font-bold text-white text-xs">{airport.code}</span>
                                                        <span className="text-slate-300 text-xs ml-2">{airport.city}</span>
                                                    </div>
                                                    {toCity === airport.code && <Check className="w-3.5 h-3.5 text-blue-400" />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Dates Section */}
                        <div className="lg:col-span-3 grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                    Departure
                                </label>
                                <input
                                    type="date"
                                    value={departureDate}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                    className="w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-semibold outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                    Return
                                </label>
                                <input
                                    type="date"
                                    disabled={tripType === 'oneway'}
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className={`w-full p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 ${
                                        tripType === 'oneway' ? 'opacity-30 cursor-not-allowed' : ''
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Search Flights CTA Button */}
                        <div className="lg:col-span-2 pt-2 lg:pt-5">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSearching}
                                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-60"
                            >
                                <Search className="w-5 h-5" />
                                <span>{isSearching ? 'Searching...' : 'Find Flights'}</span>
                            </motion.button>
                        </div>
                    </div>
                </form>

                {/* Validation Error Message */}
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span>{errorMsg}</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
