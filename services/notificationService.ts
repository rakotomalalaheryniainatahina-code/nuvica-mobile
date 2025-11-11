import axios from 'axios';
import apiClient from './api/apiClient';

// Types
export enum NotificationType {
  BUDGET = 'BUDGET',
  BILL = 'BILL',
  GOAL = 'GOAL',
  TRANSACTION = 'TRANSACTION',
  INSIGHT = 'INSIGHT',
  SYSTEM = 'SYSTEM',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  actionable: boolean;
  actionType?: string;
  actionData?: any;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  budgetAlerts: boolean;
  billReminders: boolean;
  goalUpdates: boolean;
  transactionAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications?: boolean;
  billReminderDays: number;
  budgetThreshold: number;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface NotificationsResponse {
  notifications: Record<string, Notification[]>; // Groupé par date
  stats: {
    total: number;
    unread: number;
    highPriority: number;
  };
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface NotificationQueryParams {
  type?: NotificationType;
  isRead?: boolean;
  isArchived?: boolean;
  priority?: NotificationPriority;
  limit?: number;
  offset?: number;
}

// Service
export const notificationService = {
  /**
   * Récupérer toutes les notifications
   */
  async getAll(params?: NotificationQueryParams): Promise<NotificationsResponse> {
    try {
      const response = await apiClient.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Récupérer une notification par ID
   */
  async getOne(id: string): Promise<Notification> {
    try {
      const response = await apiClient.get(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Créer une notification
   */
  async create(data: {
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    actionable?: boolean;
    actionType?: string;
    actionData?: any;
    metadata?: any;
  }): Promise<Notification> {
    try {
      const response = await apiClient.post('/notifications', data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Mettre à jour une notification
   */
  async update(
    id: string,
    data: { isRead?: boolean; isArchived?: boolean }
  ): Promise<Notification> {
    try {
      const response = await apiClient.put(`/notifications/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Marquer comme lue
   */
  async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await apiClient.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Marquer toutes comme lues
   */
  async markAllAsRead(type?: NotificationType): Promise<any> {
    try {
      const params = type ? { type } : {};
      const response = await apiClient.put('/notifications/read-all', null, { params });
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Archiver une notification
   */
  async archive(id: string): Promise<Notification> {
    try {
      const response = await apiClient.put(`/notifications/${id}/archive`);
      return response.data;
    } catch (error) {
      console.error('Error archiving notification:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Archiver les anciennes notifications (> 7 jours)
   */
  async archiveOld(): Promise<any> {
    try {
      const response = await apiClient.put('/notifications/archive-old');
      return response.data;
    } catch (error) {
      console.error('Error archiving old notifications:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Supprimer une notification
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Supprimer toutes les notifications
   */
  async deleteAll(type?: NotificationType): Promise<void> {
    try {
      const params = type ? { type } : {};
      await apiClient.delete('/notifications', { params });
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Récupérer les statistiques
   */
  async getStats(): Promise<NotificationStats> {
    try {
      const response = await apiClient.get('/notifications/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Récupérer les paramètres de notification
   */
  async getSettings(): Promise<NotificationSettings> {
    try {
      const response = await apiClient.get('/notifications/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Mettre à jour les paramètres
   */
  async updateSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    try {
      const response = await apiClient.put('/notifications/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw this.handleError(error);
    }
  },

  /**
   * Gestion centralisée des erreurs
   */
  handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return new Error('Une erreur inattendue est survenue');
  },
};

export default notificationService;