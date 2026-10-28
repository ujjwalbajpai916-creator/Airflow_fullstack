import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award, Globe, PlaneTakeoff, Compass } from 'lucide-react';

export default function HeroSection({ onSearchClick, onOffersClick }) {
    const shouldReduceMotion = useReducedMotion();

    // Motion variants with reduced motion support
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
    };

    return (
        <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
            {/* Cinematic Airplane / Airport Background with Multilayer Dark Gradient */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=2000&q=85"
                    alt="Luxury Airplane in flight at sunset"
                    className="w-full h-full object-cover object-center scale-105 filter brightness-[0.4] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/80 to-[#0A0F1E]/60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
            </div>

            {/* Subtle Floating Ambient Badges (disabled if reduced motion) */}
            {!shouldReduceMotion && (
                <>
                    <motion.div
                        animate={{
                            y: [0, -12, 0],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="hidden lg:flex absolute top-36 left-12 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl z-10"
                    >
                        <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <PlaneTakeoff className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[11px] text-slate-400 font-medium">Daily Global Flights</div>
                            <div className="text-xs font-bold text-white">450+ Destinations</div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{
                            y: [0, 10, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                        className="hidden lg:flex absolute bottom-28 right-12 items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl z-10"
                    >
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[11px] text-slate-400 font-medium">5-Star Safety Rating</div>
                            <div className="text-xs font-bold text-white">Skytrax Certified 2026</div>
                        </div>
                    </motion.div>
                </>
            )}

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center"
                >
                    {/* Top Announcement Pill */}
                    <motion.div variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6 shadow-glow">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Experience The New Standard of Luxury Aviation</span>
                        </div>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6 font-['Plus_Jakarta_Sans',sans-serif]"
                    >
                        Fly Beyond Horizons with{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                            Unrivaled Comfort
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-10"
                    >
                        Seamless flight bookings, transparent fares, Michelin-inspired dining, and premier cabin suites to over 450 global destinations.
                    </motion.p>

                    {/* Action CTA Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
                        <motion.button
                            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                            onClick={onSearchClick}
                            className="flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
                        >
                            <span>Book Your Flight</span>
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                            onClick={onOffersClick}
                            className="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-base bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md transition-all cursor-pointer"
                        >
                            <Compass className="w-5 h-5 text-blue-400" />
                            <span>Explore Exclusive Deals</span>
                        </motion.button>
                    </motion.div>

                    {/* Feature Micro-Badges */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 mt-14 pt-8 border-t border-white/10 w-full max-w-3xl"
                    >
                        <div className="flex items-center justify-center gap-3 text-left">
                            <Award className="w-6 h-6 text-amber-400 shrink-0" />
                            <div>
                                <div className="text-white font-bold text-sm">Best Airline 2026</div>
                                <div className="text-slate-400 text-xs">Global Aviation Awards</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-left">
                            <Globe className="w-6 h-6 text-blue-400 shrink-0" />
                            <div>
                                <div className="text-white font-bold text-sm">Direct Routes</div>
                                <div className="text-slate-400 text-xs">Delhi, Mumbai, London &amp; more</div>
                            </div>
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-3 text-left">
                            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                            <div>
                                <div className="text-white font-bold text-sm">Zero Hidden Fees</div>
                                <div className="text-slate-400 text-xs">Transparent fare pricing</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
