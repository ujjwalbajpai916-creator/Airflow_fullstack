import React, { useState } from 'react';
import { Plane, Mail, Check, AlertCircle, Shield, Heart } from 'lucide-react';
import api from '../services/api';

export default function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        const email = newsletterEmail.trim();
        if (!email || !email.includes('@')) {
            setStatusMsg({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        setIsSubscribing(true);
        setStatusMsg({ type: '', text: '' });

        try {
            const res = await api.post('/newsletter/subscribe', { email });
            if (res.ok && res.data?.success) {
                setStatusMsg({ type: 'success', text: 'Subscribed successfully to AirFlow updates!' });
                setNewsletterEmail('');
            } else {
                setStatusMsg({
                    type: 'success',
                    text: res.data?.message || 'Subscribed! You will receive special flight alerts.',
                });
                setNewsletterEmail('');
            }
        } catch {
            setStatusMsg({ type: 'success', text: 'Subscribed to simulated demo newsletters!' });
            setNewsletterEmail('');
        } finally {
            setIsSubscribing(false);
            setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
        }
    };

    return (
        <footer className="bg-[#060A14] border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Newsletter Card */}
                <div className="p-8 rounded-3xl bg-[#0E152B] border border-white/10 mb-14 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-blue-400 font-bold mb-1">
                            <Mail className="w-4 h-4" />
                            <span>AirFlow Insider Dispatch</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                            Stay Ahead with Secret Fare Drops
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                            Receive flash sale notifications and luxury lounge access codes directly in your inbox.
                        </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
                        <input
                            type="email"
                            required
                            placeholder="Enter your email..."
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500 w-full sm:w-64"
                        />
                        <button
                            type="submit"
                            disabled={isSubscribing}
                            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap"
                        >
                            {isSubscribing ? 'Joining...' : 'Subscribe'}
                        </button>
                    </form>
                </div>

                {statusMsg.text && (
                    <div
                        className={`mb-8 p-3 rounded-xl text-center text-xs font-semibold ${
                            statusMsg.type === 'error'
                                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        }`}
                    >
                        {statusMsg.text}
                    </div>
                )}

                {/* 4 Column Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                                <Plane className="w-4 h-4 text-white transform -rotate-45" />
                            </div>
                            <span className="font-extrabold text-base text-white font-['Plus_Jakarta_Sans',sans-serif]">
                                Air<span className="text-blue-500">Flow</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4">
                            Pioneering luxury aviation across global corridors with exemplary hospitality and safety standards.
                        </p>
                        <div className="text-[11px] text-slate-500 font-mono">
                            IATA Code: AF | ICAO: AFL
                        </div>
                    </div>

                    {/* Popular Routes */}
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                            Popular Routes
                        </h4>
                        <ul className="space-y-2">
                            <li><a href="#search" className="hover:text-white transition-colors">Delhi → Mumbai</a></li>
                            <li><a href="#search" className="hover:text-white transition-colors">Mumbai → Bengaluru</a></li>
                            <li><a href="#search" className="hover:text-white transition-colors">Delhi → Dubai (DXB)</a></li>
                            <li><a href="#search" className="hover:text-white transition-colors">Bengaluru → Singapore</a></li>
                            <li><a href="#search" className="hover:text-white transition-colors">Delhi → London (LHR)</a></li>
                            <li><a href="#search" className="hover:text-white transition-colors">Mumbai → Goa (GOI)</a></li>
                        </ul>
                    </div>

                    {/* Passenger Support */}
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                            Customer Care
                        </h4>
                        <ul className="space-y-2">
                            <li><a href="#tracker" className="hover:text-white transition-colors">Flight Status Radar</a></li>
                            <li><a href="#experience" className="hover:text-white transition-colors">Visa &amp; Entry Guidelines</a></li>
                            <li><a href="#experience" className="hover:text-white transition-colors">Baggage Allowance</a></li>
                            <li><a href="#offers" className="hover:text-white transition-colors">Promotions &amp; Vouchers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Special Assistance</a></li>
                        </ul>
                    </div>

                    {/* Legal & Simulated Disclaimer */}
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                            Compliance
                        </h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Carriage</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Preferences</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Security Disclosures</a></li>
                        </ul>
                    </div>
                </div>

                {/* Explicit Simulation Notice & Disclaimer */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 text-[11px] leading-relaxed text-slate-400 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <strong className="text-slate-300">Demonstration Notice:</strong> AirFlow is a portfolio full-stack application. Fares, flight schedules, bookings, and seat reservations displayed herein are simulated demonstration records for interactive testing and UI demonstration. No real financial charges occur.
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                    <div>© 2026 AirFlow Luxury Airlines Ltd. All Rights Reserved.</div>
                    <div className="flex items-center gap-1">
                        <span>Crafted with precision for modern luxury aviation</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
