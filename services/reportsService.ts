// services/ReportsService.ts
import apiClient from './api/apiClient';

export enum ReportPeriod {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_3_MONTHS = 'last_3_months',
  LAST_6_MONTHS = 'last_6_months',
  LAST_YEAR = 'last_year',
  CUSTOM = 'custom'
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  change: number;
  color: string;
  icon: string;
}

export interface FinancialInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  message: string;
  icon: string;
  color: string;
}

export interface QuickStats {
  incomeChange: number;
  expenseChange: number;
  savingsRate: number;
}

export interface DetailedStats {
  totalExpenses: number;
  averageMonthlyExpenses: number;
  averageMonthlySavings: number;
  savingsRate: number;
}

export interface ReportsAnalyticsResponse {
  quickStats: QuickStats;
  monthlyData: MonthlyData[];
  categorySpending: CategorySpending[];
  financialInsights: FinancialInsight[];
  detailedStats: DetailedStats;
}

export interface ReportsQuery {
  period?: ReportPeriod;
  startDate?: string;
  endDate?: string;
}

class ReportsService {
  async getReportsAnalytics(query: ReportsQuery = {}): Promise<ReportsAnalyticsResponse> {
    try {
      const params = new URLSearchParams();

      if (query.period) params.append('period', query.period);
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await apiClient.get(`/reports/analytics?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reports analytics:', error);
      throw error;
    }
  }

  async exportToPDF(query: ReportsQuery = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await apiClient.get(`/reports/export/pdf?${params.toString()}`, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  }
}

export default new ReportsService();


// import axios from 'axios';

// const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// export enum ReportPeriod {
//   LAST_7_DAYS = 'last_7_days',
//   LAST_30_DAYS = 'last_30_days',
//   LAST_3_MONTHS = 'last_3_months',
//   LAST_6_MONTHS = 'last_6_months',
//   LAST_YEAR = 'last_year',
//   CUSTOM = 'custom'
// }

// export interface MonthlyData {
//   month: string;
//   income: number;
//   expenses: number;
//   savings: number;
// }

// export interface CategorySpending {
//   category: string;
//   amount: number;
//   percentage: number;
//   change: number;
//   color: string;
//   icon: string;
// }

// export interface FinancialInsight {
//   id: string;
//   type: 'warning' | 'success' | 'info' | 'tip';
//   title: string;
//   message: string;
//   icon: string;
//   color: string;
// }

// export interface QuickStats {
//   incomeChange: number;
//   expenseChange: number;
//   savingsRate: number;
// }

// export interface DetailedStats {
//   totalExpenses: number;
//   averageMonthlyExpenses: number;
//   averageMonthlySavings: number;
//   savingsRate: number;
// }

// export interface ReportsAnalyticsResponse {
//   quickStats: QuickStats;
//   monthlyData: MonthlyData[];
//   categorySpending: CategorySpending[];
//   financialInsights: FinancialInsight[];
//   detailedStats: DetailedStats;
// }

// export interface ReportsQuery {
//   period?: ReportPeriod;
//   startDate?: string;
//   endDate?: string;
// }

// class ReportsService {
//   private getAuthHeaders() {
//     // Récupérer le token depuis le storage
//     // Pour AsyncStorage: await AsyncStorage.getItem('token')
//     const token = ''; // À remplacer par votre logique de récupération de token
//     return {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
//   }

//   async getReportsAnalytics(query: ReportsQuery = {}): Promise<ReportsAnalyticsResponse> {
//     try {
//       const params = new URLSearchParams();
      
//       if (query.period) {
//         params.append('period', query.period);
//       }
//       if (query.startDate) {
//         params.append('startDate', query.startDate);
//       }
//       if (query.endDate) {
//         params.append('endDate', query.endDate);
//       }

//       const response = await axios.get(
//         `${API_URL}/reports/analytics?${params.toString()}`,
//         {
//           headers: this.getAuthHeaders(),
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error('Error fetching reports analytics:', error);
//       throw error;
//     }
//   }

//   // Méthode pour exporter en PDF (à implémenter côté backend)
//   async exportToPDF(query: ReportsQuery = {}): Promise<Blob> {
//     try {
//       const params = new URLSearchParams();
//       if (query.period) params.append('period', query.period);
//       if (query.startDate) params.append('startDate', query.startDate);
//       if (query.endDate) params.append('endDate', query.endDate);

//       const response = await axios.get(
//         `${API_URL}/reports/export/pdf?${params.toString()}`,
//         {
//           headers: this.getAuthHeaders(),
//           responseType: 'blob',
//         }
//       );

//       return response.data;
//     } catch (error) {
//       console.error('Error exporting PDF:', error);
//       throw error;
//     }
//   }
// }

// export default new ReportsService();