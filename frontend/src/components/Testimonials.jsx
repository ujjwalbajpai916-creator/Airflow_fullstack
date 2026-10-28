import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
    {
        name: 'Rahul Sharma',
        role: 'Frequent Business Flyer',
        location: 'Bengaluru, India',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        review: 'AirFlow business suites are truly international caliber. The lie-flat bed on the London route and smooth Wi-Fi let me work uninterrupted across time zones.',
    },
    {
        name: 'Priya Patel',
        role: 'Travel Journalist',
        location: 'Mumbai, India',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        review: 'Booking through the platform was effortlessly fast. Transparent fares with zero hidden convenience fees make AirFlow my default recommendation for holiday bookings.',
    },
    {
        name: 'David Wilson',
        role: 'Technology Consultant',
        location: 'London, UK',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        review: 'Flawless boarding, attentive cabin crew, and gourmet dining. The digital boarding pass and real-time flight tracker made traveling seamless.',
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-[#060A14]/60 border-y border-white/5 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                        <Star className="w-3.5 h-3.5 fill-blue-400" />
                        <span>Passenger Testimonials</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                        Trusted by Global Travelers
                    </h2>
                    <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
                        Hear why over 2.4 million passengers fly with AirFlow every year.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {REVIEWS.map((r, i) => (
                        <motion.div
                            key={r.name}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                            className="rounded-3xl bg-[#0E152B] border border-white/10 p-6 flex flex-col justify-between shadow-xl relative"
                        >
                            <Quote className="w-8 h-8 text-blue-500/20 absolute top-5 right-5" />

                            <div>
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(r.rating)].map((_, idx) => (
                                        <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">
                                    "{r.review}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                <img
                                    src={r.avatar}
                                    alt={r.name}
                                    className="w-11 h-11 rounded-full object-cover border border-blue-500/30"
                                />
                                <div>
                                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                        <span>{r.name}</span>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        {r.role} • {r.location}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
