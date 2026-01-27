import { config } from '../config/app.config';

class AIService {
    constructor() {
        // DeepSeek como provedor padrão
        this.provider = 'deepseek';
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
            { role: 'system', content: 'Você é o assistente de IA do PEC (Prontuário Eletrônico do Cidadão). Analise sintomas e sugira diagnósticos diferenciais, exames e alertas. Lembre-se que suas sugestões são apoio à decisão do profissional de saúde.' },
            { role: 'user', content: `Analise os seguintes sintomas: ${symptoms}` }
        ]);
    }

    async suggestDiagnosis(patientData) {
        return this.chat([
            { role: 'system', content: 'Você é o assistente de IA do PEC (Prontuário Eletrônico do Cidadão). Forneça apoio à decisão clínica baseada em evidências e protocolos do SUS. Suas sugestões são apoio à decisão do profissional de saúde.' },
            { role: 'user', content: JSON.stringify(patientData) }
        ]);
    }

    async summarizeRecord(recordData) {
        return this.chat([
            { role: 'system', content: 'Você é o assistente de IA do PEC (Prontuário Eletrônico do Cidadão). Resuma o prontuário do paciente de forma clara, destacando informações relevantes para o atendimento.' },
            { role: 'user', content: JSON.stringify(recordData) }
        ]);
    }
}

export const aiService = new AIService();
export default aiService;
