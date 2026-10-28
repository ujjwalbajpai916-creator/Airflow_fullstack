import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Utensils, Wifi, Armchair, Shield, Check, Globe } from 'lucide-react';

const VISA_INFO = {
    DXB: { country: 'United Arab Emirates', req: 'Visa on Arrival / 30-day tourist eVisa required for Indian passport holders.' },
    LHR: { country: 'United Kingdom', req: 'Standard Visitor Visa required prior to departure.' },
    SIN: { country: 'Singapore', req: 'Electronic SG Arrival Card submitted within 3 days before arrival.' },
    BKK: { country: 'Thailand', req: 'Visa on Arrival / Visa Waiver available for select travelers.' },
    GOI: { country: 'Domestic (Goa)', req: 'Valid Government Photo ID required at security check-in.' },
};

export default function ExperienceSection() {
    const [selectedVisa, setSelectedVisa] = useState('DXB');

    const perks = [
        {
            icon: Armchair,
            title: 'Lie-Flat Royal Suites',
            desc: '180-degree fully flat beds with direct aisle access and custom ambient mood lighting.',
        },
        {
            icon: Utensils,
            title: 'Michelin Dining in the Sky',
            desc: 'Multi-course gourmet selections curated by award-winning chefs paired with vintage wines.',
        },
        {
            icon: Wifi,
            title: 'High-Speed Satellite Wi-Fi',
            desc: 'Stream, work, and stay connected at 38,000 feet with unlimited complimentary bandwidth.',
        },
        {
            icon: Shield,
            title: 'Priority Sky Priority',
            desc: 'Dedicated check-in desks, fast-track security, premium lounge access, and expedited baggage.',
        },
    ];

    return (
        <section id="experience" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>The AirFlow Difference</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                        Elevate Your Journey
                    </h2>
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-3">
                        Every detail of our cabin, culinary offerings, and ground services is engineered for serene luxury.
                    </p>
                </div>

                {/* 4 Perks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {perks.map((p, idx) => {
                        const Icon = p.icon;
                        return (
                            <motion.div
                                key={p.title}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="p-6 rounded-3xl bg-[#0E152B] border border-white/10 hover:border-blue-500/40 shadow-xl"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Visa & Travel Advisory Box */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/20 via-[#0E152B] to-indigo-900/20 border border-blue-500/20 shadow-2xl">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="max-w-md">
                            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                                <Globe className="w-4 h-4" />
                                <span>Travel Advisory &amp; Visa Guide</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Check Destination Entry Rules</h3>
                            <p className="text-xs text-slate-300">
                                Verify passport validity, visa requirements, and health protocols before taking off.
                            </p>
                        </div>

                        {/* Destination Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(VISA_INFO).map((code) => (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => setSelectedVisa(code)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        selectedVisa === code
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    {code}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3 text-xs text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <div>
                            <strong className="text-white">{VISA_INFO[selectedVisa].country}:</strong>{' '}
                            <span className="text-slate-300">{VISA_INFO[selectedVisa].req}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
