import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, MapPin, ArrowRight } from 'lucide-react';

export default function DestinationCard({ destination, onSelectDestination }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => onSelectDestination(destination)}
            className="group relative rounded-3xl overflow-hidden bg-[#0E152B] border border-white/10 hover:border-blue-500/40 shadow-xl cursor-pointer transition-all duration-300"
        >
            {/* Image Container with Zoom effect */}
            <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                    src={destination.image}
                    alt={`${destination.city}, ${destination.country}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/40 to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-black/40 backdrop-blur-md text-blue-400 border border-white/10">
                        {destination.tag}
                    </span>
                    {destination.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-blue-600 text-white shadow-md">
                            Featured
                        </span>
                    )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-amber-400 border border-white/10 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{destination.rating}</span>
                </div>
            </div>

            {/* Card Content Body */}
            <div className="p-5 relative -mt-6">
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                        {destination.country} • {destination.code}
                    </span>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
                        {destination.city}
                    </h3>
                    <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase block">Fares From</span>
                        <span className="text-lg font-extrabold text-white">{destination.priceFrom}</span>
                    </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {destination.description}
                </p>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                    <span>Search Flights</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
}
