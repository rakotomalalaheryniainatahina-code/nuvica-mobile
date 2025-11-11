// services/api/transactionService.ts

import apiClient from "./api/apiClient";


export interface TransactionData {
    type: 'EXPENSE' | 'INCOME';
    title: string;
    category: string;
    amount: number;
    date: string;
    description?: string;
}

export interface TransactionResponse extends TransactionData {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface QueryParams {
    type?: 'EXPENSE' | 'INCOME';
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface StatisticsResponse {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
    expensesByCategory: Record<string, number>;
    incomesByCategory: Record<string, number>;
}

export const transactionService = {
    // Créer une transaction
    create: async (data: TransactionData): Promise<TransactionResponse> => {
        const response = await apiClient.post('/transactions', data);
        return response.data;
    },

    // Récupérer toutes les transactions avec filtres
    getAll: async (params?: QueryParams): Promise<TransactionResponse[]> => {
        const response = await apiClient.get('/transactions', { params });
        return response.data;
    },

    // Récupérer une transaction par ID
    getOne: async (id: string): Promise<TransactionResponse> => {
        const response = await apiClient.get(`/transactions/${id}`);
        return response.data;
    },

    // Mettre à jour une transaction
    update: async (id: string, data: Partial<TransactionData>): Promise<TransactionResponse> => {
        const response = await apiClient.patch(`/transactions/${id}`, data);
        return response.data;
    },

    // Supprimer une transaction
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/transactions/${id}`);
    },

    // Obtenir les statistiques
    getStatistics: async (): Promise<StatisticsResponse> => {
        const response = await apiClient.get('/transactions/statistics');
        return response.data;
    },

    // Obtenir les statistiques mensuelles
    getMonthlyStatistics: async (year: number, month: number) => {
        const response = await apiClient.get(`/transactions/statistics/monthly/${year}/${month}`);
        return response.data;
    },
};