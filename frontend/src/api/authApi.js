import apiClient from './axiosConfig';

export const authApi = {
  loginUser: (email, password) => apiClient.post('/auth/login', { email, password }),
  registerUser: (email, password, role) => apiClient.post('/auth/register', { email, password, role }),
};
