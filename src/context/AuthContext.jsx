import { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config/app.config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar se há sessão salva
        const savedUser = localStorage.getItem(config.storage.userKey);
        const savedToken = localStorage.getItem(config.storage.tokenKey);

        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch(`${config.api.auth}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao fazer login');
            }

            localStorage.setItem(config.storage.tokenKey, data.token);
            localStorage.setItem(config.storage.userKey, JSON.stringify(data.user));
            setUser(data.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem(config.storage.tokenKey);
        localStorage.removeItem(config.storage.userKey);
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}

export default AuthContext;
