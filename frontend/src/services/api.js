/**
 * Centralized API Client for AirFlow Frontend
 * Connects to Flask backend (`/api`) with automatic timeout and fallback detection.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function request(endpoint, options = {}) {
    const {
        method = 'GET',
        body = null,
        headers = {},
        timeout = 4000,
        ...customConfig
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers,
        },
        credentials: 'include',
        signal: controller.signal,
        ...customConfig,
    };

    if (body) {
        config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { success: response.ok, message: text };
        }

        if (!response.ok) {
            return {
                ok: false,
                status: response.status,
                data: null,
                error: data?.message || `Request failed with status ${response.status}`,
            };
        }

        return {
            ok: true,
            status: response.status,
            data,
            error: null,
        };
    } catch (err) {
        clearTimeout(timeoutId);
        const isAbort = err.name === 'AbortError';
        return {
            ok: false,
            status: 0,
            data: null,
            error: isAbort ? 'API connection timed out. Falling back to simulated data.' : err.message || 'Network error',
            isNetworkError: true,
        };
    }
}

export const api = {
    get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
    delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
