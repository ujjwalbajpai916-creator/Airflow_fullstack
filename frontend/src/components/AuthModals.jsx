import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Lock, Mail, User, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import authService from '../services/authService';

export default function AuthModals({ open, initialTab = 'login', onClose, onLoginSuccess }) {
    if (!open) return null;

    const [tab, setTab] = useState(initialTab); // 'login' | 'signup'

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('admin@gmail.com');
    const [loginPassword, setLoginPassword] = useState('12345');
    const [showLoginPass, setShowLoginPass] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Signup Form State
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [showSignupPass, setShowSignupPass] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');

        if (!loginEmail.trim() || !loginPassword.trim()) {
            setLoginError('Please enter your email and password.');
            return;
        }

        setIsLoggingIn(true);
        const res = await authService.login(loginEmail, loginPassword);
        setIsLoggingIn(false);

        if (res.success) {
            onLoginSuccess(res.user);
            onClose();
        } else {
            setLoginError(res.error || 'Invalid email or password.');
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setSignupError('');

        if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
            setSignupError('All fields are required.');
            return;
        }

        if (signupPassword.length < 5) {
            setSignupError('Password must be at least 5 characters.');
            return;
        }

        if (!agreeTerms) {
            setSignupError('You must agree to the Terms of Service.');
            return;
        }

        setIsSigningUp(true);
        const res = await authService.register(signupName, signupEmail, signupPassword);
        setIsSigningUp(false);

        if (res.success) {
            setSignupSuccess(true);
            setTimeout(() => {
                onLoginSuccess(res.user);
                onClose();
            }, 1200);
        } else {
            setSignupError(res.error || 'Registration failed.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-[#060A14]/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md bg-[#0E152B] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-7 z-10 overflow-hidden"
            >
                {/* Header Logo */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
                            <Plane className="w-5 h-5 text-white transform -rotate-45" />
                        </div>
                        <span className="font-extrabold text-lg text-white font-['Plus_Jakarta_Sans',sans-serif]">
                            Air<span className="text-blue-500">Flow</span>
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/30 border border-white/5 mb-6 text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => {
                            setTab('login');
                            setLoginError('');
                        }}
                        className={`py-2.5 rounded-xl transition-all ${
                            tab === 'login'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTab('signup');
                            setSignupError('');
                        }}
                        className={`py-2.5 rounded-xl transition-all ${
                            tab === 'signup'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Register
                    </button>
                </div>

                {/* LOGIN FORM */}
                {tab === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        {loginError && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                                <span>{loginError}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-blue-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="name@domain.com"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-blue-400" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showLoginPass ? 'text' : 'password'}
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLoginPass(!showLoginPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400">
                            💡 <strong>Demo Credential:</strong> Email: <code className="text-blue-300">admin@gmail.com</code> | Password: <code className="text-blue-300">12345</code>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                        >
                            {isLoggingIn ? 'Signing In...' : 'Sign In to Account'}
                        </button>
                    </form>
                )}

                {/* SIGNUP FORM */}
                {tab === 'signup' && (
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        {signupError && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                                <span>{signupError}</span>
                            </div>
                        )}

                        {signupSuccess && (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                                <span>Account created successfully! Redirecting...</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-blue-400" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                placeholder="Rahul Kumar"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-blue-400" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                placeholder="rahul@example.com"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-blue-400" />
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showSignupPass ? 'text' : 'password'}
                                    required
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    placeholder="At least 5 characters"
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSignupPass(!showSignupPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer pt-1">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="mt-0.5 rounded accent-blue-600"
                            />
                            <span>I agree to the AirFlow Terms of Service and Privacy Policy.</span>
                        </label>

                        <button
                            type="submit"
                            disabled={isSigningUp}
                            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                        >
                            {isSigningUp ? 'Creating Account...' : 'Create Free Account'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
