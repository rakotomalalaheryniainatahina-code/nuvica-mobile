// services/api/dashboardService.ts

import apiClient from "./apiClient";

export interface DashboardStats {
    currentBalance: number;
    totalIncome: number;
    totalExpense: number;
    totalBudget: number;
    percentageChange: number;
    topCategories: Array<{ category: string; amount: number }>;
    transactionCount: number;
    lastUpdated: string;
}

export interface AlertData {
    id: string;
    type: 'INFO' | 'WARNING' | 'DANGER';
    category: string;
    message: string;
    budget: number;
    spent: number;
    percentage: number;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardResponse {
    stats: DashboardStats;
    alerts: AlertData[];
    unreadAlertsCount: number;
}

export const dashboardService = {
    // Récupérer toutes les données du dashboard
    getDashboard: async (): Promise<DashboardResponse> => {
        const response = await apiClient.get('/dashboard');
        return response.data;
    },

    // Récupérer uniquement les statistiques
    getStats: async (): Promise<DashboardStats> => {
        const response = await apiClient.get('/dashboard/stats');
        return response.data;
    },

    // Générer les alertes manuellement
    generateAlerts: async (): Promise<AlertData[]> => {
        const response = await apiClient.post('/alerts/generate');
        return response.data;
    },

    // Marquer une alerte comme lue
    markAlertAsRead: async (alertId: string): Promise<AlertData> => {
        const response = await apiClient.patch(`/alerts/${alertId}/read`);
        return response.data;
    },

    // Marquer toutes les alertes comme lues
    markAllAlertsAsRead: async (): Promise<void> => {
        await apiClient.patch('/alerts/read-all');
    },

    // Supprimer une alerte
    deleteAlert: async (alertId: string): Promise<void> => {
        await apiClient.delete(`/alerts/${alertId}`);
    },
};