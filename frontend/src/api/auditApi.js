import apiClient from './axiosConfig';

export const auditApi = {
  getAuditLogs: () => apiClient.get('/audit-logs'),
};
