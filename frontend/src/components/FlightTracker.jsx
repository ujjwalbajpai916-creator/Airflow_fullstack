import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Search, Clock, Compass, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const DEFAULT_TRACKED = {
    'AF-101': {
        num: 'AF-101',
        airline: 'AirFlow Express',
        from: 'DEL',
        fromCity: 'Delhi',
        to: 'BOM',
        toCity: 'Mumbai',
        status: 'ontime',
        statusText: 'In Flight - On Time',
        progress: 68,
        alt: '35,000 ft',
        speed: '860 km/h',
        gate: 'T3 - Gate 14',
        terminal: 'Terminal 3',
        dep: '06:00 AM',
        arr: '08:15 AM',
        date: 'Today',
    },
    'AF-701': {
        num: 'AF-701',
        airline: 'AirFlow Global',
        from: 'DEL',
        fromCity: 'Delhi',
        to: 'DXB',
        toCity: 'Dubai',
        status: 'ontime',
        statusText: 'Cruising - On Time',
        progress: 42,
        alt: '38,000 ft',
        speed: '910 km/h',
        gate: 'T3 - Gate 22',
        terminal: 'Terminal 3',
        dep: '10:45 AM',
        arr: '01:30 PM',
        date: 'Today',
    },
    'AF-001': {
        num: 'AF-001',
        airline: 'AirFlow Royal Flagship',
        from: 'DEL',
        fromCity: 'Delhi',
        to: 'LHR',
        toCity: 'London Heathrow',
        status: 'delayed',
        statusText: 'Delayed (30m)',
        progress: 15,
        alt: '32,000 ft',
        speed: '820 km/h',
        gate: 'T3 - Gate 06',
        terminal: 'Terminal 3',
        dep: '03:00 AM',
        arr: '07:50 AM',
        date: 'Today',
    },
    'AI302': {
        num: 'AI302',
        airline: 'Air India',
        from: 'DEL',
        fromCity: 'Delhi',
        to: 'BOM',
        toCity: 'Mumbai',
        status: 'landed',
        statusText: 'Landed Safely',
        progress: 100,
        alt: '0 ft (Landed)',
        speed: '0 km/h',
        gate: 'T2 - Gate 09',
        terminal: 'Terminal 2',
        dep: '07:00 AM',
        arr: '09:10 AM',
        date: 'Today',
    },
};

export default function FlightTracker() {
    const [query, setQuery] = useState('AF-101');
    const [flight, setFlight] = useState(DEFAULT_TRACKED['AF-101']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        if (e) e.preventDefault();
        const code = query.trim().toUpperCase();
        setError('');

        if (!code) {
            setError('Please enter a flight number (e.g. AF-101 or AF-701).');
            return;
        }

        setLoading(true);

        // Try Flask backend API first
        try {
            const res = await api.get(`/tracker/${encodeURIComponent(code)}`);
            if (res.ok && res.data && res.data.flight) {
                const b = res.data.flight;
                setFlight({
                    num: b.flight || code,
                    airline: b.airline || 'AirFlow',
                    from: b.departure?.split('(')[1]?.replace(')', '') || 'DEL',
                    fromCity: b.departure?.split('(')[0]?.trim() || 'Origin',
                    to: b.arrival?.split('(')[1]?.replace(')', '') || 'BOM',
                    toCity: b.arrival?.split('(')[0]?.trim() || 'Destination',
                    status: b.status?.toLowerCase().includes('delayed') ? 'delayed' : 'ontime',
                    statusText: b.status || 'On Time',
                    progress: b.status === 'Landed' ? 100 : 65,
                    alt: '36,000 ft',
                    speed: '880 km/h',
                    gate: 'Gate 11',
                    terminal: 'Terminal 3',
                    dep: b.scheduled_departure || '10:00 AM',
                    arr: b.scheduled_arrival || '12:05 PM',
                    date: 'Today',
                });
                setLoading(false);
                return;
            }
        } catch {
            // fallback
        }

        // Sample tracker flights fallback
        const match = DEFAULT_TRACKED[code] || Object.values(DEFAULT_TRACKED).find((f) => f.num.replace('-', '') === code.replace('-', ''));
        if (match) {
            setFlight(match);
        } else {
            setError(`Flight "${code}" not found. Try searching AF-101, AF-701, AF-001, or AI302.`);
        }
        setLoading(false);
    };

    return (
        <section id="tracker" className="py-20 relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Live Radar &amp; Telemetry</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                        Real-Time Flight Tracker
                    </h2>
                    <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
                        Monitor active flights, route trajectory, estimated touchdown times, and gate coordinates.
                    </p>
                </div>

                {/* Tracker Search Input */}
                <form onSubmit={handleTrack} className="mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl bg-[#0E152B] border border-white/10 shadow-xl">
                        <div className="flex-1 flex items-center gap-3 px-3 w-full">
                            <Search className="w-5 h-5 text-slate-400 shrink-0" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter flight number (e.g. AF-101, AF-701, AI302)..."
                                className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-semibold"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap"
                        >
                            <Plane className="w-4 h-4 transform -rotate-45" />
                            <span>{loading ? 'Locating...' : 'Track Flight'}</span>
                        </button>
                    </div>

                    {error && (
                        <p className="mt-3 text-xs text-rose-400 text-center font-medium">{error}</p>
                    )}
                </form>

                {/* Tracked Result Display */}
                {flight && (
                    <motion.div
                        key={flight.num}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl bg-[#0E152B]/90 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl"
                    >
                        {/* Header: Flight info + Status pill */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-2xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                                        {flight.num}
                                    </h3>
                                    <span className="text-xs text-slate-400 font-medium">({flight.airline})</span>
                                </div>
                                <span className="text-xs text-slate-400">Scheduled Journey: {flight.date}</span>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 ${
                                    flight.status === 'ontime'
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : flight.status === 'delayed'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                {flight.statusText}
                            </span>
                        </div>

                        {/* Interactive Progress Bar */}
                        <div className="py-8">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                                <div>
                                    <span className="text-2xl font-extrabold text-white block">{flight.from}</span>
                                    <span className="text-slate-400 font-normal">{flight.fromCity}</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-blue-400 text-sm">{flight.progress}% Completed</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-extrabold text-white block">{flight.to}</span>
                                    <span className="text-slate-400 font-normal">{flight.toCity}</span>
                                </div>
                            </div>

                            <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${flight.progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Telemetry Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 text-xs">
                            <div>
                                <span className="text-slate-500 block uppercase text-[10px] font-bold">Altitude</span>
                                <span className="text-white font-bold text-sm">{flight.alt}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block uppercase text-[10px] font-bold">Ground Speed</span>
                                <span className="text-white font-bold text-sm">{flight.speed}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block uppercase text-[10px] font-bold">Departure Gate</span>
                                <span className="text-white font-bold text-sm">{flight.gate}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block uppercase text-[10px] font-bold">Terminal</span>
                                <span className="text-white font-bold text-sm">{flight.terminal}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
