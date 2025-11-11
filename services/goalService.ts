// services/api/goalService.ts

import apiClient from "./api/apiClient";

export interface GoalData {
    title: string;
    description?: string;
    targetAmount: number;
    currentAmount?: number;
    deadline: string;
    category: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    icon?: string;
    color?: string;
}

export interface GoalResponse extends GoalData {
    id: string;
    userId: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
    isCompleted: boolean;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
    // Champs calculés
    percentage: number;
    remaining: number;
    daysLeft: number;
    isOverdue?: boolean;
}

export interface GoalStatistics {
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    pausedGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    totalRemaining: number;
    overallProgress: number;
    urgentGoals: number;
    completionRate: number;
    goalsByCategory: Record<string, {
        count: number;
        totalTarget: number;
        totalCurrent: number;
    }>;
}

export const goalService = {
    // Créer un objectif
    create: async (data: GoalData): Promise<GoalResponse> => {
        const response = await apiClient.post('/goals', data);
        return response.data;
    },

    // Récupérer tous les objectifs
    getAll: async (status?: string): Promise<GoalResponse[]> => {
        const params = status ? { status } : {};
        const response = await apiClient.get('/goals', { params });
        return response.data;
    },

    // Récupérer un objectif par ID
    getOne: async (id: string): Promise<GoalResponse> => {
        const response = await apiClient.get(`/goals/${id}`);
        return response.data;
    },

    // Mettre à jour un objectif
    update: async (id: string, data: Partial<GoalData>): Promise<GoalResponse> => {
        const response = await apiClient.patch(`/goals/${id}`, data);
        return response.data;
    },

    // Supprimer un objectif
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/goals/${id}`);
    },

    // Ajouter une contribution
    addContribution: async (id: string, amount: number, note?: string): Promise<GoalResponse> => {
        const response = await apiClient.post(`/goals/${id}/contribute`, { amount, note });
        return response.data;
    },

    // Retirer de l'argent
    withdraw: async (id: string, amount: number): Promise<GoalResponse> => {
        const response = await apiClient.post(`/goals/${id}/withdraw`, { amount });
        return response.data;
    },

    // Changer le statut
    updateStatus: async (id: string, status: string): Promise<GoalResponse> => {
        const response = await apiClient.patch(`/goals/${id}/status`, { status });
        return response.data;
    },

    // Obtenir les statistiques
    getStatistics: async (): Promise<GoalStatistics> => {
        const response = await apiClient.get('/goals/statistics');
        return response.data;
    },

    // Obtenir les objectifs urgents
    getUrgent: async (): Promise<GoalResponse[]> => {
        const response = await apiClient.get('/goals/urgent');
        return response.data;
    },

    // Obtenir les objectifs complétés
    getCompleted: async (): Promise<GoalResponse[]> => {
        const response = await apiClient.get('/goals/completed');
        return response.data;
    },
};