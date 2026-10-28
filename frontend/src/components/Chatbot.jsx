import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, User } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
    'What is the baggage allowance for Economy?',
    'How do I cancel or reschedule my flight?',
    'Show me flights to Dubai (DXB)',
    'What amenities are in Business Class?',
];

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: 'Hello! I am AirFlow Concierge. How may I assist your travel plans today?',
            time: 'Just now',
        },
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (open) scrollToBottom();
    }, [messages, open]);

    const handleSend = (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: query,
            time: 'Just now',
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');

        // Generate intelligent contextual response
        setTimeout(() => {
            let botReply = "I'm here to help with your flight booking, baggage rules, seat assignments, and live flight radar tracking.";
            const q = query.toLowerCase();

            if (q.includes('baggage') || q.includes('luggage')) {
                botReply = 'Economy tickets include 7 kg cabin baggage and 15 kg check-in baggage. Business suites include 10 kg cabin baggage and up to 35-40 kg check-in allowance.';
            } else if (q.includes('cancel') || q.includes('refund')) {
                botReply = 'AirFlow Flex fares allow free cancellations up to 24 hours prior to departure. Standard fares may incur a nominal carrier rescheduling fee.';
            } else if (q.includes('dubai') || q.includes('dxb')) {
                botReply = 'We operate daily non-stop Boeing 777 flights between Delhi (DEL) and Dubai (DXB) starting from ₹14,800. Use the search bar above to see schedules!';
            } else if (q.includes('business') || q.includes('suite') || q.includes('amenities')) {
                botReply = 'Business class passengers enjoy 180° lie-flat suites, Michelin-inspired dining, high-speed satellite Wi-Fi, priority boarding, and luxury airport lounge access.';
            } else if (q.includes('hi') || q.includes('hello')) {
                botReply = 'Greetings! Are you planning a domestic escape or an international luxury getaway today?';
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: botReply,
                    time: 'Just now',
                },
            ]);
        }, 500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 border border-white/20 cursor-pointer"
                aria-label="Toggle AI Concierge"
            >
                {open ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>

            {/* Chatbot Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-16 right-0 w-[90vw] sm:w-96 rounded-3xl bg-[#0E152B] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[480px]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <span>AirFlow Concierge</span>
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    </div>
                                    <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Online • AI Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Box */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex items-start gap-2 ${
                                        m.sender === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {m.sender === 'bot' && (
                                        <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                            <Bot className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[78%] p-3 rounded-2xl ${
                                            m.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                        }`}
                                    >
                                        <p className="leading-relaxed">{m.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Prompts */}
                        <div className="p-2 border-t border-white/5 bg-black/20 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
                            {SUGGESTED_QUESTIONS.map((q, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSend(q)}
                                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 whitespace-nowrap"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Input Footer */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#0A0F1E]"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about baggage, check-in, flights..."
                                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-blue-500"
                            />
                            <button
                                type="submit"
                                className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow transition-colors"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
