import { config } from '../config/app.config';

class ClinicalDecisionService {
    constructor() {
        this.baseUrl = `${config.api.baseUrl}/clinical-decision`;
    }

    /**
     * Analyze symptoms and get possible diagnoses
     */
    async analyzeSymptoms(symptoms, patientData = {}) {
        const response = await fetch(`${this.baseUrl}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms, patientData })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erro ao analisar sintomas');
        }

        return data.data;
    }

    /**
     * Get AI-powered insights
     */
    async getAIInsights(symptoms, patientData, diagnoses, provider = 'deepseek') {
        const response = await fetch(`${this.baseUrl}/ai-insights`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms, patientData, diagnoses, provider })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erro ao gerar insights');
        }

        return data.data;
    }

    /**
     * Get detailed recommendations for a diagnosis
     */
    async getRecommendations(diagnosis) {
        const response = await fetch(`${this.baseUrl}/recommendations/${encodeURIComponent(diagnosis)}`);

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erro ao buscar recomendações');
        }

        return data.data;
    }
}

export const clinicalDecisionService = new ClinicalDecisionService();
export default clinicalDecisionService;
