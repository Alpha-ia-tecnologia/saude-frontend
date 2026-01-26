import { config } from '../config/app.config';

class AuthService {
    async login(username, password) {
        const response = await fetch(`${config.api.auth}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login');
        }

        this.setSession(data.token, data.user);
        return data;
    }

    async logout() {
        const token = this.getToken();

        try {
            await fetch(`${config.api.auth}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.warn('Erro ao fazer logout no servidor:', error);
        }

        this.clearSession();
    }

    async getMe() {
        const token = this.getToken();
        if (!token) return null;

        const response = await fetch(`${config.api.auth}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            this.clearSession();
            return null;
        }

        return response.json();
    }

    setSession(token, user) {
        localStorage.setItem(config.storage.tokenKey, token);
        localStorage.setItem(config.storage.userKey, JSON.stringify(user));
    }

    clearSession() {
        localStorage.removeItem(config.storage.tokenKey);
        localStorage.removeItem(config.storage.userKey);
    }

    getToken() {
        return localStorage.getItem(config.storage.tokenKey);
    }

    getUser() {
        const user = localStorage.getItem(config.storage.userKey);
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

export const authService = new AuthService();
export default authService;
