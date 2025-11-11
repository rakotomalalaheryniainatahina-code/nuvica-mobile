// services/api/budgetService.ts

import apiClient from "./api/apiClient";

export interface BudgetData {
    category: string;
    amount: number;
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    startDate: string;
    endDate: string;
}

export interface BudgetResponse extends BudgetData {
    id: string;
    userId: string;
    isActive: boolean;
    spent: number;
    percentage: number;
    remaining: number;
    createdAt: string;
    updatedAt: string;
}

export const budgetService = {
    // Créer un budget
    create: async (data: BudgetData): Promise<BudgetResponse> => {
        const response = await apiClient.post('/budgets', data);
        return response.data;
    },

    // Récupérer tous les budgets
    getAll: async (): Promise<BudgetResponse[]> => {
        const response = await apiClient.get('/budgets');
        return response.data;
    },

    // Récupérer le résumé des budgets
    getSummary: async () => {
        const response = await apiClient.get('/budgets/summary');
        return response.data;
    },

    // Récupérer un budget par ID
    getOne: async (id: string): Promise<BudgetResponse> => {
        const response = await apiClient.get(`/budgets/${id}`);
        return response.data;
    },

    // Mettre à jour un budget
    update: async (id: string, data: Partial<BudgetData>): Promise<BudgetResponse> => {
        const response = await apiClient.patch(`/budgets/${id}`, data);
        return response.data;
    },

    // Supprimer un budget
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/budgets/${id}`);
    },
};