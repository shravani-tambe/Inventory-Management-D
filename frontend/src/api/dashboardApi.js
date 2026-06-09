import apiClient from './axiosConfig';

export const dashboardApi = {
  getOrderStats: () => apiClient.get('/dashboard'),
  getProductStats: () => apiClient.get('/products/dashboard'),
};