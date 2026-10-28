import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Armchair, Check, AlertCircle } from 'lucide-react';

export default function SeatSelection({
    seatClass = 'Economy',
    passengers = 1,
    selectedSeats = [],
    onSelectSeat,
}) {
    // Generate layout: Rows 1-3 Business (2-2 layout), Rows 4-12 Economy (3-3 layout)
    const businessRows = [1, 2, 3];
    const economyRows = [4, 5, 6, 7, 8, 9, 10, 11, 12];

    const occupiedSeats = ['1B', '2A', '5C', '6D', '8A', '9F', '11B'];

    const handleSeatClick = (seatCode, isBusiness) => {
        if (occupiedSeats.includes(seatCode)) return;

        // If seat class does not match
        if (seatClass === 'Business' && !isBusiness) {
            alert('You have selected Business Class. Please pick a seat in Rows 1-3.');
            return;
        }
        if (seatClass === 'Economy' && isBusiness) {
            alert('This seat is in Business Class. Please select an Economy seat or upgrade your cabin class.');
            return;
        }

        onSelectSeat(seatCode);
    };

    return (
        <div className="py-2">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h4 className="text-sm font-bold text-white">Select Your Preferred Seat(s)</h4>
                    <p className="text-xs text-slate-400">
                        Please choose {passengers} {passengers === 1 ? 'seat' : 'seats'} for your journey ({seatClass} cabin)
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-400">Selected: </span>
                    <span className="text-xs font-bold text-blue-400">
                        {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                    </span>
                </div>
            </div>

            {/* Seat Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 py-2.5 px-4 rounded-xl bg-black/20 border border-white/5 mb-6 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-white/10 border border-white/20" />
                    <span className="text-slate-300">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-blue-600 border border-blue-400" />
                    <span className="text-blue-300">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-700 opacity-40" />
                    <span className="text-slate-500">Occupied</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-md bg-amber-500/20 border border-amber-500/40" />
                    <span className="text-amber-300">Business (Row 1-3)</span>
                </div>
            </div>

            {/* Aircraft Cabin Visual Map */}
            <div className="max-w-md mx-auto p-5 rounded-3xl bg-[#080D1A] border border-white/10 shadow-inner">
                {/* Cockpit Indicator */}
                <div className="text-center pb-4 mb-4 border-b border-white/10">
                    <div className="w-16 h-6 mx-auto rounded-t-full bg-blue-600/20 border-t border-x border-blue-500/30 flex items-center justify-center text-[10px] text-blue-400 font-semibold tracking-widest uppercase">
                        Cockpit
                    </div>
                </div>

                {/* Business Class Section */}
                <div className="mb-6">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 text-center mb-2">
                        ⭐ Premier Business Suites
                    </div>
                    <div className="space-y-2">
                        {businessRows.map((row) => (
                            <div key={`row-${row}`} className="flex items-center justify-center gap-3">
                                {['A', 'C'].map((col) => {
                                    const code = `${row}${col}`;
                                    const isOccupied = occupiedSeats.includes(code);
                                    const isSelected = selectedSeats.includes(code);
                                    return (
                                        <button
                                            key={code}
                                            type="button"
                                            disabled={isOccupied}
                                            onClick={() => handleSeatClick(code, true)}
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                                                isOccupied
                                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-transparent'
                                                    : isSelected
                                                    ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/30'
                                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                                            }`}
                                        >
                                            {code}
                                        </button>
                                    );
                                })}

                                <span className="w-6 text-center text-xs text-slate-500 font-mono">
                                    {row}
                                </span>

                                {['D', 'F'].map((col) => {
                                    const code = `${row}${col}`;
                                    const isOccupied = occupiedSeats.includes(code);
                                    const isSelected = selectedSeats.includes(code);
                                    return (
                                        <button
                                            key={code}
                                            type="button"
                                            disabled={isOccupied}
                                            onClick={() => handleSeatClick(code, true)}
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                                                isOccupied
                                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-transparent'
                                                    : isSelected
                                                    ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/30'
                                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                                            }`}
                                        >
                                            {code}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider Line */}
                <div className="flex items-center gap-3 my-4">
                    <div className="h-[1px] flex-1 bg-white/10" />
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                        Economy Cabin
                    </span>
                    <div className="h-[1px] flex-1 bg-white/10" />
                </div>

                {/* Economy Class Section (Rows 4-10) */}
                <div className="space-y-1.5">
                    {economyRows.slice(0, 6).map((row) => (
                        <div key={`row-${row}`} className="flex items-center justify-center gap-2">
                            {['A', 'B', 'C'].map((col) => {
                                const code = `${row}${col}`;
                                const isOccupied = occupiedSeats.includes(code);
                                const isSelected = selectedSeats.includes(code);
                                return (
                                    <button
                                        key={code}
                                        type="button"
                                        disabled={isOccupied}
                                        onClick={() => handleSeatClick(code, false)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all ${
                                            isOccupied
                                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                                : isSelected
                                                ? 'bg-blue-600 text-white border border-blue-300 shadow-md shadow-blue-500/30'
                                                : 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/15'
                                        }`}
                                    >
                                        {code}
                                    </button>
                                );
                            })}

                            <span className="w-5 text-center text-[10px] text-slate-500 font-mono">
                                {row}
                            </span>

                            {['D', 'E', 'F'].map((col) => {
                                const code = `${row}${col}`;
                                const isOccupied = occupiedSeats.includes(code);
                                const isSelected = selectedSeats.includes(code);
                                return (
                                    <button
                                        key={code}
                                        type="button"
                                        disabled={isOccupied}
                                        onClick={() => handleSeatClick(code, false)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all ${
                                            isOccupied
                                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                                : isSelected
                                                ? 'bg-blue-600 text-white border border-blue-300 shadow-md shadow-blue-500/30'
                                                : 'bg-white/5 text-slate-200 border border-white/10 hover:bg-white/15'
                                        }`}
                                    >
                                        {code}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
