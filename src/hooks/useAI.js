import { useState, useCallback } from 'react';
import { aiService } from '../services/ai.service';

export function useAI(initialProvider = 'deepseek') {
    const [provider, setProvider] = useState(initialProvider);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (messages, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await aiService.chat(messages, {
                provider: options.provider || provider,
                model: options.model
            });
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [provider]);

    const analyzeSymptoms = useCallback(async (symptoms) => {
        setLoading(true);
        setError(null);

        try {
            return await aiService.analyzeSymptoms(symptoms);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const changeProvider = useCallback((newProvider) => {
        setProvider(newProvider);
        aiService.setProvider(newProvider);
    }, []);

    return {
        provider,
        loading,
        error,
        sendMessage,
        analyzeSymptoms,
        changeProvider,
        clearError: () => setError(null)
    };
}

export default useAI;
