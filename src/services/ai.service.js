import { config } from '../config/app.config';

class AIService {
    constructor() {
        this.provider = 'openai';
    }

    setProvider(provider) {
        this.provider = provider;
    }

    getProvider() {
        return this.provider;
    }

    async chat(messages, options = {}) {
        const response = await fetch(`${config.api.ai}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                provider: options.provider || this.provider,
                messages: messages.map(m => ({ role: m.role, content: m.content })),
                model: options.model
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao processar mensagem');
        }

        return {
            content: data.response.content,
            model: data.response.model,
            mode: data.mode,
            provider: data.provider
        };
    }

    async getProviders() {
        const response = await fetch(`${config.api.ai}/providers`);
        const data = await response.json();
        return data.providers;
    }

    // Helper methods for specific use cases
    async analyzeSymptoms(symptoms) {
        return this.chat([
            { role: 'system', content: 'Você é um assistente médico especializado em análise de sintomas.' },
            { role: 'user', content: `Analise os seguintes sintomas: ${symptoms}` }
        ]);
    }

    async suggestDiagnosis(patientData) {
        return this.chat([
            { role: 'system', content: 'Você é um assistente de apoio à decisão clínica.' },
            { role: 'user', content: JSON.stringify(patientData) }
        ]);
    }

    async summarizeRecord(recordData) {
        return this.chat([
            { role: 'system', content: 'Resuma o prontuário do paciente de forma clara e concisa.' },
            { role: 'user', content: JSON.stringify(recordData) }
        ]);
    }
}

export const aiService = new AIService();
export default aiService;
