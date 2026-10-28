import React from 'react';
import { SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';

export default function FlightFilters({
    sortBy,
    setSortBy,
    filterStops,
    setFilterStops,
    maxPrice,
    setMaxPrice,
    highestPrice = 150000,
    airline,
    setAirline,
    onReset,
    resultsCount = 0,
}) {
    return (
        <div className="rounded-2xl bg-[#0E152B]/80 backdrop-blur-xl border border-white/10 p-4 sm:p-5 mb-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Result count & Title */}
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-sm text-white">Filter &amp; Sort</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                        {resultsCount} {resultsCount === 1 ? 'Flight Found' : 'Flights Found'}
                    </span>
                </div>

                {/* Filter Controls Row */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Sort Options */}
                    <div className="flex items-center gap-1.5 text-xs">
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-400">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="price_asc" className="bg-[#0E152B] text-white">
                                Lowest Price
                            </option>
                            <option value="duration_asc" className="bg-[#0E152B] text-white">
                                Shortest Duration
                            </option>
                            <option value="departure_asc" className="bg-[#0E152B] text-white">
                                Departure Time
                            </option>
                        </select>
                    </div>

                    {/* Stops Filter Buttons */}
                    <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                        <button
                            type="button"
                            onClick={() => setFilterStops('all')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                                filterStops === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            All Stops
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStops('nonstop')}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                                filterStops === 'nonstop'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Non-stop Only
                        </button>
                    </div>

                    {/* Price Slider */}
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">Max: ₹{Number(maxPrice).toLocaleString('en-IN')}</span>
                        <input
                            type="range"
                            min="2500"
                            max={highestPrice}
                            step="1000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-24 sm:w-32 accent-blue-500 cursor-pointer"
                        />
                    </div>

                    {/* Reset Button */}
                    <button
                        type="button"
                        onClick={onReset}
                        title="Reset all filters"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
