import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, AlertCircle, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import FlightSearch from '../components/FlightSearch';
import FlightCard from '../components/FlightCard';
import FlightFilters from '../components/FlightFilters';
import DestinationCard from '../components/DestinationCard';
import Promotions from '../components/Promotions';
import ExperienceSection from '../components/ExperienceSection';
import FlightTracker from '../components/FlightTracker';
import Testimonials from '../components/Testimonials';
import flightService from '../services/flightService';
import { POPULAR_DESTINATIONS, SAMPLE_FLIGHTS } from '../data/sampleFlights';

export default function Home({ onBookFlight, user }) {
    // Flight results state
    const [flights, setFlights] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [dataSource, setDataSource] = useState('sample'); // 'sample' | 'backend'
    const [isSimulated, setIsSimulated] = useState(true);
    const [activeSearchQuery, setActiveSearchQuery] = useState({
        from: 'DEL',
        to: 'BOM',
        departureDate: '2026-11-01',
        passengers: 1,
        cabinClass: 'Economy',
    });

    // Filters and sorting state
    const [sortBy, setSortBy] = useState('price_asc');
    const [filterStops, setFilterStops] = useState('all');
    const [maxPrice, setMaxPrice] = useState(150000);
    const [airline, setAirline] = useState('all');

    const resultsRef = useRef(null);

    // Initial search load on mount
    useEffect(() => {
        executeSearch(activeSearchQuery);
    }, []);

    const executeSearch = async (searchParams) => {
        setIsSearching(true);
        setActiveSearchQuery(searchParams);

        try {
            const res = await flightService.searchFlights({
                ...searchParams,
                sortBy,
                filterStops,
                maxPrice,
                airline,
            });

            if (res.success) {
                setFlights(res.flights);
                setDataSource(res.source);
                setIsSimulated(res.isSimulated);
            }
        } catch (err) {
            console.error('Search failed:', err);
            // Default to sample flights
            setFlights(SAMPLE_FLIGHTS);
            setIsSimulated(true);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = (searchParams) => {
        executeSearch(searchParams);
        // Smooth scroll to results
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    };

    const handleDestinationSelect = (destination) => {
        const newParams = {
            from: 'DEL',
            to: destination.code,
            departureDate: '2026-11-02',
            passengers: 1,
            cabinClass: 'Economy',
        };
        handleSearch(newParams);
    };

    const handleResetFilters = () => {
        setSortBy('price_asc');
        setFilterStops('all');
        setMaxPrice(150000);
        setAirline('all');
        executeSearch(activeSearchQuery);
    };

    // Filter and sort the displayed flights on client-side state changes
    const displayedFlights = flights
        .filter((f) => {
            if (filterStops === 'nonstop' && f.stops !== 0) return false;
            if (filterStops === '1stop' && f.stops !== 1) return false;
            const fare = activeSearchQuery.cabinClass === 'Business' ? f.priceBusiness : f.priceEconomy;
            if (fare > maxPrice) return false;
            return true;
        })
        .sort((a, b) => {
            const fareA = activeSearchQuery.cabinClass === 'Business' ? a.priceBusiness : a.priceEconomy;
            const fareB = activeSearchQuery.cabinClass === 'Business' ? b.priceBusiness : b.priceEconomy;
            if (sortBy === 'price_asc') return fareA - fareB;
            if (sortBy === 'price_desc') return fareB - fareA;
            if (sortBy === 'duration_asc') return a.durationMinutes - b.durationMinutes;
            if (sortBy === 'departure_asc') return a.departureTime.localeCompare(b.departureTime);
            return 0;
        });

    return (
        <main className="min-h-screen">
            {/* Cinematic Hero Section */}
            <HeroSection
                onSearchClick={() => {
                    document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
                }}
                onOffersClick={() => {
                    document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' });
                }}
            />

            {/* Flight Search Panel with Autocomplete & Validation */}
            <FlightSearch onSearch={handleSearch} isSearching={isSearching} />

            {/* Flight Results Section */}
            <section ref={resultsRef} className="pt-20 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                            <Plane className="w-3.5 h-3.5 transform -rotate-45" />
                            <span>Flight Search Results</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                            {activeSearchQuery.from} → {activeSearchQuery.to} Flights
                        </h2>
                    </div>

                    {/* Data source transparency notice */}
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                        {isSimulated ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-medium">
                                Showing Realistic Sample Demonstration Flights
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 font-medium">
                                Connected to Live Flask Database
                            </span>
                        )}
                    </div>
                </div>

                {/* Filters & Sorting Bar */}
                <FlightFilters
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    filterStops={filterStops}
                    setFilterStops={setFilterStops}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    airline={airline}
                    setAirline={setAirline}
                    onReset={handleResetFilters}
                    resultsCount={displayedFlights.length}
                />

                {/* Flights List or Empty / Loading State */}
                {isSearching ? (
                    <div className="p-16 rounded-3xl bg-[#0E152B]/50 border border-white/5 text-center space-y-4">
                        <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center animate-spin">
                            <Plane className="w-6 h-6 transform -rotate-45" />
                        </div>
                        <p className="text-sm font-semibold text-white">Searching best routes and fares...</p>
                    </div>
                ) : displayedFlights.length > 0 ? (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {displayedFlights.map((flight) => (
                                <FlightCard
                                    key={flight.id}
                                    flight={flight}
                                    cabinClass={activeSearchQuery.cabinClass}
                                    onBook={(fl, seatCl) => onBookFlight(fl, seatCl)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="p-12 rounded-3xl bg-[#0E152B]/60 border border-white/10 text-center space-y-4">
                        <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                        <h3 className="text-lg font-bold text-white">No Flights Found for this Route</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Try adjusting your price range filter or searching for routes like DEL → BOM, BOM → BLR, DEL → DXB, or BLR → SIN.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-colors"
                        >
                            Reset Filters &amp; View All
                        </button>
                    </div>
                )}
            </section>

            {/* Popular Destinations Cards */}
            <section id="destinations" className="py-20 bg-[#060A14]/70 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Trending Escapes</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                                Top Global Destinations
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                            Handpicked destinations with direct connectivity, luxury hotel partners, and special promotional rates.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {POPULAR_DESTINATIONS.map((dest) => (
                            <DestinationCard
                                key={dest.id}
                                destination={dest}
                                onSelectDestination={handleDestinationSelect}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Banners & Coupons */}
            <Promotions
                onSelectDeal={(deal) => {
                    document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
                }}
            />

            {/* Cabin Suites & Experience */}
            <ExperienceSection />

            {/* Real-time Flight Tracker Radar */}
            <FlightTracker />

            {/* Passenger Testimonials */}
            <Testimonials />
        </main>
    );
}
