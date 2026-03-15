import { config } from '../config/app.config';

class TriageService {
    constructor() {
        this.baseUrl = `${config.api.baseUrl}/triage`;
    }

    /**
     * Register a new triage entry
     */
    async registerTriage(triageData) {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(triageData)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erro ao registrar triagem');
        }

        return data.data;
    }

    /**
     * Get priority-sorted queue
     */
    async getQueue(status = null) {
        const url = status ? `${this.baseUrl}/queue?status=${status}` : `${this.baseUrl}/queue`;
        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erro ao buscar fila');
        }

        return data.data;
    }

    /**
     * Get specific patient triage
     */
    async getPatientTriage(id) {
        const response = await fetch(`${this.baseUrl}/patient/${id}`);

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erro ao buscar triagem');
        }

        return data.data;
    }

    /**
     * Update triage data
     */
    async updateTriage(id, updateData) {
        const response = await fetch(`${this.baseUrl}/patient/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erro ao atualizar triagem');
        }

        return data.data;
    }

    /**
     * Get high-priority alerts
     */
    async getAlerts() {
        const response = await fetch(`${this.baseUrl}/alerts`);

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Erro ao buscar alertas');
        }

        return data.data;
    }
}

export const triageService = new TriageService();
export default triageService;
