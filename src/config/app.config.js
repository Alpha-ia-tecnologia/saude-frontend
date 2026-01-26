const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const config = {
    app: {
        name: 'PEC - Prontuário Eletrônico do Cidadão',
        version: '2.1.0'
    },
    api: {
        baseUrl: API_URL,
        auth: `${API_URL}/auth`,
        ai: `${API_URL}/ai`
    },
    storage: {
        tokenKey: 'pec_token',
        userKey: 'pec_user'
    }
};

export default config;
