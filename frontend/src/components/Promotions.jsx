import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { PROMOTIONAL_OFFERS } from '../data/sampleFlights';

export default function Promotions({ onSelectDeal }) {
    const [copiedCode, setCopiedCode] = useState('');

    const handleCopy = (code) => {
        navigator.clipboard?.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    return (
        <section id="offers" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Curated Travel Privileges</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                            Exclusive Offers &amp; Discounts
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                        Apply these coupon codes at checkout to unlock guaranteed savings on international and domestic routes.
                    </p>
                </div>

                {/* Promotional Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PROMOTIONAL_OFFERS.map((offer) => (
                        <motion.div
                            key={offer.id}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.25 }}
                            className="rounded-3xl bg-[#0E152B] border border-white/10 hover:border-blue-500/40 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-0" />

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                        {offer.category}
                                    </span>
                                    <span className="text-[10px] text-slate-400">Valid till {offer.validTill}</span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">{offer.title}</h3>
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-3">
                                    {offer.discount}
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                    {offer.description}
                                </p>
                            </div>

                            {/* Code Snippet & Copy Action */}
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono font-bold text-white">
                                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                                    <span>{offer.code}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleCopy(offer.code)}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
                                >
                                    {copiedCode === offer.code ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy Code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
