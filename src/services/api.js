import { config } from '../config/app.config';

class ApiService {
    constructor(baseUrl = config.api.baseUrl) {
        this.baseUrl = baseUrl;
    }

    getToken() {
        return localStorage.getItem(config.storage.tokenKey);
    }

    getHeaders(customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: this.getHeaders(options.headers)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Erro de rede' }));
            throw new Error(error.error || error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiService();
export default api;
