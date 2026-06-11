import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import { alertsApi } from '../../api/alertsApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/formatters';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, critical

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'unread') params.is_read = false;
      if (filter === 'critical') params.severity = 'critical';

      const response = await alertsApi.getAlerts(params);
      setAlerts(response.data.data ? response.data.data : response.data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await alertsApi.markAlertRead(id);
      // Update UI locally to reflect the change immediately
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Alerts" 
        subtitle="System and stock notifications"
      />

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['all', 'unread', 'critical'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'capitalize',
              border: '1px solid',
              borderColor: filter === f ? '#2563eb' : '#e5e7eb',
              background: filter === f ? '#eff6ff' : '#fff',
              color: filter === f ? '#2563eb' : '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading alerts..." />
      ) : alerts.length === 0 ? (
        <EmptyState message={`No ${filter === 'all' ? '' : filter} alerts found`} />
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Severity</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => (
                <tr key={alert.id} style={{ 
                  borderTop: '1px solid #f3f4f6',
                  opacity: alert.is_read ? 0.6 : 1,
                  background: alert.is_read ? '#f9fafb' : '#fff',
                  transition: 'opacity 0.3s'
                }}>
                  <td style={{ padding: '16px 20px' }}>
                    <StatusBadge status={alert.severity} type="alert" />
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#111827', fontWeight: alert.is_read ? '400' : '500' }}>
                    {alert.message}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#6b7280' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {alert.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#6b7280' }}>
                    {formatDateTime(alert.created_at)}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      disabled={alert.is_read}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: alert.is_read ? '#e5e7eb' : '#d1d5db',
                        background: alert.is_read ? '#f3f4f6' : '#fff',
                        color: alert.is_read ? '#9ca3af' : '#374151',
                        cursor: alert.is_read ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {alert.is_read ? 'Read' : 'Mark as read'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
};

export default AlertsPage;
