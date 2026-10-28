/**
 * Authentication Service
 * Communicates with Flask `/api/auth` session endpoints, with demo account support when offline.
 */

import { api } from './api';

export const authService = {
    /**
     * Login user
     */
    async login(email, password) {
        // Attempt Flask API
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.ok && res.data?.success) {
                return { success: true, user: res.data.user, isDemo: false };
            } else if (res.status === 401 || res.status === 400) {
                return { success: false, error: res.error || 'Invalid email or password' };
            }
        } catch {
            // Flask offline
        }

        // Offline demo account fallback
        if (email.toLowerCase() === 'admin@gmail.com' && (password === '12345' || password === '123456')) {
            const demoUser = {
                id: 1,
                name: 'Ujjwal Bajpai (Admin)',
                email: 'admin@gmail.com',
                isDemo: true,
            };
            return { success: true, user: demoUser, isDemo: true };
        }

        return {
            success: false,
            error: 'Invalid credentials. If offline, use admin@gmail.com / 12345.',
        };
    },

    /**
     * Register user
     */
    async register(name, email, password) {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            if (res.ok && res.data?.success) {
                return { success: true, user: res.data.user, isDemo: false };
            } else if (res.status !== 0) {
                return { success: false, error: res.error || 'Registration failed' };
            }
        } catch {
            // Flask offline
        }

        // Demo registration
        const demoUser = {
            id: Date.now(),
            name,
            email,
            isDemo: true,
        };
        return { success: true, user: demoUser, isDemo: true };
    },

    /**
     * Logout
     */
    async logout() {
        try {
            await api.post('/auth/logout');
        } catch {
            // ignore
        }
        return { success: true };
    },

    /**
     * Get current authenticated user session
     */
    async getCurrentUser() {
        try {
            const res = await api.get('/auth/me');
            if (res.ok && res.data?.success) {
                return { success: true, user: res.data.user };
            }
        } catch {
            // ignore
        }
        return { success: false, user: null };
    },
};

export default authService;
