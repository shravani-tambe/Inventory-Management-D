import apiClient from './axiosConfig';

export const analyticsApi = {
  getAnalytics: () => apiClient.get('/analytics'),
};
