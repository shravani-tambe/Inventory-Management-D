import apiClient from './axiosConfig';

export const alertsApi = {
  getAlerts: (params = {}) => apiClient.get('/alerts', { params }),
  markAlertRead: (id) => apiClient.patch(`/alerts/${id}`, { is_read: true }),
};
