import analyticsService, { AnalyticsResponse } from '@/services/analyticsService';
import { useState, useEffect, useCallback } from 'react';

export const useAnalytics = (months: number = 7) => {
    const [data, setData] = useState<AnalyticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadAnalytics = useCallback(async () => {
        try {
            setError(null);
            const analyticsData = await analyticsService.getReports(months);
            setData(analyticsData);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des données');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [months]);

    const refresh = useCallback(() => {
        setRefreshing(true);
        loadAnalytics();
    }, [loadAnalytics]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    return {
        data,
        loading,
        error,
        refreshing,
        refresh,
        reload: loadAnalytics,
    };
};