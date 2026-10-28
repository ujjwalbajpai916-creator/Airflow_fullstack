import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Menu, X, User, LogOut, ChevronDown, Compass, Shield, Bell } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout, onNavigate }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Book Flights', href: '#search' },
        { label: 'Destinations', href: '#destinations' },
        { label: 'Offers', href: '#offers' },
        { label: 'Flight Tracker', href: '#tracker' },
        { label: 'Experience', href: '#experience' },
    ];

    const handleLinkClick = (e, href) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#0A0F1E]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
                    : 'bg-gradient-to-b from-[#0A0F1E]/80 via-[#0A0F1E]/40 to-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Brand Logo */}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3 group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                        <Plane className="w-5 h-5 text-white transform -rotate-45" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                                Air<span className="text-blue-500">Flow</span>
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                LUXE
                            </span>
                        </div>
                        <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-wider">
                            Aviation &amp; Travel
                        </span>
                    </div>
                </a>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Right Action Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all text-sm"
                            >
                                <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                                    {user.name ? user.name[0].toUpperCase() : 'U'}
                                </div>
                                <span className="font-medium text-slate-200 max-w-[120px] truncate">
                                    {user.name || 'Passenger'}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            <AnimatePresence>
                                {userDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0E152B] border border-white/10 shadow-2xl p-2 z-50"
                                    >
                                        <div className="px-3 py-2 border-b border-white/5">
                                            <p className="text-xs text-slate-400">Signed in as</p>
                                            <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                                            {user.isDemo && (
                                                <span className="inline-block mt-1 text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                                    Demo Mode User
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setUserDropdownOpen(false);
                                                onLogout();
                                            }}
                                            className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onOpenAuth('login')}
                                className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => onOpenAuth('signup')}
                                className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Register
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className="flex items-center md:hidden gap-2">
                    {user && (
                        <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                            {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-white/10 px-4 pt-3 pb-6 overflow-hidden"
                    >
                        <div className="flex flex-col gap-1.5">
                            {navLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-2 text-xs text-slate-400">
                                        Signed in: <span className="text-white font-medium">{user.email}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            onLogout();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-400 bg-rose-500/10 rounded-lg"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            onOpenAuth('login');
                                        }}
                                        className="px-4 py-2.5 text-sm font-medium text-slate-200 bg-white/5 rounded-lg border border-white/10"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            onOpenAuth('signup');
                                        }}
                                        className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md"
                                    >
                                        Register
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
